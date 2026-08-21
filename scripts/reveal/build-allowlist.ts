/**
 * Mint allowlist merkle trees — TWO phases, two trees:
 *   PRIMARY   — partner-collection holders (.allowlist/holders.json)
 *   COMMUNITY — the whitelist table (tweet_ok = true)
 * Leaves are keccak256(abi.encodePacked(address)); pairs hashed sorted
 * (OpenZeppelin MerkleProof-compatible).
 *
 * Outputs .allowlist/tree-primary.json + tree-community.json and prints
 * both roots (constructor args for GriftersMint).
 *
 * Run: set -a; source .env.local; set +a; npx tsx scripts/reveal/build-allowlist.ts
 */
import fs from "node:fs";
import path from "node:path";
import { keccak256, encodePacked, getAddress } from "viem";

const OUT = path.join(process.cwd(), ".allowlist");

function hashPair(a: `0x${string}`, b: `0x${string}`): `0x${string}` {
  const [lo, hi] = a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a];
  return keccak256(encodePacked(["bytes32", "bytes32"], [lo, hi]));
}

function buildTree(wallets: string[], file: string, label: string) {
  const sorted = [...new Set(wallets)].sort();
  const leaves = sorted.map((w) => keccak256(encodePacked(["address"], [w as `0x${string}`])));
  const layers: `0x${string}`[][] = [leaves];
  while (layers[layers.length - 1].length > 1) {
    const prev = layers[layers.length - 1];
    const next: `0x${string}`[] = [];
    for (let i = 0; i < prev.length; i += 2) {
      next.push(i + 1 < prev.length ? hashPair(prev[i], prev[i + 1]) : prev[i]);
    }
    layers.push(next);
  }
  const root = layers[layers.length - 1][0];

  // self-check a middle proof
  let idx = Math.floor(sorted.length / 2);
  let node = leaves[idx];
  for (let l = 0; l < layers.length - 1; l++) {
    const sib = idx ^ 1;
    if (sib < layers[l].length) node = hashPair(node, layers[l][sib]);
    idx = Math.floor(idx / 2);
  }
  if (node !== root) throw new Error(`${label}: self-check failed`);

  fs.writeFileSync(path.join(OUT, file), JSON.stringify({ root, wallets: sorted, layers }));
  console.log(`${label}: ${sorted.length} wallets — root ${root}`);
  return root;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  // COMMUNITY — whitelist table
  const community: string[] = [];
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) throw new Error("SUPABASE_DB_URL required for the community list");
  const { Client } = await import("pg");
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const r = await client.query("select wallet from whitelist");
    for (const row of r.rows as { wallet: string }[]) {
      try {
        community.push(getAddress(row.wallet.trim()));
      } catch {}
    }
  } finally {
    await client.end().catch(() => {});
  }

  // PRIMARY — partner holders snapshot
  const holdersPath = path.join(OUT, "holders.json");
  if (!fs.existsSync(holdersPath)) throw new Error("run enumerate-holders.ts first");
  const { holders } = JSON.parse(fs.readFileSync(holdersPath, "utf8")) as { holders: string[] };
  const primary: string[] = [];
  for (const h of holders) {
    try {
      primary.push(getAddress(h));
    } catch {}
  }

  const primaryRoot = buildTree(primary, "tree-primary.json", "PRIMARY (partner holders)");
  const communityRoot = buildTree(community, "tree-community.json", "COMMUNITY (whitelist)");
  console.log("\nPRIMARY_ROOT=" + primaryRoot);
  console.log("COMMUNITY_ROOT=" + communityRoot);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
