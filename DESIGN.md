---
version: 0.1.0
name: Kilo Design
description: Shared design language for Kilo Cloud, Kilo Landing, and Kilo editor products.
tokens: ./tokens.json
products:
  cloud: ./products/cloud.md
  landing: ./products/landing.md
  editor: ./products/editor.md
---

# Kilo Design

Kilo is an AI coding agent for developers. The interface should feel like a trustworthy infra tool: dark-first, compact, direct, and calm. The brand can be sharp and memorable, but product surfaces should not feel decorative, vague, or generic.

## Core Rules

1. Value creates hierarchy. Core product surfaces step from near-black canvas to slightly lighter surfaces. Avoid using color shifts as the main way to create structure.
2. Borders are white at low alpha. This is one of the most recognizable Kilo moves. Prefer translucent white borders over solid gray strokes.
3. Yellow acts. The Kilo yellow-green is both brand and primary action. Use it sparingly, usually once per surface, for the thing the user is there to do.
4. Greys carry the interface. Secondary actions, cards, tables, inputs, sidebars, and chrome should mostly stay neutral.
5. Status colors are semantic. Use the defined status palette for badges and state, not for decorative accents.
6. Copy is plain and concrete. Speak to developers in second person, use concrete nouns, and avoid inflated product language.

## Color

Use `tokens.json` as the source for values.

Core surfaces:

- `background` is the app canvas.
- `surface` is the default card, sidebar, dialog, and container surface.
- `surface-raised` is for popovers, menus, and floating chrome.
- `muted` is for hover states, inactive tab backgrounds, and quiet secondary fills.

Foreground:

- `foreground` for primary text.
- `foreground-muted` for secondary text, metadata, and captions.
- `foreground-subtle` for disabled or tertiary copy.

Actions:

- `primary` is the Kilo yellow-green action color.
- `secondary` is the dark-gray workhorse.
- `link` is inline only. Do not use blue as a button background.
- `destructive` appears inside confirm or destructive flows.

Status:

Use translucent fills, matching rings, and brighter foreground text. Do not invent new status hues until the taxonomy genuinely needs one.

## Typography

Use a compact hierarchy. Kilo is a tool people use while doing work, not a landing page by default.

- Sans: Inter or the closest product-system equivalent.
- Mono: Roboto Mono or the closest product-system equivalent.
- Body: 14px / 1.5 by default.
- Page h1: compact and direct.
- Display type is reserved for onboarding, empty states, and landing hero moments.
- Use sentence case for user-visible product UI.
- Use mono for code, terminal output, dollar amounts, token counts, latency, and timestamps in dense data.

## Layout

Keep product interfaces dense but legible.

- Use the 4px spacing ladder.
- Prefer 8, 12, 16, and 24px for most layout decisions.
- Controls are compact by default: 36px regular, 32px small.
- Cards use consistent padding and radius.
- Avoid card-in-card layouts unless a repeated item or modal genuinely needs framing.

## Shape

Radii should be role-based:

- `sm` for controls, badges, menu items, and inputs.
- `md` for popovers and secondary surfaces.
- `lg` for non-dashboard cards.
- `xl` for primary dashboard cards.
- `full` only for avatars and true pills.

## Product Overlays

Read the shared rules first, then the relevant product overlay:

- Cloud: `products/cloud.md`
- Landing: `products/landing.md`
- Editor: `products/editor.md`

If a product needs a local exception, write it in the product overlay and keep the shared file stable.
