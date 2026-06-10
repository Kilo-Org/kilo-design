"use client";

import { useEffect, useRef, useState } from "react";
import { ColorBucket, Tokens, isMeta, isColor, TypeRole } from "@/lib/tokens";
import s from "./gallery.module.css";

/** A complete hex color: #rgb, #rgba, #rrggbb, or #rrggbbaa. */
const isHex = (v: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v.trim());

/** Navigable sections, grouped. `id` is the DOM anchor + scrollspy key. */
const NAV: { group: string; items: { id: string; label: string }[] }[] = [
  {
    group: "Foundations",
    items: [
      { id: "brand", label: "Brand" },
      { id: "status", label: "Status" },
      { id: "surface", label: "Surface" },
      { id: "foreground", label: "Foreground" },
      { id: "border", label: "Border" },
      { id: "radius", label: "Radius" },
      { id: "spacing", label: "Spacing" },
      { id: "type", label: "Type scale" },
    ],
  },
  {
    group: "Components",
    items: [
      { id: "buttons", label: "Buttons" },
      { id: "badges", label: "Badges" },
      { id: "cards", label: "Cards" },
      { id: "inputs", label: "Inputs" },
      { id: "tabs", label: "Tabs" },
      { id: "alerts", label: "Alerts" },
      { id: "code", label: "Code & diff" },
      { id: "chat", label: "Chat" },
    ],
  },
];

const ALL_IDS = NAV.flatMap((g) => g.items.map((i) => i.id));

/** Sticky section nav with scrollspy highlighting. */
function GalleryNav({ active, onJump }: { active: string; onJump: (id: string) => void }) {
  return (
    <nav className={s.nav} aria-label="Gallery sections">
      {NAV.map((group) => (
        <div key={group.group} className={s.navGroup}>
          <span className={s.navGroupLabel}>{group.group}</span>
          {group.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${s.navTab} ${active === item.id ? s.navTabActive : ""}`}
              aria-current={active === item.id ? "true" : undefined}
              onClick={() => onJump(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}

/** Translucent status styling derived from a hue family (e.g. "blue"),
 *  reading the live --status-* vars so it updates as tokens change. */
function statusStyle(hue: string, fillPct = 20, borderPct = 45): React.CSSProperties {
  const base = `var(--status-${hue}500)`;
  return {
    background: `color-mix(in srgb, ${base} ${fillPct}%, transparent)`,
    color: `var(--status-${hue}400)`,
    borderColor: `color-mix(in srgb, ${base} ${borderPct}%, transparent)`,
  };
}

function Swatch({
  bucket,
  tokenName,
  label,
  value,
  onChange,
}: {
  bucket: ColorBucket;
  tokenName: string;
  label: string;
  value: string;
  onChange: (bucket: ColorBucket, name: string, value: string) => void;
}) {
  const base6 = value.match(/^#([0-9a-fA-F]{6})/);
  const pickerValue = base6 ? `#${base6[1]}` : "#000000";
  const fieldLabel = `${bucket}.${tokenName}`;

  // Local draft so typing a hex is smooth; only commit a *valid* hex upstream.
  const [draft, setDraft] = useState(value);
  // Re-sync when the canonical value changes from elsewhere (picker, reset, reload).
  useEffect(() => { setDraft(value); }, [value]);

  const commit = () => {
    const next = draft.trim();
    if (isHex(next)) {
      if (next !== value) onChange(bucket, tokenName, next);
    } else {
      setDraft(value); // revert invalid input
    }
  };

  const onText = (raw: string) => {
    setDraft(raw);
    // Live-apply only once it's a complete, valid hex; partial input stays local.
    if (isHex(raw.trim())) onChange(bucket, tokenName, raw.trim());
  };

  return (
    <div className={s.swatch}>
      <div className={s.chip} style={{ background: value }}>
        <input
          className={s.swatchPicker}
          type="color"
          aria-label={`Pick ${fieldLabel}`}
          value={pickerValue}
          onChange={(e) => onChange(bucket, tokenName, e.target.value)}
        />
        <span className={s.chipCue}>Edit</span>
      </div>
      <div className={s.swatchMeta}>
        <div className={s.swatchName} title={label}>{label}</div>
        <input
          className={s.swatchVal}
          aria-label={`Set ${fieldLabel}`}
          value={draft}
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => onText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") { setDraft(value); (e.target as HTMLInputElement).blur(); }
          }}
        />
      </div>
    </div>
  );
}

function PreviewSwitch() {
  const [enabled, setEnabled] = useState(true);

  return (
    <button
      type="button"
      className={`${s.switch} ${enabled ? s.switchOn : ""}`}
      role="switch"
      aria-checked={enabled}
      onClick={() => setEnabled((value) => !value)}
    >
      <span className={s.track} />
      {enabled ? "Enabled" : "Disabled"}
    </button>
  );
}

export function Gallery({
  tokens,
  onColorChange,
}: {
  tokens: Tokens;
  onColorChange: (bucket: ColorBucket, name: string, value: string) => void;
}) {
  const { color, radius, spacing, typography, statusDomain } = tokens;

  const surfaceRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(ALL_IDS[0]);

  // Scrollspy: highlight the section nearest the top of the scroll viewport.
  useEffect(() => {
    const root = surfaceRef.current?.closest<HTMLElement>("[data-gallery-scroll]") ?? null;
    const anchors = ALL_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!anchors.length) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        }
        // Pick the topmost visible anchor (first in document order).
        const topmost = ALL_IDS.find((id) => visible.has(id));
        if (topmost) setActive(topmost);
      },
      { root, rootMargin: "-56px 0px -65% 0px", threshold: [0, 1] },
    );
    anchors.forEach((a) => observer.observe(a));
    return () => observer.disconnect();
  }, []);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  const colorSwatches = (bucket: ColorBucket, prefix = "") =>
    Object.entries(color[bucket] as Record<string, string>)
      .filter(([k, v]) => !isMeta(k) && isColor(v))
      .map(([k, v]) => (
        <Swatch
          key={`${bucket}-${k}`}
          bucket={bucket}
          tokenName={k}
          label={`${prefix}${k}`}
          value={v}
          onChange={onColorChange}
        />
      ));

  const typeRoles = Object.entries(typography).filter(
    ([k, v]) => !isMeta(k) && typeof v !== "string",
  ) as [string, TypeRole][];

  return (
    <div className={s.surface} ref={surfaceRef}>
      <GalleryNav active={active} onJump={jump} />

      {/* ---------------- FOUNDATIONS ---------------- */}
      <section className={s.sec}>
        <h2 className={s.secTitle}>Foundations</h2>
        <p className={s.lede}>Color chips are live controls: click a chip to open the picker or edit the hex value inline.</p>

        <h3 id="brand" className={`${s.sub} ${s.anchor}`}>Brand</h3>
        <div className={s.swatchRow}>{colorSwatches("brand")}</div>

        <h3 id="status" className={`${s.sub} ${s.anchor}`}>Status hues</h3>
        <div className={s.swatchRow}>{colorSwatches("status")}</div>

        <h3 id="surface" className={`${s.sub} ${s.anchor}`}>Surface</h3>
        <div className={s.swatchRow}>{colorSwatches("surface", "surface.")}</div>

        <h3 id="foreground" className={`${s.sub} ${s.anchor}`}>Foreground</h3>
        <div className={s.swatchRow}>{colorSwatches("foreground", "fg.")}</div>

        <h3 id="border" className={`${s.sub} ${s.anchor}`}>Border</h3>
        <div className={s.swatchRow}>{colorSwatches("border", "border.")}</div>

        <h3 id="radius" className={`${s.sub} ${s.anchor}`}>Radius</h3>
        <div className={s.scaleRow}>
          {Object.entries(radius).filter(([k]) => !isMeta(k)).map(([k, v]) => (
            <div key={k} className={s.scaleItem}>
              <div className={s.radiusBox} style={{ borderRadius: v }} />
              <div className={s.scaleName}>{k} · {v}</div>
            </div>
          ))}
        </div>

        <h3 id="spacing" className={`${s.sub} ${s.anchor}`}>Spacing</h3>
        <div className={s.scaleRow}>
          {Object.entries(spacing).filter(([k]) => !isMeta(k)).map(([k, v]) => (
            <div key={k} className={s.scaleItem}>
              <div className={s.spaceBox} style={{ width: v, height: v }} />
              <div className={s.scaleName}>{k.replace("_", ".")} · {v}</div>
            </div>
          ))}
        </div>

        <h3 id="type" className={`${s.sub} ${s.anchor}`}>Type scale</h3>
        <div className={s.typeSpecimen}>
          {typeRoles.map(([role, def]) => (
            <div
              key={role}
              style={{
                fontFamily: `${def.fontFamily}, sans-serif`,
                fontSize: def.fontSize,
                fontWeight: def.fontWeight,
                lineHeight: def.lineHeight,
                letterSpacing: def.letterSpacing,
              }}
            >
              <span className={s.tname}>
                {role} · {def.fontFamily} {def.fontSize}/{def.fontWeight}
              </span>
              The quick brown fox jumps
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- COMPONENTS ---------------- */}
      <section className={s.sec}>
        <h2 className={s.secTitle}>Components in context</h2>

        <h3 id="buttons" className={`${s.sub} ${s.anchor}`}>Buttons <span className={s.hint}>— one primary (neon) per surface</span></h3>
        <div className={s.cluster}>
          <button className={`${s.btn} ${s.btnPrimary}`}>Run agent</button>
          <button className={`${s.btn} ${s.btnSecondary}`}>Cancel</button>
          <button className={`${s.btn} ${s.btnOutline}`}>Settings</button>
          <button className={`${s.btn} ${s.btnGhost}`}>Dismiss</button>
          <button className={`${s.btn} ${s.btnDestructive}`}>Delete</button>
          <button className={`${s.btn} ${s.btnPrimary}`} disabled>Disabled</button>
        </div>

        <h3 id="badges" className={`${s.sub} ${s.anchor}`}>Status badges <span className={s.hint}>— derived from statusDomain map</span></h3>
        <div className={s.cluster}>
          {Object.entries(statusDomain)
            .filter(([k]) => !isMeta(k))
            .map(([domain, hue]) => (
              <span key={domain} className={s.badge} style={statusStyle(hue)}>
                {domain}
              </span>
            ))}
        </div>

        <h3 id="cards" className={`${s.sub} ${s.anchor}`}>Cards &amp; elevation</h3>
        <div className={s.cluster}>
          <div className={s.card}>
            <div className={s.cardTitle}>Project</div>
            <div className={s.cardMeta}>Surface ladder: background → raised → overlay</div>
            <div className={`${s.card} ${s.cardInset}`}>
              <div className={s.cardTitle}>Nested surface</div>
              <div className={s.cardMeta}>Value, not hue, creates hierarchy.</div>
            </div>
          </div>
          <div className={`${s.card} ${s.popover}`}>
            <div className={s.cardTitle}>Popover / overlay</div>
            <div className={s.cardMeta}>Floating chrome uses the overlay surface.</div>
          </div>
        </div>

        <h3 id="inputs" className={`${s.sub} ${s.anchor}`}>Inputs &amp; focus ring</h3>
        <div className={s.cluster}>
          <input className={s.input} placeholder="Search repositories…" />
          <input className={`${s.input} ${s.inputFocus}`} defaultValue="Focused (ring = brand)" />
          <PreviewSwitch />
        </div>

        <h3 id="tabs" className={`${s.sub} ${s.anchor}`}>Tabs</h3>
        <div className={s.tabs}>
          <button className={`${s.tab} ${s.tabActive}`}>Overview</button>
          <button className={s.tab}>Logs</button>
          <button className={s.tab}>Diffs</button>
          <button className={s.tab}>Settings</button>
        </div>

        <h3 id="alerts" className={`${s.sub} ${s.anchor}`}>Alerts</h3>
        <div className={s.alert} style={statusStyle("green", 14, 35)}>Agent finished. 3 files changed.</div>
        <div className={s.alert} style={statusStyle("yellow", 14, 35)}>Token budget at 80%.</div>
        <div className={s.alert} style={statusStyle("red", 14, 35)}>Build failed: type error in tokens.ts.</div>

        <h3 id="code" className={`${s.sub} ${s.anchor}`}>Code &amp; diff <span className={s.hint}>— AI coding context</span></h3>
        <pre className={s.code}><span className={s.cKey}>const</span> <span className={s.cVar}>primary</span> = <span className={s.cStr}>&quot;#EDFF00&quot;</span>; <span className={s.cCom}>// brand === primary</span></pre>
        <pre className={s.diff}>
          <span className={s.dAdd}>+  --primary: oklch(0.93 0.23 119);</span>
          <span className={s.dDel}>-  --primary: oklch(0.922 0 0);</span>
          <span className={s.dCtx}>   --primary-foreground: #1F1F1F;</span>
        </pre>
        <pre className={s.terminal}>
          <span><span className={s.tPrompt}>$</span> kilo build tokens{"\n"}</span>
          <span><span className={s.tOk}>✓</span> tokens.web.css   <span className={s.tDim}>(OKLCH)</span>{"\n"}</span>
          <span><span className={s.tOk}>✓</span> tokens.ts        <span className={s.tDim}>(hex/rgba)</span></span>
        </pre>

        <h3 id="chat" className={`${s.sub} ${s.anchor}`}>Chat</h3>
        <div className={s.chat}>
          <div className={`${s.bubble} ${s.bubbleUser}`}>Migrate the primary color to the brand yellow.</div>
          <div className={`${s.bubble} ${s.bubbleAssistant}`}>
            On it. I&apos;ll update <code>--primary</code> and the button variant.
            <span className={s.toolChip}>edit tokens.json</span>
            <span className={s.typing}><i /><i /><i /></span>
          </div>
        </div>
      </section>
    </div>
  );
}
