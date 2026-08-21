import { COLLECTION } from "@/config/collection";

const RPC = COLLECTION.rpcUrl || "https://rpc.mainnet.chain.robinhood.com";

export type MintedToken = { id: number; owner: string };

/** All minted tokens + owners, read straight from the chain (sequential
 *  IDs 0..totalSupply-1, batched ownerOf). Cached by the caller. */
export async function getMinted(): Promise<{ total: number; tokens: MintedToken[] }> {
  const addr = COLLECTION.contractAddress;
  if (!addr) return { total: 0, tokens: [] };
  const rpc = async (body: unknown) => {
    const r = await fetch(RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      next: { revalidate: 30 },
    });
    return r.json();
  };
  const sup = await rpc({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to: addr, data: "0x18160ddd" }, "latest"] });
  const total = sup?.result ? Number(BigInt(sup.result)) : 0;
  const tokens: MintedToken[] = [];
  for (let start = 0; start < total; start += 100) {
    const ids = Array.from({ length: Math.min(100, total - start) }, (_, i) => start + i);
    const batch = ids.map((id) => ({
      jsonrpc: "2.0",
      id,
      method: "eth_call",
      params: [{ to: addr, data: "0x6352211e" + id.toString(16).padStart(64, "0") }, "latest"],
    }));
    const res = (await rpc(batch)) as { id: number; result?: string }[];
    if (Array.isArray(res)) {
      for (const r of res) if (r.result && r.result.length >= 66) tokens.push({ id: r.id, owner: "0x" + r.result.slice(26) });
    }
  }
  tokens.sort((a, b) => b.id - a.id); // newest first
  return { total, tokens };
}
