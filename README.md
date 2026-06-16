# kilo-design

Canonical source of truth for Kilo's design system across products including Cloud, Landing, Console, VS Code, JetBrains, CLI, and Mobile.

This repository currently contains the first implementation slice of the design system: the hand-authored token contract and a local playground for reviewing and tuning it visually.

## What Lives Here

- `tokens.json` is the canonical design token source for the current dark-first Kilo design language.
- `playground/` is a local Next.js app for previewing, editing, and saving `tokens.json`.
- `CONTEXT.md` defines the shared glossary for the design-system architecture.
- `docs/adr/` records the locked architecture decisions behind the system.
- `.plans/` contains the foundation plan and execution checklist for future work.

## Token Contract

`tokens.json` is intentionally hand-authored JSON. It is the source of truth for token values, not generated output.

Current token groups include:

- `color.brand` for Kilo's primary brand action color and related action states.
- `color.status` for product and semantic status hue families.
- `color.surface` for the dark surface ramp: inset, background, raised, overlay, hover, and selected.
- `color.foreground` for text and icon colors on surfaces.
- `color.border` for border and input-fill values.
- `color.syntax` and `color.diff` for code and review surfaces.
- `statusDomain` for mapping product domains to status color families.
- `typography`, `radius`, and `spacing` for portable UI foundations.

The current primary brand action color is `#F7F586`. The system is dark-only by decision; there is no light-mode token set in this repo.

## Run The Playground

From the repository root:

```bash
cd playground
pnpm install
pnpm dev
```

Then open:

```text
http://localhost:8731
```

If dependencies are already installed:

```bash
cd playground && pnpm dev
```

Useful playground scripts:

```bash
pnpm dev     # Start the local playground on port 8731
pnpm build   # Build smoke test into .next-build
pnpm start   # Start the production build on port 8731
pnpm lint    # Next lint command
```

## Edit Tokens

The playground loads `../tokens.json` at startup and applies the values as live CSS variables.

- Edit color tokens from the preview swatches.
- Edit radius, spacing, typography, and status-domain mappings from the left control rail.
- Inspect the serialized output in the right JSON rail.
- Use `Save to tokens.json` to write the current playground state back to the repo root token file.
- Use `Cmd+.` or `Ctrl+.` to collapse or expand both side rails together.

The write-back API is local-development only and refuses token reads or writes when `NODE_ENV` is `production`.

## Architecture Decisions

Read these before changing the design-system direction:

1. `CONTEXT.md` for glossary terms such as Core Skill, Product Skill, Product Overlay, Pattern Recipe, Canonical Example, and Drift.
2. `docs/adr/` for the settled decisions and their reasoning.
3. `.plans/kilo-design-system-foundation.md` for the strategy behind the design-system architecture.
4. `.plans/kilo-design-system-execution-checklist.md` for the task-by-task implementation plan.

## What Does Not Live Here

Product code lives in the product repositories. This repo publishes design tokens and agent-consumable design-system guidance to those products; it does not contain the product applications themselves.
