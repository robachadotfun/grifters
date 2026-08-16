import { NextResponse } from "next/server";
import { isAddress } from "viem";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

/**
 * Whitelist submissions. Sinks, in order:
 * 1. Vercel KV / Upstash (KV_REST_API_URL + KV_REST_API_TOKEN)
 * 2. Webhook (WHITELIST_WEBHOOK_URL — Discord webhook or any JSON endpoint)
 * 3. Local JSONL file (development)
 * Configure at least one of 1/2 in production.
 */

const HANDLE_RE = /^@?[A-Za-z0-9_]{1,15}$/;
const TWEET_RE = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}\/status\/\d+/i;

type Entry = {
  wallet: string;
  twitter: string;
  tweetUrl: string | null;
  ts: string;
};

async function saveKV(entry: Entry): Promise<boolean> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;
  const key = `grifters:wl:${entry.wallet.toLowerCase()}`;
  const res = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (res.ok) {
    // maintain a count for convenience; ignore failures
    fetch(`${url}/incr/${encodeURIComponent("grifters:wl:count")}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  return res.ok;
}

async function saveWebhook(entry: Entry): Promise<boolean> {
  const hook = process.env.WHITELIST_WEBHOOK_URL;
  if (!hook) return false;
  const isDiscord = /discord(app)?\.com\/api\/webhooks/.test(hook);
  const body = isDiscord
    ? {
        content: null,
        embeds: [
          {
            title: "New GRIFTERS whitelist entry",
            color: 0x2ebd6b,
            fields: [
              { name: "Wallet", value: `\`${entry.wallet}\`` },
              { name: "X", value: `[@${entry.twitter}](https://x.com/${entry.twitter})`, inline: true },
              { name: "Tweet", value: entry.tweetUrl ?? "—", inline: true },
            ],
            timestamp: entry.ts,
          },
        ],
      }
    : entry;
  const res = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.ok;
}

function saveFile(entry: Entry): boolean {
  try {
    const dir = path.join(process.cwd(), ".whitelist");
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, "submissions.jsonl"), JSON.stringify(entry) + "\n");
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // honeypot — bots fill every field
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true, status: "WHITELISTED" });
  }

  const wallet = String(body.wallet ?? "").trim();
  const twitter = String(body.twitter ?? "").trim().replace(/^@/, "");
  const tweetUrlRaw = String(body.tweetUrl ?? "").trim();

  if (!isAddress(wallet)) {
    return NextResponse.json({ ok: false, error: "That doesn't look like a valid wallet address." }, { status: 400 });
  }
  if (!HANDLE_RE.test(twitter)) {
    return NextResponse.json({ ok: false, error: "That doesn't look like a valid X username." }, { status: 400 });
  }
  if (tweetUrlRaw && !TWEET_RE.test(tweetUrlRaw)) {
    return NextResponse.json({ ok: false, error: "The tweet link should be an x.com/…/status/… URL." }, { status: 400 });
  }

  const entry: Entry = {
    wallet,
    twitter,
    tweetUrl: tweetUrlRaw || null,
    ts: new Date().toISOString(),
  };

  const stored =
    (await saveKV(entry).catch(() => false)) ||
    (await saveWebhook(entry).catch(() => false)) ||
    (process.env.NODE_ENV !== "production" && saveFile(entry));

  if (!stored) {
    // last resort: surface in function logs so no entry is silently lost
    console.log("WHITELIST_ENTRY", JSON.stringify(entry));
  }

  return NextResponse.json({ ok: true, status: "WHITELISTED" });
}
