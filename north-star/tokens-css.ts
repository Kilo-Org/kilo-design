// Turns the repo's tokens.json into CSS variables, and refuses a tokens.json that would break a surface.
// Used by vite.config.ts; the app imports the result as "virtual:kilo-tokens".

type StringMap = Record<string, string>;
type TypeRole = { fontFamily: string; fontSize: string; fontWeight: number; lineHeight: number; letterSpacing?: string; textTransform?: string };
export type Tokens = {
  version: string;
  brand: StringMap;
  color: { dark: StringMap; light: StringMap };
  shadow: { dark: StringMap; light: StringMap };
  typography: Record<string, TypeRole>;
  radius: StringMap;
  spacing: StringMap;
};

const MODES = ["dark", "light"] as const;
const ALIAS = /^\{([a-z0-9-]+)\}$/;

/** Follows `{role}` aliases within one mode to a literal value. */
function resolveColor(roles: StringMap, name: string, seen: string[] = []): string {
  if (seen.includes(name)) throw new Error(`tokens.json: alias cycle: ${[...seen, name].join(" -> ")}.`);
  const value = roles[name];
  if (value === undefined) throw new Error(`tokens.json: unknown color role "${name}"${seen.length ? ` (aliased from ${seen.at(-1)})` : ""}.`);
  const alias = value.match(ALIAS);
  return alias ? resolveColor(roles, alias[1], [...seen, name]) : value;
}

export function validateTokens(tokens: Tokens) {
  for (const group of ["color", "shadow"] as const) {
    // Every role must exist in both modes, or a surface breaks when the mode flips.
    const [dark, light] = MODES.map((mode) => Object.keys(tokens[group][mode]));
    const missing = [...dark.filter((k) => !light.includes(k)), ...light.filter((k) => !dark.includes(k))];
    if (missing.length) throw new Error(`tokens.json: ${group} roles not defined in both modes: ${missing.join(", ")}.`);
  }
  for (const mode of MODES) for (const name of Object.keys(tokens.color[mode])) resolveColor(tokens.color[mode], name);
}

const decl = (name: string, value: string | number) => `  --${name}: ${value};`;
const prefixed = (prefix: string, map: StringMap) => Object.entries(map).map(([name, value]) => decl(`${prefix}-${name}`, value));

export function tokensCss(tokens: Tokens): string {
  validateTokens(tokens);
  const shared = [
    ...prefixed("brand", tokens.brand),
    ...prefixed("radius", tokens.radius),
    ...prefixed("spacing", tokens.spacing),
    ...Object.entries(tokens.typography).flatMap(([role, def]) => [
      decl(`type-${role}-family`, JSON.stringify(def.fontFamily)),
      decl(`type-${role}-size`, def.fontSize),
      decl(`type-${role}-weight`, def.fontWeight),
      decl(`type-${role}-leading`, def.lineHeight),
      ...(def.letterSpacing ? [decl(`type-${role}-tracking`, def.letterSpacing)] : []),
      ...(def.textTransform ? [decl(`type-${role}-transform`, def.textTransform)] : []),
    ]),
  ];
  const mode = (name: (typeof MODES)[number]) => [
    `  color-scheme: ${name};`,
    ...Object.entries(tokens.color[name]).map(([role, value]) => decl(role, value.replace(ALIAS, "var(--$1)"))),
    ...prefixed("shadow", tokens.shadow[name]),
  ];
  // Dark is the default; data-mode="light" or "dark" on any element switches.
  return [":root {", ...shared, "}", ':root,\n[data-mode="dark"] {', ...mode("dark"), "}", '[data-mode="light"] {', ...mode("light"), "}", ""].join("\n");
}
