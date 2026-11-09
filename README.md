# Kilo Design

Kilo's canonical design source for product UI and agent guidance.

This repo keeps Kilo's UI decisions in one place so Cloud, Landing, Console, VS Code, JetBrains, CLI, and Mobile do not each invent their own design system.

It is intentionally small: token source, generated artifacts, a local playground, and draft product skills.

> 🚧 This project is still in progress. The [Decisions](#decisions) section and `CONTEXT.md` are intentionally visible because the system is still being shaped; they explain current decisions, terminology, and rollout boundaries while the Cloud pilot proves the approach.

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| Tokens | Done | `tokens.json` is the source of truth. |
| Generated artifacts | Done | `node build` writes product-targeted files under `src/`. |
| Playground | Done | Local tool for editing tokens and previewing token behavior. |
| Cloud skill | In progress | First agent-facing product skill lives in `skills/kilo-design/`. |
| Cloud proof | Next | Validate the skill against real Cloud UI work before wider rollout. |
| Other products | Later | Landing, Editor, Console, Mobile wait until Cloud proves the shape. |

## Repository Model

| Surface | What it is | Authority |
| --- | --- | --- |
| `tokens.json` | Hand-authored design token source | Canonical values |
| `src/` | Generated token artifacts | Committed output from `node build` |
| `playground/` | Local token editor and specimen viewer | Human review tool only |
| `skills/` | Draft product skill sources | Agent guidance under development |
| `skill-comparison/` | Static skill behavior comparison | First-pass specimens |
| `skill-arena/` | Repeatable prompt-pass workflow | Skill evaluation harness |

Product code does not live here. Product repos consume this repo's artifacts and skills from their own codebases.

## 🔁 How The Pieces Connect

```text
tokens.json
  -> node build
     -> src/tokens.landing.css
     -> src/tokens.cloud.ts
     -> src/tokens.extension-host-map.md

skills/kilo-design
  -> tells agents how Cloud should use Kilo values, semantic roles, and shipped Cloud examples

playground/
  -> edits and previews tokens locally
  -> is not a component library or canonical product UI
```

The important boundary: tokens define values; product skills explain how agents should use those values inside one product surface.

## 📦 Generated Artifacts

Run from the repo root:

```bash
node build
```

This regenerates:

| Artifact | Consumer | Format |
| --- | --- | --- |
| `src/tokens.landing.css` | Landing browser surfaces | OKLCH CSS variables |
| `src/tokens.cloud.ts` | Cloud TypeScript consumers | Hex values and flattened CSS variable names |
| `src/tokens.extension-host-map.md` | VS Code, JetBrains, CLI/ANSI | Host mapping notes |

Generated files are committed, but never edited by hand. CI should fail if they drift from `tokens.json`.

## 🧪 Token Playground

<img width="3288" height="2024" alt="Screenshot 2026-07-01 at 12 30 59@2x" src="https://github.com/user-attachments/assets/9834f2c2-58ae-4945-a743-4cb5ca2981c6" />

The playground is the local authoring surface for tokens.

```bash
pnpm install
pnpm run playground
```

Then open:

```text
http://localhost:8731
```

Use it to:

- edit `tokens.json`;
- preview color, type, spacing, and radius changes;
- save token changes with recovery via `Undo last save`;
- regenerate committed artifacts from the saved source.

Do not use playground specimens as product components, pattern recipes, or canonical examples.

## 🏟️ Skill Arena

The skill arena is a local mini app for regenerating one prompt across the three skill conditions.

```bash
node skill-arena/server.mjs
```

Then open:

```text
http://127.0.0.1:8791
```

It shows stacked rounds of no-skill, frontend-design, and Kilo Cloud outputs, with a fixed prompt composer at the bottom. Each round writes HTML outputs and logs under `skill-arena/runs/`. There is also a `pnpm run skill-arena` script, but this machine currently needs `pnpm approve-builds` before `pnpm` will run workspace scripts because of the existing `sharp` approval guard.

## ☁️ Cloud Skill Pilot

The first product skill source is:

```text
skills/kilo-design/
```

It contains:

- `SKILL.md`: router, run order, token contract;
- `overlay.md`: Cloud-specific product guidance;
- `reference/`: token architecture, product judgment, voice, brand, and interaction quality;
- `patterns/cloud-web/`: first Cloud recipes for primary actions and tabs.

The Cloud skill is the pilot. There is no standalone `kilo-design-core` runtime skill yet. Extract shared guidance only after a second product skill proves real reuse.

## ⚖️ Authority Model

Use this order when sources disagree:

1. `tokens.json`
2. generated artifacts in `src/`
3. product skill sources, starting with `skills/kilo-design/`
4. pattern recipes with shipped product Canonical Examples
5. nearby shipped product UI

## Decisions

These decisions still hold. Earlier decision records are in git history.

- **Tokens are prescriptive; patterns are descriptive.** Token values define the target, and shipped code that disagrees is drift to migrate. Every pattern recipe must cite a canonical example in shipped code, never a mock, because recipes that point at ideals that do not exist lead agents to invent them.
- **Standalone repo, pulled by pinned hash.** The system lives in its own repo so that no product monorepo owns it, and consumers pull a pinned commit, as skills already sync through `skills-lock.json`. No npm package, because registry and publish auth across three toolchains is too much upkeep, and no git submodule, because one was tried in `kilo-cloud` (PR #3507) and reverted days later (#3535).
- **One hand-authored source, generated artifacts.** Values are edited in one source, `tokens.json`, and every product format is generated from it by `node build`. Generated files are never edited by hand.
- **Products are grouped by who owns the colours.** A product family is set by its theming contract, not by the code library it imports: surfaces that adapt to one host's theme are hosts within a family, and sharing a component library does not merge two families.
- **No `DESIGN.md` in product repos.** Design rules live only in the skill, and a product repo gets one path-scoped line in its existing `AGENTS.md` that points to the skill when UI files are edited. The trigger is never the word "design", because the old keyword-triggered `DESIGN.md` loaded design rules into unrelated backend tasks.
- **Governance starts manual, then graduates.** The owner reviews design-touching PRs by hand until that becomes a bottleneck, then automated visual and drift checks become the first reviewer, and per-team champions follow once teams have stable ownership. Staying manual forever is a failure mode, not the plan.
- **Manual version bumps, CI staleness check.** Consumers pick up changes through small manual bump PRs until that becomes a chore, then a Renovate-style bot opens them. CI fails if the generated artifacts are stale against `tokens.json`.

### Open

- The primary colour.
- Light and dark modes.
- The adoption order.

## ✅ Change Checklist

When editing this repo:

1. If token values change, edit `tokens.json`, then run `node build`.
2. If artifact names or destinations change, update `build/`, CI, README, CONTEXT, playground write-back, and product-skill references.
3. If agent guidance changes, update the relevant product skill and keep recipes tied to shipped product code.
4. Do not add publication or discovery instructions until the skill is ready to ship.
5. If the change is planning/status only, update Linear instead of adding another repo plan.
