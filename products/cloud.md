# Kilo Cloud Design

Cloud is the dense, dark-first infra/admin surface for Kilo. It manages organizations, usage, billing, integrations, headless agent sessions, and developer operations.

## Intent

Cloud should feel trustworthy, utilitarian, and operational. It is closer to an infra console than a marketing site.

## Product Rules

1. Never pure black, never a gradient on core app surfaces. Use `background` for the canvas and `surface` for cards.
2. Borders are white at low alpha. Default card borders use the shared translucent border; inputs and focused chrome use the stronger border.
3. Yellow acts. Use the primary yellow-green for the main action on a surface. Secondary actions stay gray.
4. Blue is legacy inline link color only. Never use blue as a primary button background.
5. Status badges use the translucent status pattern: fill, ring, and foreground from the same hue family.
6. Dashboards use vertical stacks of cards. Avoid page-level multi-column grids unless the comparison itself is the task.
7. Tables are compact. Use mono digits for amounts, token counts, timestamps, latency, and IDs.
8. The agent/chat surface may use terminal styling and a restrained brand glow. Billing, admin, and settings screens should stay quieter.

## Layout

- Sidebar: fixed, dense navigation.
- Topbar: sticky, single-breadcrumb chrome.
- Page padding: compact and consistent.
- Card padding: 24px.
- Table rows: 48px.
- Inputs and buttons: 36px.

## Copy

Use direct second-person language. Prefer "Create session", "Connect GitHub", "Update billing", and "Invite member" over abstract or motivational phrasing.
