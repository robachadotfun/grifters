import { COLLECTION } from "@/config/collection";

const RPC = COLLECTION.rpcUrl || "https://rpc.mainnet.chain.robinhood.com";

export type MintedToken = { id: number; owner: string | null };

// Process-wide cache: survives across renders on the same serverless
// instance. Owners are filled progressively (small batches, backoff) so a
// rate-limited RPC can never blank the page — supply falls back to the
// last good value, owners show as "—" until learned.
const cache: { total: number; owners: Map<number, string>; cursor: number; lastGoodAt: number } = {
  total: 0,
  owners: new Map(),
  cursor: 0,
  lastGoodAt: 0,
};

async function rpc(body: unknown, timeoutMs = 6000): Promise<unknown> {
  const r = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!r.ok) throw new Error(`rpc ${r.status}`);
  return r.json();
}

export async function getMinted(): Promise<{ total: number; tokens: MintedToken[]; ownersKnown: number }> {
  const addr = COLLECTION.contractAddress;
  if (!addr) return { total: 0, tokens: [], ownersKnown: 0 };

  // 1) total supply — single call, last-good fallback
  try {
    const sup = (await rpc({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to: addr, data: "0x18160ddd" }, "latest"] })) as { result?: string };
    if (sup?.result) {
      cache.total = Number(BigInt(sup.result));
      cache.lastGoodAt = Date.now();
    }
  } catch {}

  // 2) learn up to ~60 new owners per render (3 batches × 20), with backoff on 429
  let budget = 3;
  while (budget > 0 && cache.owners.size < cache.total) {
    // next unknown ids from the cursor, wrapping
    const ids: number[] = [];
    const probe = cache.cursor;
    for (let n = 0; n < cache.total && ids.length < 20; n++) {
      const id = (probe + n) % cache.total;
      if (!cache.owners.has(id)) ids.push(id);
    }
    if (ids.length === 0) break;
    try {
      const res = (await rpc(
        ids.map((id) => ({
          jsonrpc: "2.0",
          id,
          method: "eth_call",
          params: [{ to: addr, data: "0x6352211e" + id.toString(16).padStart(64, "0") }, "latest"],
        })),
      )) as { id: number; result?: string }[];
      if (Array.isArray(res)) {
        for (const r of res) if (r.result && r.result.length >= 66) cache.owners.set(r.id, "0x" + r.result.slice(26));
      }
      cache.cursor = (ids[ids.length - 1] + 1) % Math.max(1, cache.total);
      budget--;
      await new Promise((r) => setTimeout(r, 150));
    } catch {
      break; // rate-limited: serve what we have, learn more next render
    }
  }

  const tokens: MintedToken[] = Array.from({ length: cache.total }, (_, i) => ({
    id: cache.total - 1 - i, // newest first
    owner: cache.owners.get(cache.total - 1 - i) ?? null,
  }));
  return { total: cache.total, tokens, ownersKnown: cache.owners.size };
}
