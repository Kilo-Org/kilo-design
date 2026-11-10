import { useEffect, useRef } from "react";
import type { Screen } from "../registry";
import tokensCss from "virtual:kilo-tokens";

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
  const onLoad = () => {
    sync();
    // Key presses inside the frame never reach the app, so pass them up (the L mode shortcut).
    ref.current?.contentDocument?.addEventListener("keydown", (e) => {
      if (!(e.target as Element).closest?.("input,textarea")) dispatchEvent(new KeyboardEvent("keydown", { key: e.key }));
    });
  };
  return (
    <iframe
      ref={ref}
      className="dropin"
      title={screen.title}
      // Drop-ins get the same tokens as the React screens.
      srcDoc={screen.html.replace(/<head[^>]*>/i, (head) => `${head}<style>${tokensCss}</style>`)}
      onLoad={onLoad}
      style={{ inset: 0, width: "100%", height: "100%" }}
    />
  );
}
