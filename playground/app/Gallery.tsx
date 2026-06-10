"use client";

import { useState } from "react";
import { ColorBucket, Tokens, isMeta, isColor, TypeRole } from "@/lib/tokens";
import s from "./gallery.module.css";

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
        <div className={s.swatchName}>{label}</div>
        <input
          className={s.swatchVal}
          aria-label={`Set ${fieldLabel}`}
          value={value}
          spellCheck={false}
          onChange={(e) => onChange(bucket, tokenName, e.target.value)}
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
  const { color, shadow, radius, spacing, typography, statusDomain } = tokens;

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
    <div className={s.surface}>
      {/* ---------------- FOUNDATIONS ---------------- */}
      <section className={s.sec}>
        <h2 className={s.secTitle}>Foundations</h2>
        <p className={s.lede}>Color chips are live controls: click a chip to open the picker or edit the hex value inline.</p>

        <h3 className={s.sub}>Brand</h3>
        <div className={s.swatchRow}>{colorSwatches("brand")}</div>

        <h3 className={s.sub}>Status hues</h3>
        <div className={s.swatchRow}>{colorSwatches("status")}</div>

        <h3 className={s.sub}>Surface</h3>
        <div className={s.swatchRow}>{colorSwatches("surface", "surface.")}</div>

        <h3 className={s.sub}>Foreground</h3>
        <div className={s.swatchRow}>{colorSwatches("foreground", "fg.")}</div>

        <h3 className={s.sub}>Border</h3>
        <div className={s.swatchRow}>{colorSwatches("border", "border.")}</div>

        <h3 className={s.sub}>Radius</h3>
        <div className={s.scaleRow}>
          {Object.entries(radius).filter(([k]) => !isMeta(k)).map(([k, v]) => (
            <div key={k} className={s.scaleItem}>
              <div className={s.radiusBox} style={{ borderRadius: v }} />
              <div className={s.scaleName}>{k} · {v}</div>
            </div>
          ))}
        </div>

        <h3 className={s.sub}>Spacing</h3>
        <div className={s.scaleRow}>
          {Object.entries(spacing).filter(([k]) => !isMeta(k)).map(([k, v]) => (
            <div key={k} className={s.scaleItem}>
              <div className={s.spaceBox} style={{ width: v, height: v }} />
              <div className={s.scaleName}>{k.replace("_", ".")} · {v}</div>
            </div>
          ))}
        </div>

        <h3 className={s.sub}>Shadow</h3>
        <div className={s.shadowRow}>
          {Object.entries(shadow).filter(([k]) => !isMeta(k)).map(([k, v]) => (
            <div key={k} className={s.shadowCard} style={{ boxShadow: v }}>
              <div className={s.shadowName}>{k}</div>
            </div>
          ))}
        </div>

        <h3 className={s.sub}>Type scale</h3>
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

        <h3 className={s.sub}>Buttons <span className={s.hint}>— one primary (neon) per surface</span></h3>
        <div className={s.cluster}>
          <button className={`${s.btn} ${s.btnPrimary}`}>Run agent</button>
          <button className={`${s.btn} ${s.btnSecondary}`}>Cancel</button>
          <button className={`${s.btn} ${s.btnOutline}`}>Settings</button>
          <button className={`${s.btn} ${s.btnGhost}`}>Dismiss</button>
          <button className={`${s.btn} ${s.btnDestructive}`}>Delete</button>
          <button className={`${s.btn} ${s.btnPrimary}`} disabled>Disabled</button>
        </div>

        <h3 className={s.sub}>Status badges <span className={s.hint}>— derived from statusDomain map</span></h3>
        <div className={s.cluster}>
          {Object.entries(statusDomain)
            .filter(([k]) => !isMeta(k))
            .map(([domain, hue]) => (
              <span key={domain} className={s.badge} style={statusStyle(hue)}>
                {domain}
              </span>
            ))}
        </div>

        <h3 className={s.sub}>Cards &amp; elevation</h3>
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
            <div className={s.cardMeta}>Floating chrome uses the overlay surface + shadow.</div>
          </div>
        </div>

        <h3 className={s.sub}>Inputs &amp; focus ring</h3>
        <div className={s.cluster}>
          <input className={s.input} placeholder="Search repositories…" />
          <input className={`${s.input} ${s.inputFocus}`} defaultValue="Focused (ring = brand)" />
          <PreviewSwitch />
        </div>

        <h3 className={s.sub}>Tabs</h3>
        <div className={s.tabs}>
          <button className={`${s.tab} ${s.tabActive}`}>Overview</button>
          <button className={s.tab}>Logs</button>
          <button className={s.tab}>Diffs</button>
          <button className={s.tab}>Settings</button>
        </div>

        <h3 className={s.sub}>Alerts</h3>
        <div className={s.alert} style={statusStyle("green", 14, 35)}>Agent finished. 3 files changed.</div>
        <div className={s.alert} style={statusStyle("yellow", 14, 35)}>Token budget at 80%.</div>
        <div className={s.alert} style={statusStyle("red", 14, 35)}>Build failed: type error in tokens.ts.</div>

        <h3 className={s.sub}>Code &amp; diff <span className={s.hint}>— AI coding context</span></h3>
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

        <h3 className={s.sub}>Chat</h3>
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
