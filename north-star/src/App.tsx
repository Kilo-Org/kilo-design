import { useEffect, useRef, useState } from "react";
import { surfaces, type Surface } from "./registry";
import { Stage } from "./shell/Stage";
import { ScreenView, type Mode } from "./shell/ScreenView";
import { KiloDefs, KiloTile } from "./shell/KiloMark";

const CAP_H = 32;
const GAP = 40;

function useHashRoute() {
  const read = () => location.hash.replace(/^#\/?/, "").split("/");
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return [route, (...p: string[]) => (location.hash = "/" + p.join("/"))] as const;
}

function useMode() {
  const [mode, setMode] = useState<Mode>(
    () => (new URLSearchParams(location.search).get("mode") ?? localStorage.getItem("north-star:mode")) === "light" ? "light" : "dark",
  );
  useEffect(() => localStorage.setItem("north-star:mode", mode), [mode]);
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === "l" && !(e.target instanceof HTMLInputElement)) setMode((m) => (m === "dark" ? "light" : "dark"));
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  }, []);
  return [mode, setMode] as const;
}

export function App() {
  const [[surfaceId, screenId], go] = useHashRoute();
  const [mode, setMode] = useMode();
  // Three sections: each "page" surface is its own section, and the product surfaces share one, Screens.
  const pages = surfaces.filter((s) => s.layout === "page");
  const products = surfaces.filter((s) => s.layout !== "page");
  const lastProduct = useRef(products[0]?.id);
  const surface = surfaces.find((s) => s.id === surfaceId) ?? surfaces[0];
  const inScreens = !!surface && surface.layout !== "page";
  if (inScreens) lastProduct.current = surface.id;
  const tabs = surface && surface.layout !== "gallery" && surface.screens.length > 1;
  const screen = surface?.screens.find((s) => s.id === screenId) ?? surface?.screens[0];

  return (
    <div id="root" className="k" data-mode={mode}>
      <KiloDefs />
      <header className="bar" role="toolbar" aria-label="North star controls">
        <KiloTile size={22} />
        <Seg
          value={inScreens ? "screens" : surface?.id}
          options={[...pages.map((s): [string, string] => [s.id, s.title]), ...(products.length ? [["screens", "Screens"] as [string, string]] : [])]}
          onChange={(id) => go(id === "screens" ? lastProduct.current : id)}
        />
        {inScreens && <Seg value={surface.id} options={products.map((s) => [s.id, s.title])} onChange={(id) => go(id)} />}
        {tabs && screen && <Seg value={screen.id} options={surface.screens.map((s) => [s.id, s.title])} onChange={(id) => go(surface.id, id)} />}
        {surface && <span className="bar-cap" title={surface.caption}>{surface.caption}</span>}
        <Seg value={mode} options={[["dark", "Dark"], ["light", "Light"]]} onChange={(m) => setMode(m as Mode)} />
      </header>
      <div className="page">
        {!surface ? (
          <p className="empty">No surfaces registered.</p>
        ) : !screen ? (
          <p className="empty">No screens in surfaces/{surface.id}/screens yet.</p>
        ) : surface.layout === "gallery" ? (
          <Gallery surface={surface} mode={mode} />
        ) : surface.layout === "page" ? (
          <div className="pagefill">
            <ScreenView key={screen.id} screen={screen} mode={mode} />
          </div>
        ) : (
          <Stage w={screen.frame.w} h={screen.frame.h}>
            <ScreenView key={screen.id} screen={screen} mode={mode} />
          </Stage>
        )}
      </div>
    </div>
  );
}

function Gallery({ surface, mode }: { surface: Surface; mode: Mode }) {
  const h = Math.max(...surface.screens.map((s) => s.frame.h));
  let x = 0;
  const placed = surface.screens.map((s) => {
    const at = x;
    x += s.frame.w + GAP;
    return { s, at };
  });
  return (
    <Stage w={x - GAP} h={h + CAP_H}>
      {placed.map(({ s, at }) => (
        <div key={s.id}>
          <div style={{ position: "absolute", left: at, top: 0, width: s.frame.w, height: s.frame.h }}>
            <ScreenView screen={s} mode={mode} />
          </div>
          <span className="cap" style={{ left: at, top: h + 18 }}>{s.title}</span>
        </div>
      ))}
    </Stage>
  );
}

function Seg({ value, options, onChange }: { value?: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <div className="seg">
      {options.map(([v, label]) => (
        <button key={v} aria-pressed={v === value} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  );
}
