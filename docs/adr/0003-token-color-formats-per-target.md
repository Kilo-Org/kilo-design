# Token color formats: hex source, target-specific artifacts

`tokens.json` stays **hex** as the hand-authored source (universally readable; the format the
Cloud and Landing docs already quote).

The generator emits **different color spaces per consumption target**:

- **`tokens.web.css`** (browser CSS consumers such as Landing) → **OKLCH**. OKLCH lets derived
  tokens (hover, dim, ring) be computed from a base via `oklch(from …)` instead of hand-picked.
- **`tokens.cloud.ts`** (Cloud repo TypeScript consumers) → **hex values plus flattened CSS
  variable names**. Cloud maps these values into semantic UI roles in `globals.css`.
- **`tokens.editor-host-map.md`** (VS Code, JetBrains, CLI/ANSI) → generated host mapping notes
  for editor and terminal environments.

The generator converts hex→OKLCH for the web CSS file only, via a small standard color lib
(`culori`). This is the single justified dependency; no Style Dictionary / Figma pipeline.
