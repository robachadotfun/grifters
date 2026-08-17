import { NextResponse } from "next/server";
import { checkTweet } from "@/lib/tweetcheck";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Periodic tweet sweep — re-verifies the oldest-checked entries and revokes
 * spots whose tweets were deleted (tweet_ok = false). Restored automatically
 * if the wallet resubmits with a live tweet.
 * Invoked by Vercel Cron (Authorization: Bearer CRON_SECRET).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) return NextResponse.json({ ok: false, error: "no db" }, { status: 500 });

  const { Client } = await import("pg");
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const batch = await client.query(
      `select id, tweet_url from whitelist
       where tweet_url is not null and tweet_ok = true
       order by tweet_checked_at asc nulls first
       limit 90`,
    );
    let revoked = 0;
    let checked = 0;
    for (const row of batch.rows as { id: number; tweet_url: string }[]) {
      const tc = await checkTweet(row.tweet_url, 5000);
      checked++;
      if (tc.status === "deleted") {
        await client.query("update whitelist set tweet_ok = false, tweet_checked_at = now() where id = $1", [row.id]);
        revoked++;
      } else if (tc.status === "ok") {
        await client.query("update whitelist set tweet_checked_at = now() where id = $1", [row.id]);
      }
      // "unknown" leaves tweet_checked_at untouched so it's retried next run
      await new Promise((r) => setTimeout(r, 120));
    }
    console.log("TWEET_SWEEP", JSON.stringify({ checked, revoked }));
    return NextResponse.json({ ok: true, checked, revoked });
  } finally {
    await client.end().catch(() => {});
  }
}
