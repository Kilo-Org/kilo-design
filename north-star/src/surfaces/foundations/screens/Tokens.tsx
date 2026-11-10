import type { ScreenMeta } from "../../../registry";
import tokens from "../../../../../tokens.json";

export const meta: ScreenMeta = { title: "Tokens", order: 1, source: "tokens.json" };

type Roles = Record<string, string>;
const MODES = ["dark", "light"] as const;
const colors: Record<(typeof MODES)[number], Roles> = tokens.color;

const alias = (v: string) => v.match(/^\{(.+)\}$/)?.[1];
const resolve = (roles: Roles, name: string): string => {
  const to = alias(roles[name]);
  return to ? resolve(roles, to) : roles[name];
};

// WCAG 2 contrast ratio. Opaque hex only: a translucent color has no ratio without its backdrop.
const luminance = (hex: string) => {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return null;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)];
  return x === null || y === null ? null : (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
console.assert(Math.round(contrast("#000000", "#ffffff")!) === 21, "contrast() is wrong");

// Text role on fill role. These are the pairs the screens actually draw.
const PAIRS: [string, string][] = [
  ["fg", "bg"], ["fg-strong", "bg"], ["muted", "bg"], ["subtle", "bg"], ["muted", "card"], ["fg", "sidebar"],
  ["act-fg", "act-bg"], ["ink-fg", "ink"], ["bubble-fg", "bubble-bg"], ["fg", "popover"],
  ["success", "bg"], ["destructive", "bg"], ["info", "bg"], ["warn", "bg"], ["add", "add-bg"], ["del", "del-bg"],
];

const px = (rem: string) => `${parseFloat(rem) * 16}px`;

export default function Tokens() {
  return (
    <div className="f-wrap">
      <section>
        <h2>Color roles</h2>
        <p className="f-lede">Each role in both modes. A value in braces is an alias for another role.</p>
        <div className="f-roles">
          <div className="f-role f-role-head"><span>Role</span><span>Dark</span><span>Light</span></div>
          {Object.keys(colors.dark).map((name) => (
            <div className="f-role" key={name}>
              <code>{name}</code>
              {MODES.map((mode) => (
                <span className="f-chip" data-mode={mode} key={mode}>
                  <i style={{ background: `var(--${name})` }} />
                  <small>{colors[mode][name]}</small>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Contrast</h2>
        <p className="f-lede">Text on fill, WCAG 2 ratio. Marked pairs are under 4.5:1, the minimum for body text. Translucent colors are not rated.</p>
        <div className="f-pairs">
          {PAIRS.map(([text, fill]) => (
            <div className="f-pair" key={text + fill}>
              <code>{text} on {fill}</code>
              {MODES.map((mode) => {
                const ratio = contrast(resolve(colors[mode], text), resolve(colors[mode], fill));
                return (
                  <span className="f-sample" data-mode={mode} key={mode} style={{ background: `var(--${fill})`, color: `var(--${text})` }}>
                    Aa <b data-low={ratio !== null && ratio < 4.5}>{ratio === null ? "n/a" : `${ratio.toFixed(1)}${ratio < 4.5 ? " low" : ""}`}</b>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Brand</h2>
        <p className="f-lede">The yellow is for the logo only. Primary actions use <code>act-bg</code>.</p>
        <span className="f-logo" style={{ background: "var(--brand-logo)", color: "var(--brand-logo-fg)" }}>K</span>
        <code className="f-inline">{tokens.brand.logo} · {tokens.brand["logo-fg"]}</code>
      </section>

      <section>
        <h2>Type</h2>
        {Object.entries(tokens.typography).map(([role, t]) => (
          <div className="f-type" key={role}>
            <span
              style={{
                fontFamily: `"${t.fontFamily}", system-ui, sans-serif`,
                fontSize: t.fontSize,
                fontWeight: t.fontWeight,
                lineHeight: t.lineHeight,
                letterSpacing: "letterSpacing" in t ? t.letterSpacing : undefined,
                textTransform: "textTransform" in t ? "uppercase" : undefined,
              }}
            >
              {role === "code" ? "pnpm --dir north-star dev" : "Allow Kilo to run this command?"}
            </span>
            <small><code>{role}</code> {t.fontFamily} · {px(t.fontSize)} · {t.fontWeight} · {t.lineHeight}</small>
          </div>
        ))}
      </section>

      <section className="f-cols">
        <div>
          <h2>Radius</h2>
          <div className="f-radii">
            {Object.entries(tokens.radius).map(([name, value]) => (
              <div key={name}><i style={{ borderRadius: value }} /><code>{name}</code><small>{value}</small></div>
            ))}
          </div>
        </div>
        <div>
          <h2>Spacing</h2>
          {Object.entries(tokens.spacing).sort((a, b) => parseFloat(a[1]) - parseFloat(b[1])).map(([name, value]) => (
            <div className="f-space" key={name}><code>{name.replace("_", ".")}</code><i style={{ width: value }} /><small>{value}</small></div>
          ))}
        </div>
      </section>
    </div>
  );
}
