# Token color formats: hex source, OKLCH for web, hex for portable targets

`tokens.json` stays **hex** as the hand-authored source (universally readable; the format the
Cloud and Landing docs already quote).

The generator emits **different color spaces per consumption target**:

- **`tokens.web.css`** (Cloud + Landing, real browsers) → **OKLCH**. It must sit alongside
  Cloud's existing OKLCH vars in `globals.css` (mixing hex + OKLCH in one `:root` would
  manufacture the inconsistency we are removing), and OKLCH lets derived tokens (hover, dim,
  ring) be computed from a base via `oklch(from …)` instead of hand-picked.
- **`tokens.ts`** (Solid VS Code webview, React Native mobile, CLI) → **hex/rgba**. React
  Native / Hermes and terminals cannot be relied on to parse `oklch()`, so the portable
  artifact stays hex.

The generator converts hex→OKLCH for the web file only, via a small standard color lib
(`culori`). This is the single justified dependency; no Style Dictionary / Figma pipeline.
