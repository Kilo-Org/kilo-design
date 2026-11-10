# Kilo Design

Kilo's canonical design source for product UI and agent guidance.

This repo keeps Kilo's UI decisions in one place so Desktop, Cloud, Mobile, VS Code and the other Kilo surfaces do not each invent their own design system.

It is intentionally small: one token source, one generated stylesheet, one app that shows the language, and a draft product skill.

> 🚧 This project is still in progress. The language is being defined from Kilo Desktop first; no product consumes these tokens yet.

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| Tokens | Done | `tokens.json` is the only place values are written. Dark and light. |
| Generated stylesheet | Done | `node build` writes `src/tokens.css`. |
| Language app | Done | `north-star/` shows foundations, components and product screens from the tokens. |
| VS Code surface | Next | Not in the app yet. The host editor owns its colours, so it needs its own study. |
| Desktop adoption | Next | Desktop is the first product to take its theme from this repo. |
| Cloud, Mobile | Later | Follow Desktop. |
| Cloud skill | Paused | `skills/kilo-design/` predates the current tokens. Its file references are current; its guidance is not reviewed. |

## Repository Model

| Surface | What it is | Authority |
| --- | --- | --- |
| `tokens.json` | Hand-authored design token source, dark and light | Canonical values |
| `src/tokens.css` | Generated CSS variables | Committed output from `node build` |
| `north-star/` | Local Vite + React app: Foundations, Components, and target screens for Desktop, Cloud and Mobile | Reference for people and agents; reads only the tokens |
| `skills/` | Draft product skill source | Agent guidance, paused |
| `skill-comparison/` | Static skill behavior comparison | First-pass specimens |
| `skill-arena/` | Repeatable prompt-pass workflow | Skill evaluation harness |

Product code does not live here. Product repos consume this repo's artifacts and skills from their own codebases.

## 🔁 How The Pieces Connect

```text
tokens.json
  -> node build
     -> src/tokens.css
        -> north-star/ (every screen and the component page)
  -> north-star/ Foundations page (reads the JSON directly)
```

`north-star/` holds no token values of its own. To change a colour, edit `tokens.json` and run `node build`.

## 📦 Tokens

Colour roles live under `color.dark` and `color.light`, and every role must exist in both. A value written as `{other-role}` is an alias. Each role becomes a CSS variable of the same name, for example `color.dark.act-bg` becomes `--act-bg`.

```bash
node build
```

This regenerates `src/tokens.css`. Dark is the default; set `data-mode="light"` or `data-mode="dark"` on any element to switch. The generated file is committed and never edited by hand. CI fails if it drifts from `tokens.json`.

## 🧭 Language App

```bash
pnpm install
pnpm run dev
```

Then open `http://localhost:8732`. Press **L** to switch dark and light.

| Section | Shows |
| --- | --- |
| Foundations | Every colour role in both modes, contrast ratios, type, radius and spacing |
| Components | One target per component, next to what Desktop, Cloud and Mobile ship today |
| Screens | Target screens for Kilo Desktop, Kilo Cloud and Kilo Mobile |

How to add a screen or a surface: `north-star/README.md`.

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

## ☁️ Cloud Skill

`skills/kilo-design/` is a draft skill for Kilo Cloud's web app, written before the current tokens. It is paused until the language is settled. It will be rewritten from the tokens and the Components page, not patched.

## ⚖️ Authority Model

Use this order when sources disagree:

1. `tokens.json`
2. `src/tokens.css`
3. the Components page in `north-star/`
4. nearby shipped product UI

## Decisions

These decisions still hold. Earlier decision records are in git history.

- **Tokens are prescriptive; patterns are descriptive.** Token values define the target, and shipped code that disagrees is drift to migrate. Every pattern recipe must cite a canonical example in shipped code, never a mock, because recipes that point at ideals that do not exist lead agents to invent them.
- **Standalone repo, pulled by pinned hash.** The system lives in its own repo so that no product monorepo owns it, and consumers pull a pinned commit, as skills already sync through `skills-lock.json`. No npm package, because registry and publish auth across three toolchains is too much upkeep, and no git submodule, because one was tried in `kilo-cloud` (PR #3507) and reverted days later (#3535).
- **One hand-authored source, generated artifacts.** Values are edited in one source, `tokens.json`, and every product format is generated from it by `node build`. Generated files are never edited by hand.
- **Products are grouped by who owns the colours.** A product family is set by its theming contract, not by the code library it imports: surfaces that adapt to one host's theme are hosts within a family, and sharing a component library does not merge two families.
- **No `DESIGN.md` in product repos.** Design rules live only in the skill, and a product repo gets one path-scoped line in its existing `AGENTS.md` that points to the skill when UI files are edited. The trigger is never the word "design", because the old keyword-triggered `DESIGN.md` loaded design rules into unrelated backend tasks.
- **Governance starts manual, then graduates.** The owner reviews design-touching PRs by hand until that becomes a bottleneck, then automated visual and drift checks become the first reviewer, and per-team champions follow once teams have stable ownership. Staying manual forever is a failure mode, not the plan.
- **Manual version bumps, CI staleness check.** Consumers pick up changes through small manual bump PRs until that becomes a chore, then a Renovate-style bot opens them. CI fails if the generated artifacts are stale against `tokens.json`.

- **Primary actions are neutral.** The primary button uses the foreground colour (`act-bg`). The yellow `#FFDD00` appears only in the logo. Yellow on white is about 1.35:1, so it cannot carry text or small marks in light mode.
- **Dark and light.** Every colour role has a value in both modes, and the build fails if one is missing. Desktop already ships both.
- **Desktop first.** The language is defined from Kilo Desktop, and Desktop adopts it before the other products.

### Open

- Role names. They are the short names the north-star screens used (`fg2`, `act-bg`, `ink`). Rename before a product depends on them.
- `subtle` text is under 4.5:1 on `bg` in both modes. See the Contrast table on the Foundations page.
- How VS Code takes part, given the host owns its colours.

## ✅ Change Checklist

When editing this repo:

1. If token values change, edit `tokens.json`, then run `node build` and commit `src/tokens.css`.
2. Never write a colour, radius or shadow value into `north-star/`. Add a role to `tokens.json` instead.
3. If the artifact name or location changes, update `build/`, CI, this README, `north-star/src/main.tsx`, and the skill references.
4. If the change is planning or status only, update Linear instead of adding a repo plan.
