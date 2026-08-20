import { NextResponse } from "next/server";
import { isAddress, getAddress, keccak256, encodePacked } from "viem";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

/** Merkle proofs for the three-phase mint.
 *  PRIMARY = partner-collection holders, COMMUNITY = whitelist.
 *  Returns whichever phases the wallet qualifies for, with proofs.
 *  Membership isn't secret — roots are on-chain and a proof only works
 *  for the caller's own address. */

type Tree = { root: string; wallets: string[]; layers: `0x${string}`[][] };
const cache: Record<string, Tree | null> = {};
function loadTree(file: string): Tree | null {
  if (file in cache) return cache[file];
  try {
    cache[file] = JSON.parse(fs.readFileSync(path.join(process.cwd(), ".allowlist", file), "utf8")) as Tree;
  } catch {
    cache[file] = null;
  }
  return cache[file];
}

function proofFor(t: Tree, leaf: `0x${string}`): string[] | null {
  let idx = t.layers[0].indexOf(leaf);
  if (idx < 0) return null;
  const proof: string[] = [];
  for (let l = 0; l < t.layers.length - 1; l++) {
    const sib = idx ^ 1;
    if (sib < t.layers[l].length) proof.push(t.layers[l][sib]);
    idx = Math.floor(idx / 2);
  }
  return proof;
}

export async function GET(req: Request) {
  const wallet = new URL(req.url).searchParams.get("wallet") ?? "";
  if (!isAddress(wallet)) {
    return NextResponse.json({ ok: false, error: "bad wallet" }, { status: 400 });
  }
  const leaf = keccak256(encodePacked(["address"], [getAddress(wallet)]));

  const out: Record<string, unknown> = { ok: true };
  const primary = loadTree("tree-primary.json");
  const community = loadTree("tree-community.json");
  if (!primary && !community) {
    return NextResponse.json({ ok: false, error: "allowlist not published yet" }, { status: 503 });
  }
  if (primary) {
    const p = proofFor(primary, leaf);
    if (p) out.primary = { root: primary.root, proof: p };
  }
  if (community) {
    const p = proofFor(community, leaf);
    if (p) out.community = { root: community.root, proof: p };
  }
  out.eligible = Boolean(out.primary || out.community);
  return NextResponse.json(out);
}
