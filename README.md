# kilo-design

Canonical source of truth for Kilo's design system across all products (Cloud, Landing,
Console, VS Code, JetBrains, CLI, Mobile).

> **Status: planning complete, implementation not started.** This repo intentionally contains
> only decisions, glossary, and plans right now. Tokens, the generator, and the skills do **not**
> exist yet — they are rebuilt fresh from the ADRs in Steps 2-3. If a file you expect (e.g.
> `tokens.json`) is missing, that is by design, not an accident (see ADR 0008 and the clean-slate
> note below).

## Read these first (in order)

1. **`CONTEXT.md`** — the glossary. Plain-language definitions of every term used here
   (Core Skill, Product Skill, Product Overlay, Pattern Recipe, Canonical Example, Drift, …).
   Read this before the plans so the vocabulary is unambiguous.
2. **`docs/adr/`** — the 10 locked decisions, each with its reasoning. These are settled; do not
   re-litigate them silently. If you must change one, write a new ADR that supersedes it.
3. **`.plans/kilo-design-system-foundation.md`** — the strategy: the problem, the architecture,
   and why. The "why" document.
4. **`.plans/kilo-design-system-execution-checklist.md`** — the ordered, task-by-task plan
   (Milestones M0-M7, tasks `T#.#`). The "what to do, in order" document. **This is the task
   list agents pick work from.**

## The decisions at a glance (full reasoning in `docs/adr/`)

| ADR | Decision |
|---|---|
| 0001 | Prescriptive token *values*; descriptive-but-evolving *patterns* |
| 0002 | Standalone `kilo-design` repo; hash-sync distribution (guidance → `.agents/skills/`, values → `src/`) |
| 0003 | Hex source; generate OKLCH for web, hex for portable targets; bespoke generator + `culori` |
| 0004 | `kilo-design-core` + thin per-product skills, composed by convention |
| 0005 | `--primary` *is* the brand yellow-green (`#EDFF00`); scarcity enforced by recipe |
| 0006 | Governance: manual review now → automation → per-team champions |
| 0007 | One `kilo-design-editor` skill (webview/jetbrains/cli sub-overlays); `console` is its own product |
| 0008 | Design rules live only in the skill; **no per-repo `DESIGN.md`**; path-scoped trigger |
| 0009 | **Dark-only** everywhere; remove mobile's incidental light mode; webview honors high-contrast only |
| 0010 | Manual version-bump PRs now → bot later; generator has a CI staleness check |

## Clean-slate note (why this repo looks empty)

An earlier iteration of this repo held `tokens.json`, `DESIGN.md`, `agent-router.md`,
`products/`, and `patterns/`. Those were **deliberately removed** to rebuild cleanly from the
ADRs. The decisions and brand values they encoded are preserved — in `docs/adr/`, in
`CONTEXT.md`, and (for the exact old token values) in this repo's git history at the commit
`Add Kilo design source of truth`. Step 2 regenerates `tokens.json` from those.

## Where work is tracked

- **Live progress (manager view):** Linear project "Kilo Design" — 8 high-level steps, each with
  sub-issues for the detailed tasks.
- **Detailed tasks:** `.plans/kilo-design-system-execution-checklist.md` in this repo.

## What does NOT live here

- The product code (Cloud, Landing, kilo-code, Mobile) lives in its own repos. This repo
  publishes tokens + skills *to* them; it does not contain them.
