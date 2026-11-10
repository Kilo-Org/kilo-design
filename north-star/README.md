# Kilo north star

The Kilo design language in one app: **Foundations** (the tokens), **Components** (one target per component), and target screens for every Kilo product. Primary actions use the foreground color; `#FFDD00` appears only in the logo.

Every value comes from the repo's `tokens.json`, which the app turns into CSS variables when it starts (`tokens-css.ts`, wired in `vite.config.ts`). This app defines no token values.

```sh
pnpm --dir north-star dev      # http://localhost:8732
pnpm --dir north-star build    # typecheck + static build to north-star/dist
```

Routes are hashes: `#/foundations`, `#/components`, `#/desktop/permission`, `#/cloud/credits`, `#/mobile`. Press **L** to switch dark/light.

## Layout

```
src/
  registry.ts                 discovers surfaces and screens; no manual list
  shell/                      page chrome, Stage (scale-to-fit); no token values
  surfaces/<surface>/
    index.ts                  surface meta + imports the surface CSS
    <surface>.css             surface styles (prefixed: d- desktop, c- cloud, m- mobile)
    *.tsx                     shared pieces (window chrome, phone frame)
    screens/<Name>.tsx|.html  one file per screen
```

## Add a screen

Drop a file in `src/surfaces/<surface>/screens/`. The route id is the file name in kebab case.

**React** (`SettingsPanel.tsx` → `#/desktop/settings-panel`):

```tsx
import type { ScreenMeta } from "../../../registry";
import { DesktopWindow } from "../DesktopWindow";

export const meta: ScreenMeta = { title: "Settings", order: 4, source: "kilo-desktop settings.tsx" };
export default function SettingsPanel() {
  return <DesktopWindow session={false}>…</DesktopWindow>;
}
```

Use the roles from `tokens.json` (`--act-bg`, `--ink`, `--soft-bg`, `--bubble-bg`, `--send-bg`, `--live`, …), never a raw value. If a role is missing, add it to `tokens.json` in both modes.

**HTML drop-in** (a self-contained mock exported from another repo or tool). It renders in an iframe at the surface frame size. Optional head tags:

```html
<title>Usage chart</title>
<meta name="north-star:order" content="3">
<meta name="north-star:width" content="1280">
<meta name="north-star:height" content="800">
<meta name="north-star:source" content="kilo-cloud apps/web usage">
```

The app injects the token variables into the iframe and sets `<html data-mode="dark|light">`, so a drop-in uses the same `var(--role)` names as the React screens and needs no colors of its own.

## Add a surface

Create `src/surfaces/<id>/index.ts`:

```ts
import type { SurfaceMeta } from "../../registry";
import "./<id>.css";

export const surface: SurfaceMeta = {
  title: "Kilo Landing",
  caption: "kilo-landing main · 1440 × 900",
  order: 6,
  frame: { w: 1440, h: 900 },
  layout: "tabs", // "gallery" shows every screen side by side, like the phones; "page" is a full-width scrolling page
};
```

Then add screens. A `"tabs"` or `"gallery"` surface appears under **Screens** automatically; a `"page"` surface becomes its own top-level section.
