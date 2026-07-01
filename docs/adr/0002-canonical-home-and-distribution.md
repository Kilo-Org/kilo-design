# Canonical source home and distribution

The canonical design system lives in a **standalone `kilo-design` GitHub repo** — not inside
any product monorepo — to stay neutral across Cloud, Landing, and the kilo-code editor/CLI
surfaces (the solo design owner serves all of them; no product should win by gravity).

It is distributed by pulling from a **pinned commit/hash**, reusing the existing skill-sync
model (`skills-lock.json`) rather than a published package or a git submodule. Two payloads
land in **different places** per consumer repo:

- **Agent guidance** (skill, overlays, recipes) → `.agents/skills/kilo-design/`.
- **Generated token values** (`tokens.web.css`, `tokens.cloud.ts`,
  `tokens.editor-host-map.md`) → a build-visible `src/` path, so code imports real source,
  never from `.agents/`.

Rejected: a standalone npm package (registry + publish auth across three separate toolchains —
the maintenance overhead the team flagged), and a git submodule (tried in `kilo-cloud`, PR
#3507, and reverted days later in #3535).
