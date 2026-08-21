# Reveal day runbook (GRIFTERS)

Reveal contract: `0x2b9596DaC75443cCd943F65FfA131E7b9d45565F` · Mint: `0xBC4f5F254f7265caC24d4687ED6774f6A1166C48`
RPC: `https://rpc.mainnet.chain.robinhood.com`. `PRIVATE_KEY` stays in your shell.
Earliest possible: **Aug 22, 2026 18:00 UTC** (`revealNotBefore`). Pick a BUSY mining hour (step 0).

0. Preflight (keyless):
   cast call 0x003e29260EF2f762e7f2d95C3d2b7A7f6234BcDE "liveTapeCount()(uint256)" --rpc-url $RPC
   cast call 0x003e29260EF2f762e7f2d95C3d2b7A7f6234BcDE "requestFee()(uint256)" --rpc-url $RPC
   → want liveTapeCount ≥ 2; fee will be ≤ 0.0005 ETH.

1. Arm the reveal (anyone may call; send the fee with it):
   cast send 0x2b9596DaC75443cCd943F65FfA131E7b9d45565F "beginReveal()" --value 0.0005ether --private-key $PRIVATE_KEY --rpc-url $RPC

2. Wait ≥ 5 minutes (MIN_SETTLE_DELAY = 300s), then settle (permissionless):
   cast send 0x2b9596DaC75443cCd943F65FfA131E7b9d45565F "settleReveal()" --private-key $PRIVATE_KEY --rpc-url $RPC
   (if it reverts NotReady, the prints haven't landed yet — retry in a minute)
   cast call 0x2b9596DaC75443cCd943F65FfA131E7b9d45565F "revealWord()(bytes32)" --rpc-url $RPC   → non-zero = revealed

3. Publish the pack (refuses to run until the word is non-zero):
   scripts/reveal/publish-pack.sh

4. After Vercel is READY, flip the metadata (owner key):
   cast send 0xBC4f5F254f7265caC24d4687ED6774f6A1166C48 "setBaseURI(string)" "https://www.grifters.market/meta/" --private-key $PRIVATE_KEY --rpc-url $RPC

5. Public verification (anyone):
   npx tsx scripts/reveal/verify-reveal.ts --manifest public/meta/manifest.json --contract 0x2b9596DaC75443cCd943F65FfA131E7b9d45565F

6. Quiet-floor escape: if prints never land within 2 days, `rescueReveal()` refunds the fee and re-arms.
