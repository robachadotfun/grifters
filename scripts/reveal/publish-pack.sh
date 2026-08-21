#!/usr/bin/env bash
# REVEAL DAY — run ONLY after GriftersReveal.revealWord() is non-zero.
# Moves the sealed pack into the site (public/meta), publishes manifest +
# salt for auditors, commits and pushes → Vercel serves
#   https://www.grifters.market/meta/{pos}.json  and  /meta/img/{pos}.webp
set -euo pipefail
cd "$(dirname "$0")/../.."
WORD=$(cast call 0x2b9596DaC75443cCd943F65FfA131E7b9d45565F "revealWord()(bytes32)" --rpc-url https://rpc.mainnet.chain.robinhood.com)
if [ "$WORD" = "0x0000000000000000000000000000000000000000000000000000000000000000" ]; then
  echo "REFUSING: reveal word not landed yet — publishing now would leak the sealed manifest."; exit 1
fi
echo "reveal word: $WORD"
rm -rf public/meta && mkdir -p public/meta/img
cp .reveal-pack/meta/*.json public/meta/
cp .reveal-pack/img/*.webp public/meta/img/
cp .reveal-pack/manifest-public.json public/meta/manifest.json
cp .reveal-pack/salt.txt public/meta/salt.txt
git add public/meta && git commit -q -m "REVEAL: publish artwork, metadata, sealed manifest + salt (word $WORD)" && git push origin main
echo "pushed. After Vercel is READY, set the base URI:"
echo "  cast send 0xBC4f5F254f7265caC24d4687ED6774f6A1166C48 'setBaseURI(string)' 'https://www.grifters.market/meta/' --private-key \$PRIVATE_KEY --rpc-url https://rpc.mainnet.chain.robinhood.com"
