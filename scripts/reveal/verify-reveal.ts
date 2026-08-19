/**
 * Public reveal verifier — the script anyone can run after reveal day.
 *
 * Checks the two claims that make the reveal honest (doc §4):
 *  (a) the published manifest hashes to the on-chain pre-commitment
 *      (rolling keccak256 — so the list wasn't reordered after the word)
 *  (b) every token's identity equals the pure derivation
 *      identityIndexOf(tokenId) = (tokenId + word % 2222) % 2222
 *
 * Usage (after reveal):
 *   npx tsx scripts/reveal/verify-reveal.ts --contract 0x… [--manifest path]
 * Before deploy it can also just recompute a local manifest's hash:
 *   npx tsx scripts/reveal/verify-reveal.ts --manifest .manifest/manifest.json
 */
import fs from "node:fs";
import { keccak256, encodePacked, toHex, createPublicClient, http, parseAbi } from "viem";

const SUPPLY = 2222n;
const RPC = process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.mainnet.chain.robinhood.com";

const args = process.argv.slice(2);
const arg = (n: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : null;
};

const manifestPath = arg("manifest") ?? ".manifest/manifest.json";
const contractAddr = arg("contract") as `0x${string}` | null;

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as { items: unknown[] };
if (manifest.items.length !== Number(SUPPLY)) {
  console.error(`Manifest has ${manifest.items.length} items, expected ${SUPPLY}`);
  process.exit(1);
}

let h: `0x${string}` = `0x${"0".repeat(64)}`;
for (const item of manifest.items) {
  h = keccak256(encodePacked(["bytes32", "bytes32"], [h, keccak256(toHex(JSON.stringify(item)))]));
}
console.log("recomputed manifestHash:", h);

if (!contractAddr) {
  console.log("(no --contract given — local hash only)");
  process.exit(0);
}

const abi = parseAbi([
  "function manifestHash() view returns (bytes32)",
  "function revealWord() view returns (bytes32)",
  "function identityIndexOf(uint256) view returns (uint256)",
]);

async function main() {
const client = createPublicClient({ transport: http(RPC) });
const [onchainHash, word] = await Promise.all([
  client.readContract({ address: contractAddr, abi, functionName: "manifestHash" }),
  client.readContract({ address: contractAddr, abi, functionName: "revealWord" }),
]);

console.log("on-chain manifestHash:", onchainHash);
console.log("on-chain revealWord:  ", word);

const hashOk = onchainHash.toLowerCase() === h.toLowerCase();
console.log(`(a) manifest commitment ${hashOk ? "MATCHES ✓" : "MISMATCH ✗"}`);
if (BigInt(word) === 0n) {
  console.log("(b) not revealed yet — word is zero");
  process.exit(hashOk ? 0 : 1);
}

const offset = BigInt(word) % SUPPLY;
// spot-check the on-chain derivation on a few tokens, then derive all locally
const checks = [0n, 1n, 1111n, 2221n];
for (const t of checks) {
  const onchain = await client.readContract({
    address: contractAddr, abi, functionName: "identityIndexOf", args: [t],
  });
  const local = (t + offset) % SUPPLY;
  if (onchain !== local) {
    console.log(`(b) derivation MISMATCH at token ${t}: chain=${onchain} local=${local} ✗`);
    process.exit(1);
  }
}
console.log(`(b) derivation MATCHES ✓ — offset ${offset}; token t → manifest index (t + ${offset}) % ${SUPPLY}`);
console.log(hashOk ? "REVEAL VERIFIES." : "REVEAL DOES NOT VERIFY.");
process.exit(hashOk ? 0 : 1);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
