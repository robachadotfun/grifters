/**
 * Tweet verification via X's public oembed endpoint (no API key).
 * Used at submission time and by the periodic sweep — whitelist spots
 * are conditional on the tweet staying live.
 */

export type TweetCheck =
  | { status: "ok"; author: string | null; mentions: boolean }
  | { status: "deleted" }
  | { status: "unknown" };

export async function checkTweet(tweetUrl: string, timeoutMs = 8000): Promise<TweetCheck> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(
      `https://publish.x.com/oembed?url=${encodeURIComponent(tweetUrl)}&omit_script=1`,
      { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0" } },
    );
    if (res.status === 404 || res.status === 403) return { status: "deleted" };
    if (!res.ok) return { status: "unknown" };
    const j = (await res.json()) as { author_url?: string; html?: string };
    const author = j.author_url?.split("/").pop()?.toLowerCase() ?? null;
    const mentions = /grifters/i.test(j.html ?? "");
    return { status: "ok", author, mentions };
  } catch {
    return { status: "unknown" };
  } finally {
    clearTimeout(t);
  }
}
