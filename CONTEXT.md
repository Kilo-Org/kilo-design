# Kilo Design Context

## Glossary

### Agent-Consumable Design System

A design system shaped for both people and AI agents. It includes canonical design language, tokens, reusable pattern recipes, and loading rules that help agents choose the right context without filling the session with unrelated design material.

### Core Skill

The single installable skill (`kilo-design-core`) that carries the shared Kilo design language, voice, token meaning, and the Context Router. Installed once by anyone doing Kilo UI; authored exactly once. Every Product Skill instructs the agent to load it first.

### Product Skill

A small installable skill per product family (`kilo-design-cloud`, `-landing`, `-mobile`, `-console`, `-editor`) containing only that product's Product Overlay and Pattern Recipes. Depends on the Core Skill by convention (its `SKILL.md` says "load `kilo-design-core` first"), not by a tool-enforced dependency. A "family" is decided by theming contract (who owns the colors), not by which code library a surface imports.
_Avoid_: "design plugin", "product pack".

### Host Sub-overlay

A section inside a multi-host Product Skill (currently only `kilo-design-editor`) that adapts the product to one host's theming contract. The editor hosts: `vscode-webview` (shared Solid web UI under `--vscode-*`), `jetbrains` (native Kotlin / IntelliJ UIManager; specifics in `kilo-jetbrains/AGENTS.md`), and `cli` (kilo-cli, the opencode fork; terminal/ANSI). The router loads only the matching sub-overlay.

### Shared Component Library

A code-level component package (e.g. `@kilocode/kilo-web-ui` for web-Solid surfaces, cloud's `apps/web/src/components/ui` for web-React) that Pattern Recipes name as Canonical Examples. A library may be shared across products without merging their Product Skills — code sharing is orthogonal to design-family membership.

### Pattern Recipe

A compact design rule for a recurring UI pattern. It names when to use the pattern, which existing components and tokens to prefer, which variants and states are expected, and which examples are authoritative.

### Context Router

A short set of loading rules that tells an agent which design files to read for a task. The router exists to prevent broad design guidance from polluting unrelated work.

### Path-scoped Trigger

The single narrow line in a repo's existing AGENTS.md that points the agent at the design skill based on **which file is being edited** (e.g. a UI screen under `apps/web/src/**`), never on the keyword "design." It carries no design rules — only the pointer. It is what stops the old keyword-triggered over-loading.
_Avoid_: a `DESIGN.md` file in a product repo (rules live only in the skill; never recreate it).

### Evolving Pilot

A deliberately incomplete design-system slice that proves a format through real product work before expanding. Cloud web is the current evolving pilot.

### Product Overlay

A short per-product markdown that captures only how the shared Kilo language applies to one surface — the product-specific delta, not a restatement of the core. The core answers "what is Kilo's design language?"; the overlay answers "how does it apply to this product?" (e.g. Cloud = dense infra console; Landing = expressive, hero type allowed; Editor = bend to host `--vscode-*` theme).
_Avoid_: "product theme", "product guide".

### Canonical Example

The single shipped, in-production component or surface that a Pattern Recipe names as the one true example to copy. It must be real code, never an aspirational mock — a recipe without a Canonical Example is incomplete.
_Avoid_: "reference implementation" (it conflated the per-recipe example with the pilot that proves the format).

### Drift

The gap between shipped product code and the canonical design system. Values can drift (e.g. `--primary` ships as gray while `tokens.json` says yellow) and patterns can drift (e.g. three tab styles for one job). Tracked for Cloud web in `DriftAudit.stories.tsx`.

### Primary (brand action color)

The brand yellow-green (`#F7F586`). In Kilo, primary and brand are the **same token** — the primary action color is the brand color, because the suite is dark-first and the yellow-green is the identity. Used for the one primary action per surface, plus atmospheric brand roles (logo tile, focus ring, glow). Scarcity is enforced by the `primary-actions` recipe, not by making the token neutral.
_Avoid_: a neutral/gray primary; "accent" as a synonym for primary.
