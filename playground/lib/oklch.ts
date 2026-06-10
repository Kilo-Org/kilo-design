// Hex/rgba -> OKLCH preview. Mirrors what the T1.2 generator will emit for
// tokens.web.css, so the playground preview is WYSIWYG with the web export.
// Source of truth stays HEX (ADR 0003); OKLCH is preview/export-only.

import { oklch, formatCss, parse, clampChroma, differenceEuclidean } from "culori";

const dist = differenceEuclidean("oklch");

export interface OklchResult {
  css: string;
  outOfGamut: boolean;
}

export function toOklch(value: string): OklchResult | null {
  const parsed = parse(value);
  if (!parsed) return null;
  const c = oklch(parsed);
  if (!c) return null;
  const clamped = clampChroma(c, "oklch", "rgb");
  const outOfGamut = dist(c, clamped) > 0.0005;
  return { css: formatCss(clamped) ?? "", outOfGamut };
}
