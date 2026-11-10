# Kilo Design

Kilo's canonical design source for product UI. Agent guidance will be written from it.

This repo keeps Kilo's UI decisions in one place so Desktop, Cloud, Mobile, VS Code and the other Kilo surfaces do not each invent their own design system.

It is intentionally small: one token source, one generated stylesheet, and one app that shows the language.

> 🚧 This project is still in progress. The language is being defined from Kilo Desktop first; no product consumes these tokens yet.

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| Colour tokens | Done | `tokens.json` is the only place values are written. Dark and light. Role names may still change. |
| Type, radius, spacing tokens | Drafted | Defined in `tokens.json`, but the screens in `north-star/` still hard-code these values. |
| Generated stylesheet | Done | `node build` writes `src/tokens.css`. |
| Language app | Done | `north-star/` shows foundations, components and product screens from the tokens. |
| VS Code surface | Next | Not in the app yet. The host editor owns its colours, so it needs its own study. |
| Desktop adoption | Next | Desktop is the first product to take its theme from this repo. |
| Cloud, Mobile | Later | Follow Desktop. |
| Motion, chat anatomy, voice | Not started | In scope; see Plan. |
| Agent guidance | Later | Written from the tokens and the Components page once the language is settled. The earlier Cloud pilot skill was removed. |

## 🗺️ Plan

**What the language covers.** Seven parts, and no component code:

1. Colour roles, in dark and light.
2. Type.
3. Spacing, radius and density.
4. Motion.
5. States for the core components.
6. Chat anatomy: thread, message, composer, tool call.
7. Voice.

**No shared component library.** Desktop, Cloud, Mobile and VS Code run on four different UI stacks, so nothing can be shared as code. The language is shared as values and rules, and each product builds its own components to match the Components page.

**Chat.** The team agreed to standardise on [assistant-ui](https://www.assistant-ui.com/). Desktop is the reference, and Cloud moves its chat to it. Mobile and VS Code cannot use the library, so they follow the same anatomy as layout rules.

**How a product adopts.** Each product keeps the variable names it already has and adds one mapping file that points them at the Kilo roles. Desktop, Cloud and Mobile already use shadcn-style names, so the mapping is short. In VS Code the host editor owns colour, so only type, spacing, shape, states and chat anatomy apply there.

**Order.** Desktop, then Cloud, then Mobile, then VS Code.

**Who owns what.** The design owner owns this repo: the tokens, the app and the guidance. Each product's developer owns the mapping file in their repo.

**Agent guidance.** Once the language is settled: one root language file with per-topic references, and three skills, to build new UI, to convert existing UI, and to audit a product for drift.

## Repository Model

| Surface | What it is | Authority |
| --- | --- | --- |
| `tokens.json` | Hand-authored design token source, dark and light | Canonical values |
| `src/tokens.css` | Generated CSS variables | Committed output from `node build` |
| `north-star/` | Local Vite + React app: Foundations, Components, and target screens for Desktop, Cloud and Mobile | Reference for people and agents; reads only the tokens |
| `skill-arena/` | Repeatable prompt-pass workflow | Skill evaluation harness; its Kilo condition is off until a new skill exists |

Product code does not live here. Product repos consume this repo's artifacts from their own codebases.

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

The skill arena is a local mini app for regenerating one prompt across several skill conditions. It will be used to test the agent skills once they are written.

```bash
node skill-arena/server.mjs
```

Then open:

```text
http://127.0.0.1:8791
```

It shows stacked rounds of no-skill and frontend-design outputs, with a fixed prompt composer at the bottom. The Kilo condition is switched off until a new skill exists. Each round writes HTML outputs and logs under `skill-arena/runs/`. `pnpm run skill-arena` starts it too.

## ⚖️ Authority Model

Use this order when sources disagree:

1. `tokens.json`
2. `src/tokens.css`
3. the Components page in `north-star/`
4. nearby shipped product UI

## Decisions

These decisions still hold. Earlier decision records are in git history.

- **Tokens and the Components page are the target.** Token values and the target column of the Components page define where products are going, and shipped code that disagrees is drift to migrate. Each target records which shipped product it was taken from, so it is never an invented ideal.
- **Standalone repo, pulled by pinned hash.** The system lives in its own repo so that no product monorepo owns it, and consumers pull a pinned commit. No npm package, because registry and publish auth across three toolchains is too much upkeep, and no git submodule, because one was tried in `kilo-cloud` (PR #3507) and reverted days later (#3535).
- **One hand-authored source, generated artifacts.** Values are edited in one source, `tokens.json`, and every product format is generated from it by `node build`. Today that is one CSS file; Mobile and VS Code will need their own generated formats. Generated files are never edited by hand.
- **Products are grouped by who owns the colours.** A product family is set by its theming contract, not by the code library it imports: surfaces that adapt to one host's theme are hosts within a family, and sharing a component library does not merge two families.
- **No `DESIGN.md` in product repos.** Design rules live only in this repo's agent guidance, and a product repo gets one path-scoped line in its existing `AGENTS.md` that points to it when UI files are edited. The trigger is never the word "design", because the old keyword-triggered `DESIGN.md` loaded design rules into unrelated backend tasks.
- **Governance starts manual, then graduates.** The design owner reviews design-touching PRs by hand until that becomes a bottleneck, then automated visual and drift checks become the first reviewer, and per-team champions follow once teams have stable ownership. Staying manual forever is a failure mode, not the plan.
- **Manual version bumps, CI staleness check.** Consumers pick up changes through small manual bump PRs until that becomes a chore, then a Renovate-style bot opens them. CI fails if the generated artifacts are stale against `tokens.json`.
- **Primary actions are neutral.** The primary button uses the foreground colour (`act-bg`). The yellow `#FFDD00` appears only in the logo. Yellow on white is about 1.35:1, so it cannot carry text or small marks in light mode.
- **Dark and light.** Every colour role has a value in both modes, and the build fails if one is missing. Desktop already ships both.
- **Desktop first.** The language is defined from Kilo Desktop, and Desktop adopts it before the other products.

### Open

- Role names. They are the short names the north-star screens used (`fg2`, `act-bg`, `ink`). Rename before a product depends on them.
- `subtle` text is under 4.5:1 on `bg` in both modes. See the Contrast table on the Foundations page.
- How VS Code takes part, given the host owns its colours. Not yet studied against its code.
- How far Cloud and Mobile are from these tokens. Not yet audited.
- The chat anatomy has not been written down from Desktop.
- Whether the Desktop developer agrees to take Desktop's theme from this repo. Desktop adoption depends on it.

## ✅ Change Checklist

When editing this repo:

1. If token values change, edit `tokens.json`, then run `node build` and commit `src/tokens.css`.
2. Never write a colour, radius or shadow value into `north-star/`. Add a role to `tokens.json` instead.
3. If the artifact name or location changes, update `build/`, CI, this README, `north-star/src/main.tsx` and `skill-arena/server.mjs`.
4. If the change is planning or status only, update Linear instead of adding a repo plan.
