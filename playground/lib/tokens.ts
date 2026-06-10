// Shared token types + helpers for the playground.
// The CANONICAL source is ../../tokens.json at the repo root (ADR 0002/0003).
// We read it on the server and pass it to the client as initial state.

export interface TypeRole {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing?: string;
}

export interface Tokens {
  version: string;
  $comment?: string;
  color: {
    $comment?: string;
    brand: Record<string, string>;
    status: Record<string, string>;
    surface: Record<string, string>;
    foreground: Record<string, string>;
    border: Record<string, string>;
  };
  shadow: Record<string, string>;
  statusDomain: Record<string, string>;
  typography: Record<string, TypeRole | string>;
  radius: Record<string, string>;
  spacing: Record<string, string>;
}

export const COLOR_BUCKETS = ["brand", "status", "surface", "foreground", "border"] as const;
export type ColorBucket = (typeof COLOR_BUCKETS)[number];

export const isMeta = (k: string) => k.startsWith("$");
export const isColor = (v: unknown): v is string =>
  typeof v === "string" && /^#([0-9a-fA-F]{3,8})$/.test(v.trim());
export const isDimension = (v: unknown): v is string =>
  typeof v === "string" && /^-?\d*\.?\d+(px|rem|em)$/.test(v.trim());

/** Flatten the token tree into a flat map of CSS custom properties.
 *  e.g. color.brand.primary -> "--brand-primary"; shadow.md -> "--shadow-md";
 *  radius.md -> "--radius-md"; typography.body.fontFamily -> "--type-body-family". */
export function flattenToCssVars(t: Tokens): Record<string, string> {
  const out: Record<string, string> = {};

  for (const bucket of COLOR_BUCKETS) {
    for (const [name, val] of Object.entries(t.color[bucket])) {
      if (isMeta(name)) continue;
      out[`--${bucket}-${name}`] = val;
    }
  }
  for (const [name, val] of Object.entries(t.shadow)) {
    if (isMeta(name)) continue;
    out[`--shadow-${name}`] = val;
  }
  for (const [name, val] of Object.entries(t.radius)) {
    if (isMeta(name)) continue;
    out[`--radius-${name}`] = val;
  }
  for (const [name, val] of Object.entries(t.spacing)) {
    if (isMeta(name)) continue;
    out[`--spacing-${name}`] = val;
  }
  for (const [role, def] of Object.entries(t.typography)) {
    if (isMeta(role) || typeof def === "string") continue;
    out[`--type-${role}-family`] = def.fontFamily;
    out[`--type-${role}-size`] = def.fontSize;
    out[`--type-${role}-weight`] = String(def.fontWeight);
    out[`--type-${role}-leading`] = String(def.lineHeight);
    if (def.letterSpacing) out[`--type-${role}-tracking`] = def.letterSpacing;
  }
  return out;
}
