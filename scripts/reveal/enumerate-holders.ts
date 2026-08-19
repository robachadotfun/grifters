/**
 * Partner-collection holder snapshot — enumerates holders of every
 * HOLDER_CONTRACTS collection via Blockscout v2 APIs and writes
 * .allowlist/holders.json (persistent, gitignored). Checkpointed and
 * resumable; re-run until "COMPLETE".
 *
 * Run: npx tsx scripts/reveal/enumerate-holders.ts
 */
import fs from "node:fs";
import path from "node:path";
import { HOLDER_CONTRACTS } from "../../src/lib/holdings";

const OUT_DIR = path.join(process.cwd(), ".allowlist");
const OUT = path.join(OUT_DIR, "holders.json");
const CKPT = path.join(OUT_DIR, "holders-ckpt.json");

const BS: Record<string, string> = {
  robinhood: "https://robinhoodchain.blockscout.com",
  ethereum: "https://eth.blockscout.com",
  base: "https://base.blockscout.com",
};
const MAX_PAGES = 120; // 50/page → cap ~6,000 holders per collection

type Ckpt = { done: string[]; holders: Record<string, string[]> };
const ckpt: Ckpt = fs.existsSync(CKPT) ? JSON.parse(fs.readFileSync(CKPT, "utf8")) : { done: [], holders: {} };

async function enumerate(name: string, chain: string, contract: string) {
  if (ckpt.done.includes(name)) {
    console.log(`skip (done): ${name} — ${ckpt.holders[name]?.length ?? 0}`);
    return;
  }
  const base = BS[chain];
  const addrs = new Set<string>(ckpt.holders[name] ?? []);
  let params = "";
  for (let page = 0; page < MAX_PAGES; page++) {
    let ok = false;
    for (let attempt = 0; attempt < 4 && !ok; attempt++) {
      try {
        const res = await fetch(`${base}/api/v2/tokens/${contract}/holders${params}`, {
          signal: AbortSignal.timeout(45000),
          headers: { "User-Agent": "grifters-allowlist/1.0" },
        });
        if (res.status === 429) {
          await new Promise((r) => setTimeout(r, 15000 * (attempt + 1)));
          continue;
        }
        if (!res.ok) throw new Error(`http ${res.status}`);
        const j = (await res.json()) as {
          items: { address: { hash: string } }[];
          next_page_params: Record<string, string | number> | null;
        };
        for (const it of j.items ?? []) addrs.add(it.address.hash.toLowerCase());
        ok = true;
        if (!j.next_page_params) {
          params = "DONE";
        } else {
          params = "?" + new URLSearchParams(Object.entries(j.next_page_params).map(([k, v]) => [k, String(v)])).toString();
        }
      } catch (e) {
        await new Promise((r) => setTimeout(r, 4000 * (attempt + 1)));
      }
    }
    if (!ok) {
      console.log(`  ${name}: stalled at page ${page} (${addrs.size} so far) — will resume on next run`);
      ckpt.holders[name] = [...addrs];
      fs.writeFileSync(CKPT, JSON.stringify(ckpt));
      return;
    }
    if (params === "DONE") break;
    await new Promise((r) => setTimeout(r, 350));
  }
  ckpt.holders[name] = [...addrs];
  ckpt.done.push(name);
  fs.writeFileSync(CKPT, JSON.stringify(ckpt));
  console.log(`done: ${name} — ${addrs.size} holders`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const c of HOLDER_CONTRACTS) await enumerate(c.name, c.chain, c.contract);
  const remaining = HOLDER_CONTRACTS.filter((c) => !ckpt.done.includes(c.name));
  const all = new Set<string>();
  for (const list of Object.values(ckpt.holders)) for (const a of list) all.add(a);
  fs.writeFileSync(OUT, JSON.stringify({ holders: [...all] }));
  console.log(`total unique holders so far: ${all.size}`);
  console.log(remaining.length === 0 ? "COMPLETE" : `INCOMPLETE — ${remaining.length} collections left, re-run to resume`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
