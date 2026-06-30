# kilo-design

Canonical source of truth for Kilo's design system across products including Cloud, Landing, Console, VS Code, JetBrains, CLI, and Mobile.

This repository currently contains the first implementation slice of the design system: the hand-authored token contract, generated token artifacts, and a local playground for reviewing and tuning tokens visually.

## What Lives Here

- `tokens.json` is the canonical design token source for the current dark-first Kilo design language.
- `src/` contains generated token artifacts for product consumption.
- `build/` contains the token generator used by humans, the playground, and CI.
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

## Generated Artifacts

Run the generator from the repository root:

```bash
node build
```

This regenerates:

- `src/tokens.web.css`: OKLCH CSS variables for browser products.
- `src/tokens.ts`: hex token values and flattened CSS-variable names for portable JavaScript/TypeScript consumers.
- `src/tokens.host-map.md`: generated host-environment mapping notes for VS Code, JetBrains, and CLI/ANSI usage.

CI runs the same command and fails if regenerated artifacts differ from the committed files. That keeps `tokens.json` and `src/` in sync.

## Run The Playground

From the repository root:

```bash
pnpm install
pnpm --dir playground dev
```

Then open:

```text
http://localhost:8731
```

If dependencies are already installed:

```bash
pnpm --dir playground dev
```

Useful playground scripts:

```bash
pnpm --dir playground dev     # Start the local playground on port 8731
pnpm --dir playground build   # Build smoke test into .next-build
pnpm --dir playground start   # Start the production build on port 8731
pnpm --dir playground lint    # Next lint command
```

## Edit Tokens

The playground loads `../tokens.json` at startup and applies the values as live CSS variables.

- Edit color tokens from the preview swatches.
- Edit radius, spacing, typography, and status-domain mappings from the left control rail.
- Inspect the serialized output in the right JSON rail.
- Use `Save Tokens` to write the current playground state back to the source file.
- Use `Undo last save` if a saved experiment should be restored to the previous source state.
- Open the dropdown next to `Save Tokens` and choose `Generate Tokens` to regenerate `src/` from the saved source file. This action is disabled while there are unsaved edits.
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
