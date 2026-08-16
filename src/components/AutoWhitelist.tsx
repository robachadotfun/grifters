import { AUTO_WHITELIST_COLLECTIONS } from "@/config/collection";
import { PixelCrown, PixelSparkle } from "./pixel/PixelIcons";

/**
 * "Already in" notice — holders of partner communities are automatically
 * whitelisted via snapshot; no form needed. Chips link to each collection
 * on OpenSea.
 */
export function AutoWhitelist({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="border-t-2 border-dashed border-ink/20 bg-rh-pale/60 px-6 py-4">
        <p className="font-pixel text-[9px] text-ink leading-relaxed">
          <span className="text-rh-green">HOLDING A PARTNER COLLECTION?</span> YOU&apos;RE
          ALREADY WHITELISTED — SNAPSHOT TAKEN, NOTHING TO DO.
        </p>
        <p className="mt-2 font-pixel text-[8px] text-ink-soft leading-relaxed">
          {AUTO_WHITELIST_COLLECTIONS.map((c, i) => (
            <span key={c.name}>
              {i > 0 && " · "}
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rh-green underline decoration-ink/20 underline-offset-2"
              >
                {c.name}
              </a>
            </span>
          ))}
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-ink/90 bg-white/80 p-6 sm:p-7 shadow-[8px_8px_0_0_rgba(201,162,75,0.25)]">
      <p className="font-pixel text-[11px] text-ink flex items-center gap-2.5">
        <PixelCrown className="w-5 h-4 text-gold shrink-0" />
        ALREADY HOLDING? YOU&apos;RE ALREADY IN.
      </p>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">
        A snapshot has been taken. Holders of these communities are{" "}
        <strong className="text-ink">automatically whitelisted</strong> — no form,
        no signature, nothing to do.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {AUTO_WHITELIST_COLLECTIONS.map((c) => (
          <li key={c.name}>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${c.name} on OpenSea`}
              className="font-pixel text-[9px] px-2.5 py-1.5 border-2 border-ink/25 bg-white inline-flex items-center gap-1.5 hover:border-rh-green hover:text-rh-green hover:-translate-y-0.5 transition-all"
            >
              <PixelSparkle className="w-2 h-2 text-rh-green" />
              {c.name.toUpperCase()}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-pixel text-[8px] text-ink-soft">
        HELD AT SNAPSHOT TIME = GUARANTEED SPOT · CHIPS LINK TO OPENSEA · MORE COMMUNITIES MAY BE ADDED
      </p>
    </div>
  );
}
