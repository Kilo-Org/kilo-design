"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Tokens, flattenToCssVars } from "@/lib/tokens";
import { Controls } from "./Controls";
import { Gallery } from "./Gallery";
import { JsonPreview } from "./JsonPreview";
import p from "./playground.module.css";

export function PlaygroundClient({ initialTokens }: { initialTokens: Tokens }) {
  const [tokens, setTokens] = useState<Tokens>(initialTokens);
  const [original, setOriginal] = useState<Tokens>(initialTokens);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("");
  const [jsonCollapsed, setJsonCollapsed] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Apply live CSS vars to the scoped gallery root whenever tokens change.
  useLayoutEffect(() => {
    const root = galleryRef.current?.querySelector<HTMLElement>("#gallery-root");
    if (!root) return;
    const vars = flattenToCssVars(tokens);
    for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
  }, [tokens]);

  const change = (next: Tokens) => { setTokens(next); setDirty(true); setStatus(""); };

  const serialize = () => JSON.stringify(tokens, null, 2) + "\n";

  const reload = async () => {
    const res = await fetch("/api/tokens", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) { setStatus(`⚠ ${data.error ?? "reload failed"}`); return; }
    setTokens(data.tokens); setOriginal(data.tokens); setDirty(false); setStatus("✓ reloaded source");
  };

  const reset = () => { setTokens(original); setDirty(false); setStatus("reset to last source"); };

  const copy = async () => { await navigator.clipboard.writeText(serialize()); setStatus("✓ copied JSON"); };

  const download = () => {
    const blob = new Blob([serialize()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "tokens.json" });
    a.click();
    URL.revokeObjectURL(url);
    setStatus("downloaded");
  };

  const save = async () => {
    setStatus("saving…");
    const res = await fetch("/api/tokens", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tokens }),
    });
    const data = await res.json();
    if (!res.ok) { setStatus(`⚠ ${data.error ?? "save failed"}`); return; }
    setOriginal(tokens); setDirty(false); setStatus("✓ saved to tokens.json");
  };

  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(dirty ? "● unsaved edits" : ""), 2600);
    return () => clearTimeout(t);
  }, [status, dirty]);

  return (
    <div className={`${p.app} ${jsonCollapsed ? p.jsonCollapsed : ""}`}>
      <header className={p.topbar}>
        <div className={p.brandTile}>K</div>
        <div>
          <h1 className={p.title}>Kilo Design — Token Playground</h1>
          <div className={p.subtitle}>dark-only · hex source · tailoring <code>tokens.json</code></div>
        </div>
        <div className={p.spacer} />
        <span className={p.status}>{status || (dirty ? "● unsaved edits" : "")}</span>
        <button className={p.btn} onClick={reload}>Reload source</button>
        <button className={p.btn} onClick={reset} disabled={!dirty}>Reset edits</button>
        <button className={p.btn} onClick={copy}>Copy JSON</button>
        <button className={p.btn} onClick={download}>Download</button>
        <button className={`${p.btn} ${p.primary}`} onClick={save} disabled={!dirty}>Save to tokens.json</button>
      </header>

      <aside className={p.rail}>
        <Controls tokens={tokens} onChange={change} />
      </aside>

      <main className={p.galleryWrap} ref={galleryRef}>
        <Gallery tokens={tokens} />
      </main>

      <JsonPreview
        tokens={tokens}
        dirty={dirty}
        collapsed={jsonCollapsed}
        onToggle={() => setJsonCollapsed((v) => !v)}
      />
    </div>
  );
}
