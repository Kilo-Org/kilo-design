# Kilo Design

Kilo's canonical design source for product UI and agent guidance.

This repo keeps Kilo's UI decisions in one place so Cloud, Landing, Console, VS Code, JetBrains, CLI, and Mobile do not each invent their own design system.

It is intentionally small: token source, generated artifacts, a local playground, ADRs, and draft product skills.

> 🚧 This project is still in progress. The ADRs and `CONTEXT.md` are intentionally visible because the system is still being shaped; they explain current decisions, terminology, and rollout boundaries while the Cloud pilot proves the approach.

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| Tokens | Done | `tokens.json` is the source of truth. |
| Generated artifacts | Done | `node build` writes product-targeted files under `src/`. |
| Playground | Done | Local tool for editing tokens and previewing token behavior. |
| Cloud skill | In progress | First agent-facing product skill lives in `skills/kilo-design-cloud/`. |
| Cloud proof | Next | Validate the skill against real Cloud UI work before wider rollout. |
| Other products | Later | Landing, Editor, Console, Mobile wait until Cloud proves the shape. |

## Repository Model

| Surface | What it is | Authority |
| --- | --- | --- |
| `tokens.json` | Hand-authored design token source | Canonical values |
| `src/` | Generated token artifacts | Committed output from `node build` |
| `playground/` | Local token editor and specimen viewer | Human review tool only |
| `skills/` | Draft product skill sources | Agent guidance under development |
| `docs/adr/` | Decision records | Why decisions exist |

Product code does not live here. Product repos consume this repo's artifacts and skills from their own codebases.

## 🔁 How The Pieces Connect

```text
tokens.json
  -> node build
     -> src/tokens.landing.css
     -> src/tokens.cloud.ts
     -> src/tokens.extension-host-map.md

skills/kilo-design-cloud
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

## ☁️ Cloud Skill Pilot

The first product skill source is:

```text
skills/kilo-design-cloud/
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
3. product skill sources, starting with `skills/kilo-design-cloud/`
4. pattern recipes with shipped product Canonical Examples
5. nearby shipped product UI

## ✅ Change Checklist

When editing this repo:

1. If token values change, edit `tokens.json`, then run `node build`.
2. If artifact names or destinations change, update `build/`, CI, README, CONTEXT, ADRs, playground write-back, and product-skill references.
3. If agent guidance changes, update the relevant product skill and keep recipes tied to shipped product code.
4. Do not add publication or discovery instructions until the skill is ready to ship.
5. If the change is planning/status only, update Linear instead of adding another repo plan.
