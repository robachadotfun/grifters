/* eslint-disable @next/next/no-img-element */

/**
 * Official Robinhood feather mark.
 * Asset fetched from Robinhood's own CDN (Robinhood Chain docs site):
 * https://cdn.robinhood.com/assets/generated_assets/hoodchain_docsite/feather-dark.svg
 * Do not recolor or redraw — this is the official logo.
 */
export function RobinhoodFeather({
  className = "",
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src="/brand/robinhood-feather-dark.svg"
      alt=""
      aria-hidden
      width={size}
      height={Math.round(size * (42 / 32))}
      className={className}
      loading="lazy"
    />
  );
}

export function RobinhoodChainLockup({
  className = "",
  iconSize = 18,
  textClassName = "font-pixel text-[11px]",
}: {
  className?: string;
  iconSize?: number;
  textClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <RobinhoodFeather size={iconSize} />
      <span className={textClassName}>ROBINHOOD CHAIN</span>
    </span>
  );
}
