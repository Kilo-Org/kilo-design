---
name: kilo-design-cloud
description: Kilo Cloud web UI overlay and pilot pattern recipes. Use when editing or reviewing Kilo Cloud UI paths such as apps/web/src/**, or when the Cloud repo path-scoped trigger requests Kilo design guidance.
---

# Kilo Design Cloud

This is the first agent-facing adapter for the Kilo design system. It covers Kilo Cloud's web app and the first Cloud pattern recipes.

## Run Order

1. Read the target Cloud file first. For components, also read the matching primitive in `apps/web/src/components/ui/`.
2. Load `overlay.md` for all Cloud UI work.
3. Load one internal reference only when the task needs it: product judgment, brand, token architecture, voice, or interaction quality.
4. Load at most one matching recipe unless the task clearly spans multiple patterns.
5. If no recipe exists, use the overlay plus current Cloud code and report a coverage gap.
6. Keep broad product cleanup out of focused tasks.
7. Do not use playground specimen UI as a Cloud Canonical Example.

Completion criterion: the answer or change names the loaded overlay/recipe, follows real Cloud code, and does not normalize unrelated UI.

## Recipe Router

| Prompt or file signal | Load |
| --- | --- |
| primary action, CTA, button hierarchy, blue button drift | `patterns/cloud-web/primary-actions.md` |
| tabs, segmented navigation, Radix tabs, active tab state | `patterns/cloud-web/tabs.md` |
| tokens, globals.css, semantic mapping | `reference/token-architecture.md`; record that Cloud token adoption is `VVV-130` |
| copy, empty states, labels, errors, confirmations | `reference/voice.md` |
| forms, focus, keyboard, overlays, responsive layout, touch targets, loading, disabled, motion | `reference/interaction-quality.md` |
| badges, alerts, dialogs, sidebar, empty states | `overlay.md`; report coverage gap if a rule is missing |

## Non-Goals

- Do not build Landing, Editor, Console, Mobile, JetBrains, or CLI guidance here.
- Do not recreate a Cloud `DESIGN.md`.
- Do not migrate every hardcoded blue button unless the task is `primary-actions` implementation.
- Do not invent recipes without a real Canonical Example in shipped Cloud code.
- Do not copy UI structures from `playground/`; it previews token behavior only.

## Reference Map

- `overlay.md`: Cloud product overlay and known drift.
- `reference/product-judgment.md`: modes, authority order, and coverage gaps.
- `reference/brand.md`: Cloud use of Kilo brand language.
- `reference/token-architecture.md`: how Cloud agents should read product-facing token artifacts.
- `reference/voice.md`: Kilo Cloud UI copy rules.
- `reference/interaction-quality.md`: interaction states, form behavior, overlays, responsive checks, touch, and motion.
- `patterns/cloud-web/primary-actions.md`: primary CTA and button hierarchy recipe.
- `patterns/cloud-web/tabs.md`: Cloud tab recipe.
