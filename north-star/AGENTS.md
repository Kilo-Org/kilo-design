# North star app: agent rules

The Kilo design language in one app: Foundations, Components, and target screens for every Kilo surface. This is a design reference, not product code. Every value comes from the repo root `tokens.json` through the generated `src/tokens.css`. How to run it and add screens: `README.md`.

## Rules

- **Colour by role, never by hex.** This app defines no token values. If a role is missing, add it to the root `tokens.json` in both modes and run `node build`. Use the roles: `--act-bg/fg/bd/hover` (primary action), `--ink`, `--soft-bg/fg`, `--bubble-bg/fg`, `--send-bg/fg`, `--live`, `--check-bg/fg`, `--ring`, plus the neutrals and status colours. `#FFDD00` (`--brand-logo`) appears only in the logo tile.
- **One screen per file.** Add screens under `src/surfaces/<surface>/screens/`. A `.tsx` screen exports `meta: ScreenMeta` and a default component. A `.html` drop-in must be self-contained and must not load assets from other repos. Do not edit `src/registry.ts` to register anything; discovery is automatic.
- **Reuse the frames.** Build on `DesktopWindow`, `ComposerRow`, `SessionCanvas`, `CloudWindow`, `Phone` and `TabBar`. Do not copy a window or phone frame.
- **Prefix every class.** All surface CSS loads globally. Use the surface prefix (`d-` desktop, `c-` cloud, `m-` mobile, or a new one for a new surface), and put the styles in that surface's own `.css`.
- **New surface = new folder.** Add `src/surfaces/<id>/index.ts` exporting `surface: SurfaceMeta` and importing its CSS. Use `layout: "tabs"` for windows, `"gallery"` for phones and `"page"` for a scrolling page.
- **Mock the shipped product.** Base screens on real shipped code, and record where it came from in `meta.source` (repo + file or commit). Do not invent UI that has no product counterpart.
- **Both modes.** Every screen must work in dark and light.

## Verify before done

```sh
pnpm --dir north-star build    # typecheck + bundle
pnpm --dir north-star dev      # http://localhost:8732
```

Open the screen at `/?mode=dark#/<surface>/<screen>` and `/?mode=light#/<surface>/<screen>` and look at both.
