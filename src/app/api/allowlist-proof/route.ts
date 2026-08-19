import { NextResponse } from "next/server";
import { isAddress, getAddress, keccak256, encodePacked } from "viem";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

/** Merkle proof for the mint allowlist. The tree ships with the deploy
 *  (.allowlist/tree.json). Membership itself is not a secret — the root
 *  is on-chain and the proof only works for the caller's own address. */

type Tree = { root: string; wallets: string[]; layers: `0x${string}`[][] };
let tree: Tree | null = null;
function loadTree(): Tree | null {
  if (tree) return tree;
  try {
    tree = JSON.parse(fs.readFileSync(path.join(process.cwd(), ".allowlist", "tree.json"), "utf8")) as Tree;
    return tree;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const wallet = new URL(req.url).searchParams.get("wallet") ?? "";
  if (!isAddress(wallet)) {
    return NextResponse.json({ ok: false, error: "bad wallet" }, { status: 400 });
  }
  const t = loadTree();
  if (!t) return NextResponse.json({ ok: false, error: "allowlist not published yet" }, { status: 503 });

  const addr = getAddress(wallet);
  const leaf = keccak256(encodePacked(["address"], [addr]));
  let idx = t.layers[0].indexOf(leaf);
  if (idx < 0) return NextResponse.json({ ok: true, allowlisted: false });

  const proof: string[] = [];
  for (let l = 0; l < t.layers.length - 1; l++) {
    const sib = idx ^ 1;
    if (sib < t.layers[l].length) proof.push(t.layers[l][sib]);
    idx = Math.floor(idx / 2);
  }
  return NextResponse.json({ ok: true, allowlisted: true, root: t.root, proof });
}
