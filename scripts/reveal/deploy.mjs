/**
 * GriftersReveal deployer — run this YOURSELF; the private key is read
 * from the DEPLOYER_KEY environment variable in YOUR terminal session
 * and never leaves your machine. Never paste the key into chats, files,
 * or commits.
 *
 * Usage (one line, from the repo root):
 *   DEPLOYER_KEY=0x<key> node scripts/reveal/deploy.mjs \
 *     --manifest-hash 0x<hash from build-manifest.ts> \
 *     --reveal-not-before "2026-08-22T18:00:00Z"
 *
 * Prints the deployed address. Verification on Blockscout is a separate
 * keyless step: node scripts/reveal/verify-contract.mjs --address 0x…
 */
import fs from "node:fs";
import { createWalletClient, createPublicClient, http, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const args = process.argv.slice(2);
const arg = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : null;
};

const KEY = process.env.DEPLOYER_KEY;
if (!KEY || !/^0x[0-9a-fA-F]{64}$/.test(KEY)) {
  console.error("Set DEPLOYER_KEY=0x<64 hex chars> in your own shell (never share it).");
  process.exit(1);
}
const manifestHash = arg("manifest-hash");
const notBeforeIso = arg("reveal-not-before");
if (!manifestHash || !/^0x[0-9a-fA-F]{64}$/.test(manifestHash)) {
  console.error("--manifest-hash 0x… required (from build-manifest.ts output)");
  process.exit(1);
}
if (!notBeforeIso || Number.isNaN(Date.parse(notBeforeIso))) {
  console.error('--reveal-not-before "<ISO datetime>" required (earliest beginReveal moment)');
  process.exit(1);
}

const CONDUCTOR = "0x003e29260EF2f762e7f2d95C3d2b7A7f6234BcDE";
const chain = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.mainnet.chain.robinhood.com"] } },
});

const { abi, bytecode } = JSON.parse(fs.readFileSync("contracts/GriftersReveal.build.json", "utf8"));
const account = privateKeyToAccount(KEY);
const wallet = createWalletClient({ account, chain, transport: http() });
const client = createPublicClient({ chain, transport: http() });

const notBefore = BigInt(Math.floor(Date.parse(notBeforeIso) / 1000));
console.log("deployer:", account.address);
console.log("conductor:", CONDUCTOR);
console.log("manifestHash:", manifestHash);
console.log("revealNotBefore:", notBeforeIso, `(${notBefore})`);

const bal = await client.getBalance({ address: account.address });
console.log("deployer balance:", Number(bal) / 1e18, "ETH");
if (bal === 0n) {
  console.error("Deployer has zero balance on Robinhood Chain — fund it first.");
  process.exit(1);
}

const hash = await wallet.deployContract({
  abi,
  bytecode,
  args: [CONDUCTOR, manifestHash, notBefore],
});
console.log("deploy tx:", hash);
const receipt = await client.waitForTransactionReceipt({ hash });
console.log("STATUS:", receipt.status);
console.log("CONTRACT ADDRESS:", receipt.contractAddress);
console.log("\nNext: node scripts/reveal/verify-contract.mjs --address", receipt.contractAddress);
