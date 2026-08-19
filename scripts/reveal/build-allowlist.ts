/**
 * Allowlist merkle tree for GriftersMint — leaves are
 * keccak256(abi.encodePacked(address)), pairs hashed sorted
 * (OpenZeppelin MerkleProof-compatible).
 *
 * Sources:
 *  - Supabase whitelist table (tweet_ok = true)
 *  - partner-collection holders snapshot (/tmp/holders.json)
 *
 * Outputs:
 *  - .allowlist/tree.json  (addresses + layers — served by the proof API)
 *  - prints the merkle root (constructor arg for GriftersMint)
 *
 * Run: set -a; source .env.local; set +a; npx tsx scripts/reveal/build-allowlist.ts
 */
import fs from "node:fs";
import path from "node:path";
import { keccak256, encodePacked, getAddress } from "viem";

const OUT = path.join(process.cwd(), ".allowlist");

async function loadWallets(): Promise<string[]> {
  const set = new Set<string>();

  // 1) whitelist table
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (dbUrl) {
    const { Client } = await import("pg");
    const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    await client.connect();
    try {
      const r = await client.query("select wallet from whitelist where tweet_ok = true");
      for (const row of r.rows as { wallet: string }[]) {
        try {
          set.add(getAddress(row.wallet.trim()));
        } catch {}
      }
      console.log(`whitelist table: ${r.rowCount} rows`);
    } finally {
      await client.end().catch(() => {});
    }
  } else {
    console.log("no SUPABASE_DB_URL — skipping whitelist table");
  }

  // 2) partner holders snapshot (from enumerate-holders.ts)
  const holdersPath = path.join(OUT, "holders.json");
  if (fs.existsSync(holdersPath)) {
    const { holders } = JSON.parse(fs.readFileSync(holdersPath, "utf8")) as { holders: string[] };
    let added = 0;
    for (const h of holders) {
      try {
        set.add(getAddress(h));
        added++;
      } catch {}
    }
    console.log(`partner holders: ${added}`);
  } else {
    console.log("WARNING: .allowlist/holders.json missing — run enumerate-holders.ts first");
  }

  return [...set].sort();
}

function hashPair(a: `0x${string}`, b: `0x${string}`): `0x${string}` {
  const [lo, hi] = a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a];
  return keccak256(encodePacked(["bytes32", "bytes32"], [lo, hi]));
}

async function main() {
  const wallets = await loadWallets();
  if (wallets.length === 0) throw new Error("no wallets");
  console.log(`total unique allowlisted wallets: ${wallets.length}`);

  const leaves = wallets.map((w) => keccak256(encodePacked(["address"], [w as `0x${string}`])));
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

  // self-check: verify a proof the same way MerkleProof.verify does
  const proofFor = (idx: number) => {
    const proof: `0x${string}`[] = [];
    for (let l = 0; l < layers.length - 1; l++) {
      const sib = idx ^ 1;
      if (sib < layers[l].length) proof.push(layers[l][sib]);
      idx = Math.floor(idx / 2);
    }
    return proof;
  };
  const testIdx = Math.floor(wallets.length / 2);
  let node = leaves[testIdx];
  for (const p of proofFor(testIdx)) node = hashPair(node, p);
  if (node !== root) throw new Error("self-check failed");
  console.log("proof self-check: OK");

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "tree.json"), JSON.stringify({ root, wallets, layers }));
  console.log("ALLOWLIST ROOT:", root);
  console.log(`tree written: .allowlist/tree.json (${wallets.length} wallets)`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
