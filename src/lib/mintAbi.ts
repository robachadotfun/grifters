/** GriftersMint ABI (three-phase) + on-chain phase timestamps.
 *  Contract: 0x97d2D6De4C3563e7d2c24042293475A8cCc7DAF9 (verified). */
export const MINT_ABI = [
  {
    name: "mintPrimary",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "qty", type: "uint256" },
      { name: "proof", type: "bytes32[]" },
    ],
    outputs: [],
  },
  {
    name: "mintCommunity",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "qty", type: "uint256" },
      { name: "proof", type: "bytes32[]" },
    ],
    outputs: [],
  },
  {
    name: "mintPublic",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "qty", type: "uint256" }],
    outputs: [],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "priceWei",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "mintedBy",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/** Phase opens (unix seconds, immutable on-chain — mirrored here to
 *  avoid three extra reads). Aug 21 2026, UTC. */
export const PHASE_TIMES = {
  primary: 1787331600, // 17:00 — partner holders
  community: 1787335200, // 18:00 — whitelist
  public: 1787338800, // 19:00 — everyone
} as const;
