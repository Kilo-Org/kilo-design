import { useEffect, useRef } from "react";
import type { Screen } from "../registry";

export type Mode = "dark" | "light";

/** Renders one screen at its frame size, positioned by the caller. */
export function ScreenView({ screen, mode }: { screen: Screen; mode: Mode }) {
  if (screen.kind === "react") return <screen.Component />;
  return <HtmlScreen screen={screen} mode={mode} />;
}

function HtmlScreen({ screen, mode }: { screen: Extract<Screen, { kind: "html" }>; mode: Mode }) {
  const ref = useRef<HTMLIFrameElement>(null);
  // Drop-ins can theme off <html data-mode="dark|light">; set it on load and on every toggle.
  const sync = () => {
    const doc = ref.current?.contentDocument;
    if (doc) doc.documentElement.dataset.mode = mode;
  };
  useEffect(sync, [mode]);
  return (
    <iframe
      ref={ref}
      className="dropin"
      title={screen.title}
      srcDoc={screen.html}
      onLoad={sync}
      style={{ inset: 0, width: "100%", height: "100%" }}
    />
  );
}
