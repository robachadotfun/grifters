/**
 * Sealed manifest builder — the commit-before-entropy half of the
 * DERP-conductor reveal (doc §4).
 *
 * Builds the ordered 2,222-identity list, shuffles it with a SECRET
 * salt, and computes the rolling-hash commitment
 *   h[n+1] = keccak256(h[n] || keccak256(itemJson[n])),  h[0] = 0x00…00
 * The HASH goes on-chain at deploy (constructor arg). The manifest file
 * itself stays in .manifest/ (gitignored) and MUST stay secret until
 * the word lands — a leaked manifest re-opens targeted resampling.
 *
 * Input: either a final metadata file (--in metadata.jsonl, one JSON
 * object per line, already in canonical pre-shuffle order), or, until
 * the full art pipeline exists, a deterministic placeholder roster
 * built from the 16 archetypes (--placeholder).
 *
 * Usage:
 *   npx tsx scripts/reveal/build-manifest.ts --placeholder --salt "<long random secret>"
 *   npx tsx scripts/reveal/build-manifest.ts --in final-metadata.jsonl --salt "<secret>"
 */
import fs from "node:fs";
import path from "node:path";
import { keccak256, encodePacked, toHex } from "viem";

const SUPPLY = 2222;
const OUT_DIR = path.join(process.cwd(), ".manifest");

const args = process.argv.slice(2);
function arg(name: string): string | null {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? (args[i + 1] ?? "") : null;
}

const salt = arg("salt");
if (!salt || salt.length < 16) {
  console.error("Provide --salt with at least 16 chars of real randomness (this is the shuffle secret).");
  process.exit(1);
}

const ARCHETYPES = [
  "THE ICON", "THE CHAMPION", "THE ORIGINAL", "THE INTERNET", "THE LEGACY",
  "THE HITMAKER", "THE STARBOY", "THE POP PRINCE", "THE MOGUL", "THE MOMAGER",
  "THE RUNWAY", "THE EMPIRE", "THE VISIONARY", "THE PLUG", "THE HEARTTHROB", "THE SONGBIRD",
];

type Item = Record<string, unknown>;

let items: Item[];
const inFile = arg("in");
if (inFile) {
  items = fs
    .readFileSync(inFile, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as Item);
  if (items.length !== SUPPLY) {
    console.error(`Expected ${SUPPLY} metadata lines, got ${items.length}`);
    process.exit(1);
  }
} else if (args.includes("--placeholder")) {
  // Deterministic placeholder roster: even spread across the 16
  // archetypes with serials. Replace with real metadata before deploy.
  items = Array.from({ length: SUPPLY }, (_, i) => ({
    identity: i,
    archetype: ARCHETYPES[i % ARCHETYPES.length],
    serial: Math.floor(i / ARCHETYPES.length) + 1,
    placeholder: true,
  }));
} else {
  console.error("Pass --in <metadata.jsonl> or --placeholder");
  process.exit(1);
}

// —— secret Fisher–Yates shuffle keyed by the salt ————————————————
// Deterministic given (salt, items): re-runnable for audit AFTER the
// salt is disclosed alongside the manifest on reveal day.
function prng(saltStr: string) {
  let counter = 0;
  let bufferHex = "";
  return () => {
    if (bufferHex.length < 12) {
      bufferHex = keccak256(encodePacked(["string", "uint256"], [saltStr, BigInt(counter++)])).slice(2);
    }
    const chunk = bufferHex.slice(0, 12);
    bufferHex = bufferHex.slice(12);
    return parseInt(chunk, 16) / 0xffffffffffff;
  };
}
const rand = prng(salt);
for (let i = items.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [items[i], items[j]] = [items[j], items[i]];
}

// —— rolling-hash commitment ————————————————————————————————————————
let h: `0x${string}` = `0x${"0".repeat(64)}`;
const itemHashes: string[] = [];
for (const item of items) {
  const itemHash = keccak256(toHex(JSON.stringify(item)));
  itemHashes.push(itemHash);
  h = keccak256(encodePacked(["bytes32", "bytes32"], [h, itemHash]));
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(OUT_DIR, "manifest.json"),
  JSON.stringify({ supply: SUPPLY, generatedAt: new Date().toISOString(), items }, null, 1),
);
fs.writeFileSync(path.join(OUT_DIR, "item-hashes.json"), JSON.stringify(itemHashes));
fs.writeFileSync(
  path.join(OUT_DIR, "COMMITMENT.txt"),
  `manifestHash (rolling keccak256): ${h}\n` +
    `scheme: h[0]=0x0; h[n+1]=keccak256(h[n] || keccak256(utf8(JSON.stringify(item[n]))))\n` +
    `supply: ${SUPPLY}\n` +
    `salt: KEPT SEPARATELY — disclose with the manifest on reveal day\n`,
);

console.log("manifestHash:", h);
console.log(`sealed manifest written to ${OUT_DIR}/ (gitignored — keep secret until reveal)`);
console.log("→ pass this hash as the constructor's manifestHash_ at deploy.");
