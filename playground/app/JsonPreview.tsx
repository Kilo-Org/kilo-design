"use client";

import { useMemo } from "react";
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
  onToggle,
}: {
  tokens: Tokens;
  dirty: boolean;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const json = useMemo(() => JSON.stringify(tokens, null, 2), [tokens]);
  const highlighted = useMemo(() => highlight(json), [json]);

  return (
    <aside className={`${j.panel} ${collapsed ? j.collapsed : ""}`}>
      <button className={j.toggle} onClick={onToggle} title={collapsed ? "Show tokens.json" : "Hide tokens.json"}>
        {collapsed ? "‹" : "›"}
        <span className={j.toggleLabel}>tokens.json</span>
      </button>
      {!collapsed && (
        <div className={j.inner}>
          <div className={j.header}>
            <span className={j.title}>tokens.json {dirty && <span className={j.dirtyDot}>● live</span>}</span>
          </div>
          <pre className={j.code}><code>{highlighted}</code></pre>
        </div>
      )}
    </aside>
  );
}
