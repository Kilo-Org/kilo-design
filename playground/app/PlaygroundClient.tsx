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
  const [restoringSave, setRestoringSave] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [artifactsStale, setArtifactsStale] = useState(false);
  const [undoSaveSnapshot, setUndoSaveSnapshot] = useState<Tokens | null>(null);
  const [tokenMenuOpen, setTokenMenuOpen] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [jsonCollapsed, setJsonCollapsed] = useState(false);

  const tokenVars = useMemo(() => flattenToCssVars(tokens) as CSSProperties, [tokens]);
  const tokenMenuRef = useRef<HTMLDivElement>(null);

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

  const downloadFromMenu = () => {
    setTokenMenuOpen(false);
    download();
  };

  const save = async () => {
    if (!dirty) {
      setStatus({ tone: "muted", text: "No token changes to save" });
      return;
    }
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
      setUndoSaveSnapshot(original);
      setOriginal(tokens); setDirty(false);
      setArtifactsStale(true);
      setStatus({ tone: "success", text: "Saved Tokens; undo remains available" });
    } catch {
      setStatus({ tone: "error", text: "Save failed — is the dev server running?" });
    } finally {
      setSaving(false);
    }
  };

  const undoLastSave = async () => {
    if (!undoSaveSnapshot) return;
    setRestoringSave(true);
    setStatus(null);
    try {
      const res = await fetch("/api/tokens", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tokens: undoSaveSnapshot }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus({ tone: "error", text: data.error ?? "Undo save failed" }); return; }
      setTokens(undoSaveSnapshot); setOriginal(undoSaveSnapshot); setDirty(false);
      setArtifactsStale(true); setUndoSaveSnapshot(null);
      setStatus({ tone: "success", text: "Restored previous tokens.json" });
    } catch {
      setStatus({ tone: "error", text: "Undo save failed — is the dev server running?" });
    } finally {
      setRestoringSave(false);
    }
  };

  const generate = async () => {
    setTokenMenuOpen(false);
    setGenerating(true);
    setStatus(null);
    try {
      const res = await fetch("/api/tokens", { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setStatus({ tone: "error", text: data.error ?? "Generate failed" }); return; }
      setArtifactsStale(false);
      setStatus({ tone: "success", text: "Generated Tokens" });
    } catch {
      setStatus({ tone: "error", text: "Generate failed — is the dev server running?" });
    } finally {
      setGenerating(false);
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

  useEffect(() => {
    if (!tokenMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (tokenMenuRef.current?.contains(e.target as Node)) return;
      setTokenMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setTokenMenuOpen(false); };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [tokenMenuOpen]);

  const closeDrawers = () => { setRailCollapsed(true); setJsonCollapsed(true); };
  const drawersOpen = !railCollapsed || !jsonCollapsed;

  const pill: StatusMessage = saving
    ? { tone: "progress", text: "Saving tokens…" }
    : restoringSave
    ? { tone: "progress", text: "Restoring previous save…" }
    : generating
    ? { tone: "progress", text: "Generating Tokens…" }
    : status
    ? status
    : dirty
    ? { tone: "neutral", text: "Unsaved edits" }
    : artifactsStale
    ? { tone: "neutral", text: "Generated Tokens need update" }
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
          <h1 className={p.title}>Token Playground</h1>
        </div>

        <div className={p.spacer} />

        <span className={`${p.statusPill} ${pillToneClass[pill.tone]}`} role="status" aria-live="polite">
          {pill.tone === "progress" ? <span className={p.spinner} aria-hidden="true" /> : <span className={p.statusDot} aria-hidden="true" />}
          <span className={p.statusText}>{pill.text}</span>
        </span>

        <div className={p.actions}>
          <div className={p.secondaryActions}>
            <button className={p.btn} type="button" onClick={reset} disabled={!dirty || saving || restoringSave || generating}>Reset changes</button>
            {undoSaveSnapshot && (
              <button
                className={p.btn}
                type="button"
                onClick={undoLastSave}
                disabled={dirty || saving || restoringSave || generating}
                aria-busy={restoringSave}
              >
                {restoringSave && <span className={p.spinner} aria-hidden="true" />}
                {restoringSave ? "Restoring…" : "Undo last save"}
              </button>
            )}
          </div>
          <div className={p.saveGroup}>
            <button
              className={`${p.btn} ${p.primary} ${p.saveMain}`}
              type="button"
              onClick={save}
              disabled={saving || restoringSave || generating}
              aria-busy={saving}
            >
              {saving && <span className={p.spinnerDark} aria-hidden="true" />}
              {saving ? "Saving…" : "Save Tokens"}
            </button>
            <div className={p.tokenMenu} ref={tokenMenuRef}>
              <button
                className={`${p.btn} ${p.primary} ${p.splitTrigger}`}
                type="button"
                onClick={() => setTokenMenuOpen((open) => !open)}
                disabled={saving || restoringSave || generating}
                aria-expanded={tokenMenuOpen}
                aria-haspopup="menu"
                aria-label="More token actions"
              >
                {generating ? (
                  <span className={p.spinnerDark} aria-hidden="true" />
                ) : (
                  <svg className={p.chevron} aria-hidden="true" focusable="false" viewBox="0 0 16 16">
                    <path d="M4.25 6.25 8 10l3.75-3.75" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
              {tokenMenuOpen && (
                <div className={p.menu} role="menu" aria-label="Token actions">
                  <button
                    className={p.menuItem}
                    type="button"
                    role="menuitem"
                    onClick={generate}
                    disabled={dirty || saving || restoringSave || generating}
                  >
                    Generate Tokens
                  </button>
                  <button
                    className={p.menuItem}
                    type="button"
                    role="menuitem"
                    onClick={downloadFromMenu}
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
          </div>
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

    </div>
  );
}
