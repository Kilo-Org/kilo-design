# kilo-design

Canonical design-system source for Kilo products.

This repo has one job: keep Kilo UI decisions consumable by both people and agents without turning every product repo into another design-system fork.

## Read This First

The repo has four active surfaces:

| Surface | Purpose | Authority |
| --- | --- | --- |
| `tokens.json` | Hand-authored token source | Canonical values |
| `src/` | Generated token artifacts | Committed output from `node build` |
| `playground/` | Local token editing and visual specimens | Human review tool only |
| `skills/` | Draft product-skill sources | Agent guidance under development |

Supporting context:

| Path | Purpose |
| --- | --- |
| `build/` | Token generator |
| `CONTEXT.md` | Shared vocabulary |
| `docs/adr/` | Accepted design-system decisions |
| `skill-comparison/` | Static comparison playground for skill behavior specimens |
| `.plans/` | Archived planning pointer; Linear is current |

Product code does not live here. Cloud, Landing, Console, VS Code, JetBrains, CLI, and Mobile consume this repo from their own repositories.

## Authority Model

Use this order when sources disagree:

1. `tokens.json` is the source of truth for values.
2. `src/` artifacts are generated from `tokens.json` and should not be edited by hand.
3. Product skill sources, starting with `skills/kilo-design-cloud/`, tell agents how to use values in product work.
4. Pattern recipes must cite real shipped product code as Canonical Examples.
5. `playground/` specimens preview token behavior only. They are not product components, recipes, or canonical examples.
6. ADRs explain why decisions exist; they are not daily agent guidance.
7. Linear is the active project plan.

## Tokens

`tokens.json` is intentionally hand-authored JSON. Current token groups include:

- `color.brand` for Kilo's primary brand action color and related action states.
- `color.status` for product and semantic status hue families.
- `color.surface` for the dark surface ramp: inset, background, raised, overlay, hover, and selected.
- `color.foreground` for text and icon colors on surfaces.
- `color.border` for border and input-fill values.
- `color.syntax` and `color.diff` for code and review surfaces.
- `statusDomain` for mapping product domains to status color families.
- `typography`, `radius`, and `spacing` for portable UI foundations.

The current primary brand action color is `#F7F586`. Kilo is dark-only; there is no light-mode token set.

## Generated Artifacts

Run the generator from the repo root:

```bash
node build
```

It regenerates:

- `src/tokens.landing.css`: OKLCH CSS variables for Landing browser surfaces.
- `src/tokens.cloud.ts`: hex values and flattened CSS-variable names for Cloud TypeScript consumers.
- `src/tokens.extension-host-map.md`: host-environment mapping notes for VS Code, JetBrains, and CLI/ANSI usage.

CI runs `node build` and fails if committed artifacts differ from the source.

## Playground

The playground is a local token authoring tool. It helps tune `tokens.json`, preview color/type/spacing behavior, and regenerate committed artifacts.

It is not:

- A component library.
- A product UI reference implementation.
- A source for pattern recipes.
- A replacement for real Cloud, Landing, or editor code.

Run it locally:

```bash
pnpm install
pnpm run playground
```

Then open:

```text
http://localhost:8731
```

Useful commands:

```bash
pnpm run playground
pnpm --dir playground dev
pnpm --dir playground build
pnpm --dir playground start
pnpm --dir playground lint
```

The write-back API is local-development only and refuses token reads or writes when `NODE_ENV` is `production`.

## Draft Skills

This repo currently contains one draft product skill source:

- `skills/kilo-design-cloud`

It contains the Cloud overlay, Cloud-specific references, and the first pilot recipes. It is not treated as published yet. A standalone `kilo-design-core` runtime skill does not exist; ADR 0011 defers that until a second product skill proves real reuse.

## Active Plan

Linear is the canonical project plan:

https://linear.app/vheissu/project/kilo-design-30d3263d297a

Current simplified sequence:

1. Tokens — done.
2. Skills — now.
3. Cloud proof — next.
4. Other products — later.

## Change Checklist

When editing this repo:

1. If token values change, edit `tokens.json`, then run `node build`.
2. If artifact names or destinations change, update `build/`, CI, README, CONTEXT, ADRs, playground write-back, and product-skill references.
3. If agent guidance changes, update the relevant product skill and keep recipes tied to shipped product code.
4. Do not add publication or discovery instructions until the skill is ready to ship.
5. If the change is just planning/status, update Linear instead of adding another repo plan.
