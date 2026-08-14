/**
 * Original pixel iconography for GRIFTERS.
 * Every icon is drawn on a coarse grid with shape-rendering="crispEdges"
 * so it stays true to the collection's pixel scale.
 */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { title?: string };

function base(props: P) {
  const { title, ...rest } = props;
  return {
    xmlns: "http://www.w3.org/2000/svg",
    shapeRendering: "crispEdges" as const,
    "aria-hidden": title ? undefined : true,
    role: title ? "img" : undefined,
    ...rest,
  };
}

/** Brand motif: pixel crown with a G-negative space base */
export function PixelCrown(props: P) {
  return (
    <svg viewBox="0 0 16 12" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path fill="currentColor" d="M1 3h2v2h2V3h2V1h2v2h2v2h2V3h2v6H1z" />
      <rect x="1" y="10" width="14" height="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function PixelSparkle(props: P) {
  return (
    <svg viewBox="0 0 9 9" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        fill="currentColor"
        d="M4 0h1v3h3v1h1v1H8v1H5v3H4V6H1V5H0V4h1V3h3z"
      />
    </svg>
  );
}

export function PixelDiamond(props: P) {
  return (
    <svg viewBox="0 0 12 10" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path fill="currentColor" d="M3 0h6v1h1v1h1v2h-1v1h-1v1h-1v1h-1v1h-1v1H5v-1H4V7H3V6H2V5H1V4H0V2h1V1h1V0h1z" />
      <path fill="#fff" opacity="0.5" d="M4 1h2v1H5v2H4z" />
    </svg>
  );
}

export function PixelStar(props: P) {
  return (
    <svg viewBox="0 0 11 11" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        fill="currentColor"
        d="M5 0h1v3h1v1h3v1h1v1H9v1H8v3H7v-1H6v-1H5v1H4v1H3V7H2V6H1V5h1V4h1V3h1V1h1z"
      />
    </svg>
  );
}

export function PixelTicket(props: P) {
  return (
    <svg viewBox="0 0 16 10" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        fill="currentColor"
        d="M0 1h16v2h-1v1h-1v2h1v1h1v2H0V7h1V6h1V4H1V3H0z"
      />
      <rect x="10" y="2" width="1" height="6" fill="#fff" opacity="0.6" />
    </svg>
  );
}

export function PixelCamera(props: P) {
  return (
    <svg viewBox="0 0 14 11" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path fill="currentColor" d="M4 0h3v1H4zM0 2h14v9H0z" />
      <path fill="#fff" opacity="0.85" d="M8 4h3v3H8z" />
      <path fill="#fff" opacity="0.4" d="M2 4h2v2H2z" />
    </svg>
  );
}

export function PixelChain(props: P) {
  return (
    <svg viewBox="0 0 16 8" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        fill="currentColor"
        d="M1 1h5v2H3v2h3v2H1zM10 1h5v6h-5V5h3V3h-3z"
      />
      <rect x="5" y="3" width="6" height="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function PixelHeart(props: P) {
  return (
    <svg viewBox="0 0 12 10" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        fill="currentColor"
        d="M1 1h3v1h1v1h2V2h1V1h3v1h1v3h-1v1h-1v1h-1v1H8v1H7v1H5V9H4V8H3V7H2V6H1V5H0V2h1z"
      />
    </svg>
  );
}

export function PixelQuestion(props: P) {
  return (
    <svg viewBox="0 0 8 12" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        fill="currentColor"
        d="M1 0h6v1h1v4H7v1H5v2H3V5h2V4h1V2H2v2H0V1h1zM3 10h2v2H3z"
      />
    </svg>
  );
}

export function PixelWallet(props: P) {
  return (
    <svg viewBox="0 0 14 11" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path fill="currentColor" d="M0 0h13v3h1v8H0z" />
      <path fill="#fff" opacity="0.7" d="M9 5h4v3H9z" />
      <path fill="currentColor" d="M10 6h1v1h-1z" />
    </svg>
  );
}

export function PixelPalm(props: P) {
  return (
    <svg viewBox="0 0 14 14" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path
        fill="currentColor"
        d="M6 3h2v1h2V3h2v1h1v2h-2V5h-2v1H8v7H6V6H5V5H3v1H1V4h1V3h2v1h2z"
      />
      <path fill="currentColor" opacity="0.5" d="M4 13h6v1H4z" />
    </svg>
  );
}

export function PixelFlash(props: P) {
  return (
    <svg viewBox="0 0 8 12" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path fill="currentColor" d="M3 0h4L5 5h3l-6 7 2-6H1z" />
    </svg>
  );
}

export function PixelGem({ facets = 1, ...props }: P & { facets?: number }) {
  // rarity gem: deeper cut = higher rarity
  return (
    <svg viewBox="0 0 12 11" {...base(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path fill="currentColor" d="M2 0h8v1h1v2h1v1h-1v1h-1v1H9v1H8v1H7v1H6v1H5v-1H4V8H3V7H2V6H1V5H0V4h1V3h1z" />
      {facets > 1 && <path fill="#fff" opacity="0.45" d="M3 1h2v1H4v2H3z" />}
      {facets > 2 && <path fill="#fff" opacity="0.35" d="M7 1h2v2H8v1H7z" />}
      {facets > 3 && <path fill="#fff" opacity="0.6" d="M5 4h2v2H5z" />}
    </svg>
  );
}
