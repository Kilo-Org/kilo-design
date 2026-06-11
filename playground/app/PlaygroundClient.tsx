"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Tokens, flattenToCssVars } from "@/lib/tokens";
import { Controls } from "./Controls";
import { Gallery } from "./Gallery";
import { JsonPreview } from "./JsonPreview";
import p from "./playground.module.css";

type StatusTone = "muted" | "neutral" | "success" | "error" | "progress";
interface StatusMessage {
  tone: StatusTone;
  text: string;
}

export function PlaygroundClient({ initialTokens }: { initialTokens: Tokens }) {
  const [tokens, setTokens] = useState<Tokens>(initialTokens);
  const [original, setOriginal] = useState<Tokens>(initialTokens);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmingReload, setConfirmingReload] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [jsonCollapsed, setJsonCollapsed] = useState(false);

  const tokenVars = useMemo(() => flattenToCssVars(tokens) as CSSProperties, [tokens]);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Drawers overlay content on narrow viewports; start collapsed there so the
  // editing surface is visible first.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 720px)").matches) {
      setRailCollapsed(true);
      setJsonCollapsed(true);
    }
  }, []);

  const change = (next: Tokens) => { setTokens(next); setDirty(true); setStatus(null); };

  const serialize = () => JSON.stringify(tokens, null, 2) + "\n";

  const reload = async () => {
    setConfirmingReload(false);
    try {
      const res = await fetch("/api/tokens", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) { setStatus({ tone: "error", text: data.error ?? "Reload failed" }); return; }
      setTokens(data.tokens); setOriginal(data.tokens); setDirty(false);
      setStatus({ tone: "success", text: "Reloaded from tokens.json" });
    } catch {
      setStatus({ tone: "error", text: "Reload failed — is the dev server running?" });
    }
  };

  const requestReload = () => {
    if (dirty) { setConfirmingReload(true); return; }
    void reload();
  };

  const reset = () => { setTokens(original); setDirty(false); setStatus({ tone: "neutral", text: "Edits discarded" }); };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(serialize());
      setStatus({ tone: "success", text: "JSON copied to clipboard" });
    } catch {
      setStatus({ tone: "error", text: "Couldn't access the clipboard" });
    }
  };

  const download = () => {
    const blob = new Blob([serialize()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "tokens.json" });
    a.click();
    URL.revokeObjectURL(url);
    setStatus({ tone: "success", text: "Downloaded tokens.json" });
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/tokens", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tokens }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus({ tone: "error", text: data.error ?? "Save failed" }); return; }
      setOriginal(tokens); setDirty(false);
      setStatus({ tone: "success", text: "Saved to tokens.json" });
    } catch {
      setStatus({ tone: "error", text: "Save failed — is the dev server running?" });
    } finally {
      setSaving(false);
    }
  };

  // Transient messages fade back to the standing dirty/synced state.
  useEffect(() => {
    if (!status || status.tone === "progress") return;
    const t = setTimeout(() => setStatus(null), 2800);
    return () => clearTimeout(t);
  }, [status]);

  // Cmd+. (mac) / Ctrl+. toggles both side panels together.
  // If either is open, collapse both; otherwise open both — keeps them in sync.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "." && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const collapse = !railCollapsed || !jsonCollapsed;
        setRailCollapsed(collapse);
        setJsonCollapsed(collapse);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [railCollapsed, jsonCollapsed]);

  // Move focus into the reload confirmation and restore the standing state on Escape.
  useEffect(() => {
    if (!confirmingReload) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setConfirmingReload(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmingReload]);

  const closeDrawers = () => { setRailCollapsed(true); setJsonCollapsed(true); };
  const drawersOpen = !railCollapsed || !jsonCollapsed;

  const pill: StatusMessage = saving
    ? { tone: "progress", text: "Saving…" }
    : status
    ? status
    : dirty
    ? { tone: "neutral", text: "Unsaved edits" }
    : { tone: "muted", text: "Synced" };

  const pillToneClass: Record<StatusTone, string> = {
    muted: p.toneMuted,
    neutral: p.toneNeutral,
    success: p.toneSuccess,
    error: p.toneError,
    progress: p.toneProgress,
  };

  return (
    <div
      className={`${p.app} ${railCollapsed ? p.railCollapsed : ""} ${jsonCollapsed ? p.jsonCollapsed : ""}`}
      data-theme="kilo-dark"
      data-rail-collapsed={railCollapsed}
      data-json-collapsed={jsonCollapsed}
      style={tokenVars}
    >
      <header className={p.topbar}>
        <div className={p.brandCluster}>
          <div className={p.brandTile}>K</div>
          <h1 className={p.title}>Token Playground</h1>
        </div>

        <div className={p.paneToggles} role="group" aria-label="Panels">
          <button
            type="button"
            className={`${p.iconBtn} ${!railCollapsed ? p.activeIconBtn : ""}`}
            onClick={() => setRailCollapsed((v) => !v)}
            aria-pressed={!railCollapsed}
            aria-label={railCollapsed ? "Show controls panel" : "Hide controls panel"}
            title={`${railCollapsed ? "Show" : "Hide"} controls — toggle both panels with ⌘.`}
          >
            <SidebarIcon side="left" />
          </button>
          <button
            type="button"
            className={`${p.iconBtn} ${!jsonCollapsed ? p.activeIconBtn : ""}`}
            onClick={() => setJsonCollapsed((v) => !v)}
            aria-pressed={!jsonCollapsed}
            aria-label={jsonCollapsed ? "Show tokens JSON panel" : "Hide tokens JSON panel"}
            title={jsonCollapsed ? "Show tokens JSON" : "Hide tokens JSON"}
          >
            <SidebarIcon side="right" />
          </button>
        </div>

        <div className={p.spacer} />

        <span className={`${p.statusPill} ${pillToneClass[pill.tone]}`} role="status" aria-live="polite">
          {pill.tone === "progress" ? <span className={p.spinner} aria-hidden="true" /> : <span className={p.statusDot} aria-hidden="true" />}
          <span className={p.statusText}>{pill.text}</span>
        </span>

        <div className={p.actions}>
          <div className={p.secondaryActions}>
            <button className={p.btn} type="button" onClick={requestReload} aria-haspopup={dirty ? "dialog" : undefined}>
              Reload source
            </button>
            <button className={p.btn} type="button" onClick={reset} disabled={!dirty}>Reset changes</button>
            <button className={p.btn} type="button" onClick={download}>Download</button>
          </div>
          <button
            className={`${p.btn} ${p.primary}`}
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            aria-busy={saving}
          >
            {saving && <span className={p.spinnerDark} aria-hidden="true" />}
            {saving ? "Saving…" : "Save to tokens.json"}
          </button>
        </div>
      </header>

      <aside className={p.rail} aria-hidden={railCollapsed}>
        {!railCollapsed && <Controls tokens={tokens} onChange={change} />}
      </aside>

      <main className={p.galleryWrap} data-gallery-scroll>
        <Gallery tokens={tokens} />
      </main>

      <JsonPreview tokens={tokens} dirty={dirty} collapsed={jsonCollapsed} onCopy={copy} />

      {drawersOpen && (
        <button className={p.scrim} type="button" aria-label="Close panels" onClick={closeDrawers} tabIndex={-1} />
      )}

      {confirmingReload && (
        <>
          <button className={p.confirmScrim} type="button" aria-label="Cancel reload" onClick={() => setConfirmingReload(false)} tabIndex={-1} />
          <div className={p.confirm} role="dialog" aria-modal="true" aria-labelledby="reload-confirm-title">
            <h2 className={p.confirmTitle} id="reload-confirm-title">Discard unsaved edits?</h2>
            <p className={p.confirmBody}>
              Reloading replaces your current edits with the saved <code>tokens.json</code> on disk. This can&rsquo;t be undone.
            </p>
            <div className={p.confirmActions}>
              <button ref={confirmRef} className={p.btn} type="button" onClick={() => setConfirmingReload(false)}>
                Keep editing
              </button>
              <button className={`${p.btn} ${p.danger}`} type="button" onClick={reload}>
                Discard &amp; reload
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SidebarIcon({ side }: { side: "left" | "right" }) {
  const panelX = side === "left" ? 4 : 14;
  const lineX = side === "left" ? 11 : 13;

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <rect x="3.5" y="4.5" width="13" height="11" rx="2" />
      <path d={`M${lineX} 5v10`} />
      <path d={`M${panelX} 7.5h4M${panelX} 10h4M${panelX} 12.5h4`} />
    </svg>
  );
}
