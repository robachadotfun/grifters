/**
 * Canonical site URL resolution — single source of truth for metadata,
 * sitemap and robots. Priority:
 * 1. NEXT_PUBLIC_SITE_URL (set this once a custom domain exists)
 * 2. Vercel's production/deployment URL (auto-populated on Vercel)
 * 3. localhost for dev
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
