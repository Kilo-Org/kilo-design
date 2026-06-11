"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Tokens } from "@/lib/tokens";
import j from "./json-preview.module.css";

/** Minimal, dependency-free JSON syntax highlighter.
 *  Tokenizes a pretty-printed JSON string and wraps each part in a span.
 *  Color values additionally get a clickable swatch dot. */
function highlight(json: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match: strings (keys or values), numbers, booleans/null, punctuation.
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+\.?\d*(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],])/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  const push = (key: string, content: React.ReactNode) =>
    nodes.push(<span key={`${nodes.length}-${key}`} className={(j as Record<string, string>)[key]}>{content}</span>);

  while ((m = re.exec(json)) !== null) {
    if (m.index > lastIndex) nodes.push(json.slice(lastIndex, m.index));
    const [full, str, colon, num, lit, punct] = m;

    if (str !== undefined) {
      if (colon) {
        push("key", str);
        nodes.push(colon);
      } else {
        const hex = str.match(/^"(#[0-9a-fA-F]{3,8})"$/);
        if (hex) {
          nodes.push(
            <span key={`sw-${m.index}`} className={j.colorVal}>
              <span className={j.dot} style={{ background: hex[1] }} />
              <span className={j.str}>{str}</span>
            </span>,
          );
        } else {
          push("str", str);
        }
      }
    } else if (num !== undefined) {
      push("num", num);
    } else if (lit !== undefined) {
      push("lit", lit);
    } else if (punct !== undefined) {
      push("punct", punct);
    } else {
      nodes.push(full);
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < json.length) nodes.push(json.slice(lastIndex));
  return nodes;
}

export function JsonPreview({
  tokens,
  dirty,
  collapsed,
  onCopy,
}: {
  tokens: Tokens;
  dirty: boolean;
  collapsed: boolean;
  onCopy: () => void;
}) {
  const json = useMemo(() => JSON.stringify(tokens, null, 2), [tokens]);
  const highlighted = useMemo(() => highlight(json), [json]);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <aside className={j.panel} aria-hidden={collapsed}>
      {!collapsed && (
        <div className={j.inner}>
          <div className={j.header}>
            <span className={j.title}>tokens.json {dirty && <span className={j.dirtyDot}>Live changes</span>}</span>
            <button
              className={`${j.copyBtn} ${copied ? j.copied : ""}`}
              type="button"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.5 8.5l3 3 6-6.5" /></svg>
                  Copied
                </>
              ) : (
                <>
                  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                    <path d="M10.5 5.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
                  </svg>
                  Copy JSON
                </>
              )}
            </button>
          </div>
          <pre className={j.code}><code>{highlighted}</code></pre>
        </div>
      )}
    </aside>
  );
}
