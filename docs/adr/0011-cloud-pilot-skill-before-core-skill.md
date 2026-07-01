# Cloud pilot skill before a standalone core skill

Status: Accepted. Supersedes the runtime-skill packaging parts of ADR 0004, ADR 0007, and ADR 0008.

The design-system core for products is **not** a standalone runtime skill yet. The product-facing core is:

- `tokens.json`
- `src/tokens.web.css`
- `src/tokens.cloud.ts`
- `src/tokens.editor-host-map.md`

ADRs, Linear, and `.plans/` are scaffolding for creating the skills. They are not daily product guidance for agents working in product repos.

The first agent-facing adapter source is one Cloud pilot skill:

- `skills/kilo-design-cloud`

It contains the Cloud overlay, internal references, and the first two Cloud recipes. It is not considered published until the rollout explicitly says so. A standalone `kilo-design-core` skill is deferred until a second product skill proves real reuse.

Why: publishing a core skill before the Cloud pilot makes the abstraction feel like the product's daily driver, adds an unenforced dependency between skills, and increases install/load complexity before reuse is proven. Keeping the first adapter Cloud-specific tests the format with less machinery while preserving an extraction path later.

When a second product skill starts, extract the stable shared references from `skills/kilo-design-cloud/reference/` into a shared core skill or a generated source bundle.
