# Kilo Design Token Playground

A small local Next.js tool for editing and previewing the canonical Kilo Design `tokens.json` file. It is intentionally scoped to this repository and is not meant to be deployed as a public app.

## What It Does

- Reads the source of truth from `../tokens.json` at startup.
- Applies token values live as CSS variables to the entire playground UI.
- Lets you edit color tokens directly from the swatches in the preview.
- Keeps non-color controls, such as radius, spacing, typography, and status-domain mappings, in the left control rail.
- Shows the current JSON output in the right rail.
- Can copy, download, reset, or write changes back to `tokens.json` during local development.
- Can regenerate the committed `../src/` token artifacts from the saved source file.

## Running Locally

From the repository root:

```bash
pnpm install
pnpm --dir playground dev
```

Then open:

```text
http://localhost:8731
```

Useful scripts:

```bash
pnpm --dir playground dev     # Start the local playground on port 8731
pnpm --dir playground build   # Build smoke test into .next-build, so it does not clobber a running dev server
pnpm --dir playground start   # Start the .next-build production output on port 8731
pnpm --dir playground lint    # Next lint command
```

## Editing Tokens

The playground starts with the current contents of `../tokens.json`.

- Color tokens: edit from the preview swatches. Click a chip for the native color picker, or edit the hex value inline.
- Layout and type tokens: use the left control rail for radius, spacing, typography, and status-domain values.
- JSON preview: use the right rail to inspect and copy the serialized token output.
- Side rails: use the two sidebar buttons in the header to collapse or expand the controls and JSON preview.

Changes are local to the browser state until you choose one of the actions in the header:

- `Save Tokens` writes the current token state back to `../tokens.json`.
- `Undo last save` restores the previous `../tokens.json` state after an accidental save.
- `Generate Tokens` lives in the dropdown next to `Save Tokens`. It runs `node build` to regenerate `../src/tokens.web.css`, `../src/tokens.ts`, and `../src/tokens.host-map.md` from the saved source file. It is disabled while there are unsaved edits.
- `Reset edits` restores the last loaded source state.
- `Download` lives in the dropdown next to `Save Tokens` and saves the current token state as a JSON file.
- `Copy JSON` in the JSON preview rail copies the current serialized token state.

## Safety Notes

The write-back API is guarded for local development only. `app/api/tokens/route.ts` refuses token read/write requests when `NODE_ENV` is `production`, so the playground should be treated as a local authoring tool rather than a deployed editor.

The page itself also reads `../tokens.json` from disk. Use `pnpm --dir playground dev` from the repo root so the dev server runs with `playground/` as its working directory.

## Implementation Map

- `app/page.tsx` reads the canonical token file and passes it into the client app.
- `app/PlaygroundClient.tsx` owns token state, dirty state, save/reset actions, sidebar state, and live CSS variable injection.
- `app/Gallery.tsx` renders the preview surface and color swatch controls.
- `app/Controls.tsx` renders non-color token controls.
- `app/JsonPreview.tsx` renders the syntax-highlighted JSON rail.
- `lib/tokens.ts` defines token types and flattens token data into CSS variables.
- `lib/oklch.ts` contains color conversion helpers used by the playground utilities.
- `../build/index.js` owns the artifact generator invoked after local saves.
