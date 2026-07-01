# Kilo Design System Foundation — Archived Summary

This file is historical context only. Linear is the canonical active project plan:

https://linear.app/vheissu/project/kilo-design-30d3263d297a

Do not use this file as an implementation checklist.

## Why This Repo Exists

Kilo design guidance had split across product docs, local skills, token files, and shipped code. The result was two kinds of drift:

- Value drift: token values and product CSS disagreed.
- Pattern drift: repeated UI patterns such as buttons and tabs had multiple implementations.

The repo exists to provide one design-system source that can be consumed by people, product code, and agents.

## Current Direction

The accepted direction is now smaller than the original plan:

1. `tokens.json` is the source of truth for values.
2. `node build` generates committed artifacts in `src/`.
3. `playground/` is a local token authoring and specimen-preview tool.
4. `skills/kilo-design-cloud/` is the first product skill source and proves the agent-guidance format.
5. A standalone `kilo-design-core` runtime skill is deferred until a second product skill proves reuse.

See ADR 0011 for the current skill-packaging decision.

## Superseded Ideas

The original planning material discussed a broader immediate rollout: core skill first, multiple product skills, long phase lists, and older artifact names. Those details are superseded by the current README, ADRs, and Linear plan.

The original long-form plan remains recoverable in git history if needed. Keeping only this summary in the working tree reduces stale guidance for future agents.
