# Dark-only across all Kilo surfaces

Kilo is **dark-only** everywhere: Cloud, Landing, Console, Mobile, and the editor surfaces.
There is no designed light mode. The light mode currently in the mobile app was an incidental
mobile-dev default, not a product decision, and will be removed.

`tokens.json` is therefore a single dark-first palette, split into two buckets:

- **Brand + status colors** (yellow-green primary, plus blue/purple/emerald/zinc/orange/green/
  yellow/red status hues) — mode-agnostic; they read as Kilo on any background.
- **Surface neutrals** (the near-black ladder + grays) — dark only.

Consequences:

- **VS Code webview** renders **Kilo-dark**, rather than following the host's light theme.
  **Exception (accessibility):** honor VS Code **high-contrast** themes — do not trap
  high-contrast users in a fixed dark panel. This refines ADR 0007 (webview is "Kilo-dark; honor
  high-contrast only," not "themed by `--vscode-*` light/dark/HC").
- **Mobile:** remove the light-mode token set; consume the dark palette only. This is real work
  in `apps/mobile` — coordinate with the mobile dev (whose decision the light mode originally was).
- No `tokens.json` light/dark pairing; no speculative light mode for the web apps.
