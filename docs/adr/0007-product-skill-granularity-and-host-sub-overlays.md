# Product-skill granularity, the editor family, and component-library sharing

Status: Partially superseded by ADR 0011 for sequencing. Product-skill granularity still stands, but `kilo-design-core` is deferred until a second product skill proves reuse.

Refines ADR 0004. The unit of a Product Skill is a **product family**, decided by **theming
contract** (who owns the colors), not by which code library a surface happens to import.

Granularity rule:

- **Single-surface product** → one Product Skill (overlay + recipes).
- **Multi-host family** → one Product Skill with **host sub-overlays**, one per theming
  contract, selected by the router.

Current product skill source: `skills/kilo-design-cloud`. Future product skill sources may
include `kilo-design-landing`, `kilo-design-mobile`, `kilo-design-console`, and
`kilo-design-editor`.

## The editor family

`kilo-design-editor` is one skill with host sub-overlays, because these surfaces share real,
non-universal "editor-family" intent (host-native, compact, stable-during-streaming, agent/
terminal affordances) that can't live in Core and — with no skill composition (ADR 0004) —
would duplicate across split skills:

- **`vscode-webview`** — `kilo-vscode`, renders the shared Solid web UI. Per ADR 0009 it is
  **Kilo-dark** (does not follow the host light theme), but **honors high-contrast** themes for
  accessibility.
- **`jetbrains`** — `kilo-jetbrains`, native Kotlin, IntelliJ UIManager theming. Thin: supplies
  tokens + voice and points at `kilo-jetbrains/AGENTS.md` for component specifics (per ADR 0006).
- **`cli`** — `kilo-cli` (a fork of `opencode`), terminal/ANSI with fallbacks.

## kilo-console is its own product, not an editor host

`kilo-console` is a real (new) product — cross-product cloud settings — and a standalone Solid
web app that **owns its own theme** (Kilo dark-first brand, same theming contract as Cloud). So
it is `kilo-design-console`, register like Cloud — not an editor sub-overlay. It lives in the
`kilo-code` monorepo and reuses `@kilocode/kilo-web-ui`, but that is code sharing, not design-
family membership.

## Component-library sharing is orthogonal to family

`@kilocode/kilo-web-ui` (Solid) is a shared component library consumed by both the VS Code
webview (editor family) and `kilo-console` (its own product). It is the editor-side / web-Solid
equivalent of cloud's `apps/web/src/components/ui` — a Canonical Example source. Recipes in
*either* skill may name its components as the authoritative example. Sharing code across
products does not merge their Product Skills.
