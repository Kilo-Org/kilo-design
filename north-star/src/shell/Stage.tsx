import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const MARGIN = 24;

/** Fills the space under the bar and scales a fixed-size design to fit it, centered. Never scrolls. */
export function Stage({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current!;
    const fit = () => setScale(Math.min(1, (el.clientWidth - MARGIN * 2) / w, (el.clientHeight - MARGIN * 2) / h));
    // Measure before paint so a surface switch never shows a frame at the previous scale.
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h]);
  return (
    <div className="stage" ref={ref}>
      <div className="design" style={{ width: w, height: h, transform: `translate(-50%, -50%) scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
