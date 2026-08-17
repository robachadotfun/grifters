/**
 * Server-side partner-collection holdings check.
 * Contracts resolved from each collection's OpenSea page data and verified
 * on-chain via name() where possible (Nakamigos matches its canonical
 * contract as ground truth for the extraction method). A wrong contract can
 * only produce a false negative (balanceOf 0 / revert), never a false pass.
 */

const RPC: Record<string, string> = {
  robinhood: "https://rpc.mainnet.chain.robinhood.com",
  ethereum: "https://eth.llamarpc.com",
  base: "https://mainnet.base.org",
};

export const HOLDER_CONTRACTS: { name: string; chain: keyof typeof RPC; contract: `0x${string}` }[] = [
  { name: "H00dle", chain: "robinhood", contract: "0x14924807ff03f410f0965a25d66bf44e1e926841" },
  { name: "Monkeyhood", chain: "ethereum", contract: "0xebb7c860d3b0886a3202979af129d022fe7fe8ae" },
  { name: "Gremlin Cartel", chain: "robinhood", contract: "0x12449b9a29865621be166aaff04dc14a640b4119" },
  { name: "Quotrons", chain: "robinhood", contract: "0xbde7bec47cbfc689e5e952b6cdd113a500abcd83" },
  { name: "Spritehood Wisps", chain: "robinhood", contract: "0xd6577124f96394faee65afd2408f2ffa88445f63" },
  { name: "Stackers", chain: "robinhood", contract: "0x968c5f0b6fe2f77b221f5e015c955f32f9a50507" },
  { name: "Broker Punks", chain: "robinhood", contract: "0xe6f39752438d607390b339cdb609144acea6d6db" },
  { name: "Script Kiddies", chain: "ethereum", contract: "0xd12fe12a029347c58002edb9fe30053b58a9ecc0" },
  { name: "Robinhood Kitties", chain: "robinhood", contract: "0x979364e11831c9508771a226245b6e97fb9a45d1" },
  { name: "Bulls Runners", chain: "robinhood", contract: "0x77ae39a3b12e670af5c8304296543701eba10d6f" },
  { name: "Yardkeepers", chain: "robinhood", contract: "0x2756bffc4cccb0cbebeb675a8593ca80c8db8a97" },
  { name: "Zaibatsu Wagies", chain: "robinhood", contract: "0x0090e13cc13af6b7c4a6ec9a0a7b3f8a1fb42a05" },
  { name: "Nakamigos", chain: "ethereum", contract: "0xd774557b647330c91bf44cfeab205095f7e6c367" },
  { name: "Normies", chain: "ethereum", contract: "0x9eb6e2025b64f340691e424b7fe7022ffde12438" },
  { name: "Good Vibes Club", chain: "ethereum", contract: "0xb8ea78fcacef50d41375e44e6814ebba36bb33c4" },
  { name: "Funkari", chain: "ethereum", contract: "0x1fafd33d882e1c275c61066019a23c1999b5006e" },
  { name: "Cash Cats", chain: "base", contract: "0x0023b49048114d9ebb3883f2bc77ace326ab8cd0" },
  { name: "RH Machines", chain: "robinhood", contract: "0xb509e195bcb3e4461e235ff152c68d66915f67b5" },
  { name: "OnchainHoodies", chain: "robinhood", contract: "0xdbe7cf677d7f1a9c091c7107115d68de7689f3c5" },
  { name: "Pyopyopyo", chain: "base", contract: "0x5d7454acf32022701cc2bce583f33e975bb685ef" },
  { name: "Chain Mancers", chain: "robinhood", contract: "0x797a2e030b7e49107c8f07bf0300ea9cae88ca57" },
  { name: "Pitboys", chain: "robinhood", contract: "0x57069d845701b50f41327362c1c23789043f8dec" },
  { name: "Stonkbrokers", chain: "robinhood", contract: "0xae5a9ff5b3fa64ec51baf41681ab5d567b0a07db" },
];

/** ERC-721 balanceOf(address) selector + padded owner */
function balanceOfData(owner: string) {
  return `0x70a08231000000000000000000000000${owner.slice(2).toLowerCase()}`;
}

/** One batched JSON-RPC request per chain — rate-limit friendly from serverless IPs. */
async function batchBalances(
  rpc: string,
  items: { name: string; contract: string }[],
  wallet: string,
  timeoutMs = 8000,
): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const data = balanceOfData(wallet);
    const batch = items.map((c, i) => ({
      jsonrpc: "2.0",
      id: i,
      method: "eth_call",
      params: [{ to: c.contract, data }, "latest"],
    }));
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batch),
      signal: ctrl.signal,
    });
    const arr = (await res.json()) as { id: number; result?: string }[];
    if (!Array.isArray(arr)) return null;
    for (const r of arr) {
      if (r.result && r.result !== "0x" && BigInt(r.result) > BigInt(0)) {
        return items[r.id]?.name ?? null;
      }
    }
    return null;
  } catch (e) {
    console.log("HOLDINGS_RPC_FAIL", rpc.split("/")[2], e instanceof Error ? e.name : "err");
    return null;
  } finally {
    clearTimeout(t);
  }
}

/** Returns the first partner collection the wallet holds, or null. */
export async function checkPartnerHoldings(wallet: string): Promise<string | null> {
  const byChain = new Map<string, { name: string; contract: string }[]>();
  for (const c of HOLDER_CONTRACTS) {
    if (!byChain.has(c.chain)) byChain.set(c.chain, []);
    byChain.get(c.chain)!.push(c);
  }
  const results = await Promise.allSettled(
    Array.from(byChain.entries()).map(([chain, items]) => batchBalances(RPC[chain], items, wallet)),
  );
  for (const r of results) {
    if (r.status === "fulfilled" && r.value) return r.value;
  }
  return null;
}
