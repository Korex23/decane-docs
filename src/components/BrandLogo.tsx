"use client";

import { useId } from "react";
import { LOGO_SVGS } from "./logoSvgs";

export type LogoName =
  "python" | "rust" | "swift" | "kotlin" | "nodejs" | "react";

export function BrandLogo({
  name,
  size = 16,
}: {
  name: LogoName | string;
  size?: number;
}) {
  // Gradient ids are document-wide, and a url(#id) that resolves to a copy
  // inside a display:none subtree paints nothing. Each instance gets its own
  // ids so a logo in a hidden tab row cannot blank the same logo elsewhere.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const raw = LOGO_SVGS[name];
  if (!raw) return null;
  const svg = raw.replace(/dl-/g, `dl${uid}-`);
  return (
    <span
      className="brand-logo"
      style={{ width: size, height: size }}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
