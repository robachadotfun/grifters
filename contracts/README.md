# GRIFTERS × DERP conductor reveal — Shape C

Implementation of the StonkPit entropy-reveal integration
(per `GRIFTERS_DERP_ENTROPY_REVEAL_GUIDE.md`, shape C: one mined word
assigns all 2,222 sealed identities).

## What's here

| File | Role |
|---|---|
| `GriftersReveal.sol` | The reveal contract. Ownerless — no admin levers. Compiles clean on solc 0.8.24, optimizer 200 runs. |
| `GriftersReveal.abi.json` | Compiled ABI. |
| `../scripts/reveal/build-manifest.ts` | Builds the sealed, secret-shuffled identity manifest and its rolling-hash commitment (the constructor arg). Output lands in `.manifest/` which is **gitignored — the manifest is secret until reveal day**. |
| `../scripts/reveal/verify-reveal.ts` | The public auditor: recomputes the manifest hash and the `identityIndexOf` derivation against the deployed contract. This is the script we hand to anyone who asks "prove it". |

## Design choices (mapped to the guide)

- **Shape C** — we mint ourselves, the reveal is one collective moment,
  and C is the cheapest (one 0.0005 ETH-ceiling request), simplest, and
  blind-to-resampling with a sealed manifest. Per-holder reveal theater
  will be done client-side against the already-fixed global word.
- **Commit-before-entropy** (guide §4): `manifestHash` is an immutable
  constructor arg — the contract cannot exist without the commitment,
  and no entropy can be requested before the contract exists.
- **Belt-and-braces** for a one-word reveal: `N_PRINTS = 16`,
  `requestWithMinTapes(…, 2)`, `MIN_SETTLE_DELAY = 300s`.
- **Ownerless**: the only control surface is the immutable
  `revealNotBefore` timestamp; after it, `beginReveal`, `settleReveal`
  and `rescueReveal` are all permissionless. Targets the Gold bar in
  their STANDARDS (bounded admin → no admin at all).
- Conductor signatures were verified against the **verified source** of
  `MultiConductor` `0x003e29260EF2f762e7f2d95C3d2b7A7f6234BcDE` on
  robinhoodchain.blockscout.com (2026-08-19), and the consumer callback
  (`rawFulfillEntropy(uint256,bytes32)`) against the production
  `PitBonesTable` reference.

## Launch runbook

1. **Final metadata** → `build-manifest.ts --in final-metadata.jsonl
   --salt <fresh 32-byte secret>`. Store the salt with the manifest
   (offline). Note the printed `manifestHash`.
2. **Deploy** `GriftersReveal(conductor, manifestHash, revealNotBefore)`
   from the team deployer. Verify source on Blockscout immediately.
3. **Fund** the contract with `maxRequestFee()` (0.0005 ETH) — or just
   call `beginReveal` with the fee attached.
4. Publish the commitment (address + hash) — this is the "provably
   sealed" announcement beat, pre-mint.
5. After mint-out/reveal time, on a **busy floor** (preflight
   `liveFloorHealth()` / `liveTapeCount()` from the frontend):
   `beginReveal()` → wait ≥5 min → `settleReveal()` (or let the
   callback land). If the floor goes quiet for 2 days: `rescueReveal()`
   and re-arm.
6. **Publish the manifest + salt.** Anyone runs
   `verify-reveal.ts --contract 0x…` to check both halves.
7. Wire `identityIndexOf` into the site's `tokenURI`/metadata serving,
   send StonkPit the address for the tape allowlist.

## Copy discipline

Never say "unbiasable", "VRF-grade", "provably fair", "nobody can rig
it". The approved line: **sealed by real mining work and economically
secured — not VRF-grade**, with the manifest commitment making the
team provably unable to rig the assignment and miner resampling blind.

## Status

- [x] Contract written + compiling (not audited — get eyes on it before
      real value rides on it)
- [x] Manifest pipeline + public verifier working end-to-end (tested
      with placeholder roster)
- [ ] Final 2,222 metadata (blocks the real manifest)
- [ ] Deploy + Blockscout verification (needs team deployer key)
- [ ] StonkPit tape allowlist submission (needs deployed address)
