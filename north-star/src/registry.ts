import type { ComponentType } from "react";

/** surfaces/<id>/index.ts exports `surface: SurfaceMeta` and imports its own CSS. */
export type SurfaceMeta = {
  title: string;
  /** Short provenance line shown next to the title, e.g. repo + commit. */
  caption: string;
  order: number;
  /** Size of one screen in design pixels. Screens may override. */
  frame: Frame;
  /** tabs: one screen at a time (windows). gallery: all screens side by side (phones). */
  layout: "tabs" | "gallery";
};

/** surfaces/<id>/screens/<Name>.tsx exports `meta: ScreenMeta` and a default component. */
export type ScreenMeta = { title: string; order?: number; source?: string; frame?: Frame };

export type Frame = { w: number; h: number };

export type Screen = {
  id: string;
  title: string;
  order: number;
  source?: string;
  frame: Frame;
} & ({ kind: "react"; Component: ComponentType } | { kind: "html"; html: string });

export type Surface = SurfaceMeta & { id: string; screens: Screen[] };

const surfaceMods = import.meta.glob<{ surface: SurfaceMeta }>("./surfaces/*/index.ts", { eager: true });
const reactMods = import.meta.glob<{ meta: ScreenMeta; default: ComponentType }>("./surfaces/*/screens/*.tsx", { eager: true });
// HTML drop-ins: paste a self-contained mock exported from any repo. Rendered in an iframe.
const htmlMods = import.meta.glob<string>("./surfaces/*/screens/*.html", { eager: true, query: "?raw", import: "default" });

const parts = (path: string) => {
  const m = path.match(/\.\/surfaces\/([^/]+)\/screens\/([^/]+)\.(tsx|html)$/);
  if (!m) throw new Error(`Unexpected screen path ${path}`);
  return { surface: m[1], file: m[2] };
};
const slug = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const htmlMeta = (html: string, name: string, key: string) =>
  html.match(new RegExp(`<meta\\s+name="north-star:${key}"\\s+content="([^"]*)"`, "i"))?.[1] ??
  (key === "title" ? html.match(/<title>([^<]*)<\/title>/i)?.[1] : undefined) ??
  (key === "title" ? name : undefined);

export const surfaces: Surface[] = Object.entries(surfaceMods)
  .map(([path, mod]) => {
    const id = path.split("/")[2];
    const screens: Screen[] = [];
    for (const [p, m] of Object.entries(reactMods)) {
      const { surface, file } = parts(p);
      if (surface !== id) continue;
      if (!m.meta || !m.default) throw new Error(`${p} must export \`meta\` and a default component`);
      screens.push({ id: slug(file), kind: "react", Component: m.default, title: m.meta.title, order: m.meta.order ?? 99, source: m.meta.source, frame: m.meta.frame ?? mod.surface.frame });
    }
    for (const [p, html] of Object.entries(htmlMods)) {
      const { surface, file } = parts(p);
      if (surface !== id) continue;
      const w = Number(htmlMeta(html, file, "width")) || mod.surface.frame.w;
      const h = Number(htmlMeta(html, file, "height")) || mod.surface.frame.h;
      screens.push({ id: slug(file), kind: "html", html, title: htmlMeta(html, file, "title")!, order: Number(htmlMeta(html, file, "order")) || 99, source: htmlMeta(html, file, "source"), frame: { w, h } });
    }
    screens.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    return { ...mod.surface, id, screens };
  })
  .sort((a, b) => a.order - b.order);
