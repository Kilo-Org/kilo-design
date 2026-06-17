"use client";

import { useState, type ReactNode } from "react";
import { Tokens, isMeta, TypeRole } from "@/lib/tokens";
import s from "./gallery.module.css";

/** Top-level tabs. Each renders an independent panel (no long scroll). */
const TABS = [
  { id: "foundations", label: "Foundations" },
  { id: "surfaces", label: "Surfaces" },
  { id: "buttons", label: "Buttons & badges" },
  { id: "forms", label: "Forms & inputs" },
  { id: "cards", label: "Cards & alerts" },
  { id: "editor", label: "Mini editor" },
  { id: "diff", label: "Diff" },
  { id: "chat", label: "Chat & tools" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Tab bar that swaps panels instead of scrolling to anchors. */
function GalleryTabs({ active, onSelect }: { active: TabId; onSelect: (id: TabId) => void }) {
  return (
    <nav className={s.nav} aria-label="Gallery sections" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`${s.navTab} ${active === tab.id ? s.navTabActive : ""}`}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
        </button>
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

/** A grouped section: heading + content inside a raised card on the darker pane. */
function Section({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className={s.sectionCard}>
      <h3 className={s.sub}>{title}</h3>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Foundations                                                         */
/* ------------------------------------------------------------------ */

function FoundationsPanel({ tokens }: { tokens: Tokens }) {
  const { radius, spacing, typography } = tokens;
  const typeRoles = Object.entries(typography).filter(
    ([k, v]) => !isMeta(k) && typeof v !== "string",
  ) as [string, TypeRole][];

  return (
    <section className={s.sec}>
      <h2 className={s.secTitle}>Foundations</h2>
      <p className={s.lede}>Color swatches live in the left sidebar; these are the non-color scales.</p>

      <Section title="Radius">
        <div className={s.scaleRow}>
          {Object.entries(radius).filter(([k]) => !isMeta(k)).map(([k, v]) => (
            <div key={k} className={s.scaleItem}>
              <div className={s.radiusBox} style={{ borderRadius: v }} />
              <div className={s.scaleName}>{k} · {v}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing">
        <div className={s.scaleRow}>
          {Object.entries(spacing).filter(([k]) => !isMeta(k)).map(([k, v]) => (
            <div key={k} className={s.scaleItem}>
              <div className={s.spaceBox} style={{ width: v, height: v }} />
              <div className={s.scaleName}>{k.replace("_", ".")} · {v}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type scale">
        <div className={s.typeScale}>
        {typeRoles.map(([role, def]) => (
          <div key={role} className={s.typeRow}>
            <div className={s.typeMeta}>
              <span className={s.typeRoleName}>{role}</span>
              <span className={s.typeSpecs}>
                {def.fontSize} · {def.fontWeight}
                {def.lineHeight ? ` · ${def.lineHeight}` : ""}
              </span>
            </div>
            <div
              className={s.typeSample}
              style={{
                fontFamily: `${def.fontFamily}, sans-serif`,
                fontSize: def.fontSize,
                fontWeight: def.fontWeight,
                lineHeight: def.lineHeight,
                letterSpacing: def.letterSpacing,
                textTransform: def.textTransform as React.CSSProperties["textTransform"],
              }}
            >
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        ))}
        </div>
      </Section>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons & badges                                                    */
/* ------------------------------------------------------------------ */

function ButtonsPanel({ tokens }: { tokens: Tokens }) {
  const { statusDomain } = tokens;
  return (
    <section className={s.sec}>
      <h2 className={s.secTitle}>Buttons &amp; badges</h2>
      <p className={s.lede}>One primary (brand) action per surface; everything else recedes.</p>

      <Section title="Buttons">
        <div className={s.cluster}>
          <button className={`${s.btn} ${s.btnPrimary}`}>Run agent</button>
          <button className={`${s.btn} ${s.btnSecondary}`}>Cancel</button>
          <button className={`${s.btn} ${s.btnOutline}`}>Settings</button>
          <button className={`${s.btn} ${s.btnGhost}`}>Dismiss</button>
          <button className={`${s.btn} ${s.btnDestructive}`}>Delete</button>
          <button className={`${s.btn} ${s.btnPrimary}`} disabled>Disabled</button>
        </div>
      </Section>

      <Section title={<>Status badges <span className={s.hint}>— derived from statusDomain map</span></>}>
        <div className={s.cluster}>
          {Object.entries(statusDomain)
            .filter(([k]) => !isMeta(k))
            .map(([domain, hue]) => (
              <span key={domain} className={s.badge} style={statusStyle(hue)}>
                {domain}
              </span>
            ))}
        </div>
      </Section>

      <Section title="Pills & counts">
        <div className={s.cluster}>
          <span className={s.pill} style={statusStyle("green", 12, 30)}>● Connected</span>
          <span className={s.pill} style={statusStyle("yellow", 12, 30)}>● Pending</span>
          <span className={s.pill} style={statusStyle("red", 12, 30)}>● Failed</span>
          <span className={s.countPill}>+128 <span className={s.countDim}>/ −34</span></span>
        </div>
      </Section>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Forms & inputs                                                      */
/* ------------------------------------------------------------------ */

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={`${s.toggle} ${on ? s.toggleOn : ""}`}
      onClick={() => setOn((v) => !v)}
    >
      <span className={s.toggleThumb} />
    </button>
  );
}

function FormsPanel() {
  const [tab, setTab] = useState("account");
  return (
    <section className={s.sec}>
      <h2 className={s.secTitle}>Forms &amp; inputs</h2>
      <p className={s.lede}>A realistic settings form — tweak tokens and watch every control respond.</p>

      <div className={s.formCard}>
        <div className={s.formHeader}>
          <div>
            <div className={s.formTitle}>Trigger configuration</div>
            <div className={s.formSubtitle}>Define when and how this agent runs.</div>
          </div>
          <span className={s.badge} style={statusStyle("blue", 14, 35)}>Beta</span>
        </div>

        <div className={s.formTabs} role="tablist">
          {["account", "rules", "advanced"].map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={`${s.formTab} ${tab === t ? s.formTabActive : ""}`}
              onClick={() => setTab(t)}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className={s.formBody}>
          {/* text input */}
          <div className={s.field}>
            <label className={s.fieldLabel} htmlFor="f-name">
              Trigger name <span className={s.req}>*</span>
            </label>
            <input id="f-name" className={s.formInput} defaultValue="nightly-regression" />
            <p className={s.fieldHelp}>Lowercase, no spaces. Used in logs and webhooks.</p>
          </div>

          {/* input with error */}
          <div className={s.field}>
            <label className={s.fieldLabel} htmlFor="f-url">Webhook URL</label>
            <input id="f-url" className={`${s.formInput} ${s.formInputError}`} defaultValue="notaurl" aria-invalid />
            <p className={s.fieldError}>Enter a valid https:// URL.</p>
          </div>

          {/* input with suffix button */}
          <div className={s.field}>
            <label className={s.fieldLabel}>Generated token</label>
            <div className={s.inputGroup}>
              <input className={`${s.formInput} ${s.mono}`} readOnly value="kc_live_8f3a…d21b" />
              <button className={`${s.btn} ${s.btnOutline}`}>Copy</button>
            </div>
          </div>

          {/* select + number row */}
          <div className={s.fieldRow}>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="f-model">Model</label>
              <div className={s.selectWrap}>
                <select id="f-model" className={s.formSelect} defaultValue="opus">
                  <option value="opus">Claude Opus 4.8</option>
                  <option value="sonnet">Claude Sonnet 4.5</option>
                  <option value="haiku">Claude Haiku 4</option>
                </select>
                <svg className={s.selectChevron} viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
              </div>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel} htmlFor="f-budget">Token budget</label>
              <input id="f-budget" type="number" className={s.formInput} defaultValue={50000} step={1000} />
            </div>
          </div>

          {/* textarea */}
          <div className={s.field}>
            <label className={s.fieldLabel} htmlFor="f-prompt">System prompt</label>
            <textarea id="f-prompt" className={s.formTextarea} rows={3} defaultValue={"You are a senior engineer.\nFix failing tests without breaking the public API."} />
            <p className={s.fieldHelp}>Markdown supported.</p>
          </div>

          {/* checkbox group */}
          <div className={s.field}>
            <span className={s.fieldLabel}>Notifications</span>
            <label className={s.check}>
              <input type="checkbox" defaultChecked />
              <span>Email me when the run finishes</span>
            </label>
            <label className={s.check}>
              <input type="checkbox" />
              <span>Post to Slack channel</span>
            </label>
          </div>

          {/* radio group */}
          <div className={s.field}>
            <span className={s.fieldLabel}>Concurrency</span>
            <label className={s.radio}>
              <input type="radio" name="conc" defaultChecked />
              <span>Run serially (safest)</span>
            </label>
            <label className={s.radio}>
              <input type="radio" name="conc" />
              <span>Parallelize up to 4 agents</span>
            </label>
          </div>

          {/* switch rows */}
          <div className={s.switchRow}>
            <div>
              <div className={s.switchLabel}>Auto-merge clean PRs</div>
              <div className={s.switchHelp}>Merge when checks pass and there are no conflicts.</div>
            </div>
            <Toggle defaultOn />
          </div>
          <div className={s.switchRow}>
            <div>
              <div className={s.switchLabel}>Require human approval</div>
              <div className={s.switchHelp}>Pause before applying destructive changes.</div>
            </div>
            <Toggle />
          </div>

          {/* search field */}
          <div className={s.field}>
            <label className={s.fieldLabel}>Filter repositories</label>
            <div className={s.searchField}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M13 13l-2.6-2.6" /></svg>
              <input className={s.searchInput} placeholder="Search…" />
            </div>
          </div>
        </div>

        <div className={s.formFooter}>
          <button className={`${s.btn} ${s.btnGhost}`}>Cancel</button>
          <button className={`${s.btn} ${s.btnPrimary}`}>Save trigger</button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cards & alerts                                                      */
/* ------------------------------------------------------------------ */

function CardsPanel() {
  return (
    <section className={s.sec}>
      <h2 className={s.secTitle}>Cards &amp; alerts</h2>
      <p className={s.lede}>Hierarchy from surface value, not hue.</p>

      <Section title="Surface ladder">
        <div className={s.cluster}>
          <div className={s.card}>
            <div className={s.cardTitle}>Project</div>
            <div className={s.cardMeta}>background → raised → overlay</div>
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
      </Section>

      <Section title="Stat tiles">
        <div className={s.statRow}>
          <div className={s.statTile}><div className={s.statValue}>1,284</div><div className={s.statLabel}>Runs this week</div></div>
          <div className={s.statTile}><div className={s.statValue} style={{ color: "var(--status-green400)" }}>98.2%</div><div className={s.statLabel}>Success rate</div></div>
          <div className={s.statTile}><div className={s.statValue}>3.4s</div><div className={s.statLabel}>Median latency</div></div>
        </div>
      </Section>

      <Section title="Alerts">
        <div className={s.alert} style={statusStyle("green", 14, 35)}>Agent finished. 3 files changed.</div>
        <div className={s.alert} style={statusStyle("yellow", 14, 35)}>Token budget at 80%.</div>
        <div className={s.alert} style={statusStyle("red", 14, 35)}>Build failed: type error in tokens.ts.</div>
      </Section>

      <Section title="Empty state">
        <div className={s.empty}>
          <div className={s.emptyIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          </div>
          <div className={s.emptyTitle}>No triggers yet</div>
          <div className={s.emptyMeta}>Create your first trigger to run agents on a schedule.</div>
          <button className={`${s.btn} ${s.btnPrimary}`}>New trigger</button>
        </div>
      </Section>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Mini editor (VS Code-style chrome)                                  */
/* ------------------------------------------------------------------ */

function EditorPanel({ tokens }: { tokens: Tokens }) {
  const { color } = tokens;
  return (
    <section className={s.sec}>
      <h2 className={s.secTitle}>Mini editor</h2>
      <p className={s.lede}>Editor chrome + syntax tokens, the way Kilo Code renders inside VS Code.</p>

      <div className={s.editor}>
        {/* activity / file tree */}
        <aside className={s.explorer}>
          <div className={s.explorerHeader}>Explorer</div>
          <div className={s.treeRow}><span className={s.treeChevron}>▾</span> src</div>
          <div className={`${s.treeRow} ${s.treeNested}`}>tokens.ts</div>
          <div className={`${s.treeRow} ${s.treeNested} ${s.treeActive}`}>theme.css <span className={s.treeDot} /></div>
          <div className={`${s.treeRow} ${s.treeNested}`}>index.ts</div>
          <div className={s.treeRow}><span className={s.treeChevron}>▸</span> tests</div>
        </aside>

        {/* editor main */}
        <div className={s.editorMain}>
          <div className={s.editorTabs}>
            <div className={`${s.editorTab} ${s.editorTabActive}`}>theme.css <span className={s.tabClose}>×</span></div>
            <div className={s.editorTab}>tokens.ts <span className={s.tabClose}>×</span></div>
          </div>
          <div className={s.breadcrumb}>src <span className={s.crumbSep}>›</span> theme.css</div>
          <pre className={s.editorCode}>
{lineNo(1)}<span className={s.cCom}>{`/* brand action color */`}</span>{"\n"}
{lineNo(2)}<span className={s.cKey}>:root</span> {"{"}{"\n"}
{lineNo(3)}{"  "}<span className={s.cVar}>--primary</span>: <span className={s.cStr}>{color.brand.primary}</span>;{"\n"}
{lineNo(4)}{"  "}<span className={s.cVar}>--primary-foreground</span>: <span className={s.cStr}>{color.brand.foreground}</span>;{"\n"}
{lineNo(5)}{"  "}<span className={s.cVar}>--radius</span>: <span className={s.cNum}>0.5rem</span>;{"\n"}
{lineNo(6)}{"}"}{"\n"}
{lineNo(7)}{"\n"}
{lineNo(8)}<span className={s.cKey}>export</span> <span className={s.cKey}>const</span> <span className={s.cConst}>PRIMARY</span> = <span className={s.cStr}>&quot;{color.brand.primary}&quot;</span>;{"\n"}
{lineNo(9)}<span className={s.cKey}>function</span> <span className={s.cFn}>resolve</span>(<span className={s.cVar}>token</span>: <span className={s.cType}>Token</span>): <span className={s.cType}>string</span> {"{"}{"\n"}
{lineNo(10)}{"  "}<span className={s.cKey}>return</span> <span className={s.cVar}>token</span>.value ?? <span className={s.cNum}>0</span>;{"\n"}
{lineNo(11)}{"}"}
          </pre>
          <div className={s.statusBar}>
            <span>theme.css</span>
            <span className={s.statusSpacer} />
            <span>CSS</span>
            <span>Ln 3, Col 14</span>
            <span style={{ color: "var(--status-green400)" }}>● tokens synced</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function lineNo(n: number) {
  return <span className={s.gutterNo}>{String(n).padStart(2, " ")}</span>;
}

/* ------------------------------------------------------------------ */
/* Diff                                                                */
/* ------------------------------------------------------------------ */

type DiffLine = { type: "ctx" | "add" | "del" | "hunk"; old?: number; neu?: number; text: string };

const DIFF: DiffLine[] = [
  { type: "hunk", text: "@@ -12,9 +12,11 @@ export const tokens = {" },
  { type: "ctx", old: 12, neu: 12, text: "  color: {" },
  { type: "ctx", old: 13, neu: 13, text: "    brand: {" },
  { type: "del", old: 14, text: '      primary: "#EDFF00",' },
  { type: "del", old: 15, text: '      primaryHover: "#D6E600",' },
  { type: "add", neu: 14, text: '      primary: "#F7F586",' },
  { type: "add", neu: 15, text: '      primaryHover: "#E6E475",' },
  { type: "add", neu: 16, text: '      primaryRing: "#F7F58659",' },
  { type: "ctx", old: 16, neu: 17, text: "    }," },
  { type: "ctx", old: 17, neu: 18, text: "  }," },
  { type: "hunk", text: "@@ -41,6 +42,6 @@ function applyTheme() {" },
  { type: "ctx", old: 41, neu: 42, text: "  const root = document.documentElement;" },
  { type: "del", old: 42, text: "  root.style.setProperty('--primary', '#EDFF00');" },
  { type: "add", neu: 43, text: "  root.style.setProperty('--primary', tokens.color.brand.primary);" },
  { type: "ctx", old: 43, neu: 44, text: "}" },
];

function DiffPanel() {
  return (
    <section className={s.sec}>
      <h2 className={s.secTitle}>Diff</h2>
      <p className={s.lede}>Inline diff with gutter, line numbers and hunk headers — driven by the diff tokens.</p>

      <div className={s.diffCard}>
        <div className={s.diffHeader}>
          <span className={s.diffFile}>src/tokens.ts</span>
          <span className={s.diffStat}><span className={s.diffStatAdd}>+4</span> <span className={s.diffStatDel}>−3</span></span>
        </div>
        <div className={s.diffBody}>
          {DIFF.map((line, i) => (
            <div key={i} className={`${s.diffLine} ${diffClass(line.type)}`}>
              <span className={s.diffNum}>{line.type === "hunk" ? "" : line.old ?? ""}</span>
              <span className={s.diffNum}>{line.type === "hunk" ? "" : line.neu ?? ""}</span>
              <span className={s.diffSign}>{sign(line.type)}</span>
              <span className={s.diffText}>{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function diffClass(t: DiffLine["type"]) {
  if (t === "add") return s.dAdd;
  if (t === "del") return s.dDel;
  if (t === "hunk") return s.dHunk;
  return s.dCtx;
}
function sign(t: DiffLine["type"]) {
  if (t === "add") return "+";
  if (t === "del") return "−";
  return " ";
}

/* ------------------------------------------------------------------ */
/* Chat & tools                                                        */
/* ------------------------------------------------------------------ */

function ToolCard({ icon, title, subtitle, children }: { icon: string; title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div className={s.toolCard}>
      <div className={s.toolHeader}>
        <span className={s.toolIcon} aria-hidden="true">{icon}</span>
        <span className={s.toolTitle}>{title}</span>
        <span className={s.toolSubtitle}>{subtitle}</span>
        <span className={s.toolChevron}>▾</span>
      </div>
      {children && <div className={s.toolBody}>{children}</div>}
    </div>
  );
}

function ChatPanel({ tokens }: { tokens: Tokens }) {
  const { color } = tokens;
  return (
    <section className={s.sec}>
      <h2 className={s.secTitle}>Chat &amp; tools</h2>
      <p className={s.lede}>Agent conversation with tool-call cards and a prompt box — the core Kilo Code surface.</p>

      <div className={s.chatShell}>
        <div className={s.chat}>
          <div className={s.turnUser}>
            <div className={`${s.bubble} ${s.bubbleUser}`}>Migrate the primary color to the new brand yellow and update the theme.</div>
          </div>

          <div className={s.turnAssistant}>
            <div className={s.assistantText}>
              On it. I&apos;ll read the current tokens, edit <code className={s.inlineCode}>tokens.ts</code>, and apply the theme.
            </div>

            <ToolCard icon="◇" title="Read" subtitle="src/tokens.ts" />
            <ToolCard icon="✎" title="Edit" subtitle="src/tokens.ts">
              <pre className={s.toolDiff}>
                <span className={s.dDel}>- primary: &quot;#EDFF00&quot;</span>{"\n"}
                <span className={s.dAdd}>+ primary: &quot;{color.brand.primary}&quot;</span>
              </pre>
            </ToolCard>
            <ToolCard icon="$" title="Shell" subtitle="pnpm build">
              <pre className={s.toolOut}>
                <span style={{ color: "var(--status-green400)" }}>✓</span> Compiled successfully in 968ms
              </pre>
            </ToolCard>

            <div className={s.reasoning}>
              <span className={s.reasoningBar} />
              <span>Verifying the contrast ratio of the new on-primary color…</span>
            </div>

            <div className={s.assistantText}>
              Done — primary is now <code className={s.inlineCode}>{color.brand.primary}</code>.
              <span className={s.diffSummary}><span className={s.diffStatAdd}>+4</span> <span className={s.diffStatDel}>−3</span> · 1 file</span>
            </div>
          </div>

          <div className={s.workingRow}>
            <span className={s.spinner} aria-hidden="true" />
            <span className={s.workingText}>Running tests</span>
            <span className={s.workingElapsed}>0:04</span>
          </div>
        </div>

        <div className={s.promptBox}>
          <textarea className={s.promptInput} rows={2} placeholder="Ask Kilo to make a change…" defaultValue="Now add a regression test for the contrast ratio." />
          <div className={s.promptToolbar}>
            <span className={s.promptHint}>@ file</span>
            <span className={s.promptHint}>/ command</span>
            <span className={s.promptSpacer} />
            <button className={`${s.btn} ${s.btnPrimary}`}>Send</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Surface specimen — live tokens, exercises the full ladder           */
/* ------------------------------------------------------------------ */

const SURFACE_STEPS: { token: string; label: string }[] = [
  { token: "inset", label: "inset" },
  { token: "background", label: "background" },
  { token: "raised", label: "raised" },
  { token: "overlay", label: "overlay" },
  { token: "hover", label: "hover" },
  { token: "selected", label: "selected" },
];

/** A mini app UI driven by the live --surface-* tokens, so it exercises and
 *  reflects every surface token as they're edited in the sidebar. */
function SurfaceSpecimen({ surface }: { surface: Record<string, string> }) {
  return (
    <>
      <div className={s.ramp}>
        {SURFACE_STEPS.filter(({ token }) => surface[token]).map(({ token, label }) => (
          <div key={token} className={s.rampItem}>
            <div className={s.rampChip} style={{ background: `var(--surface-${token})` }} />
            <div className={s.rampLabel}>{label}</div>
            <div className={s.rampHex}>{surface[token]}</div>
          </div>
        ))}
      </div>

      <div className={s.abApp}>
        <div className={s.abTopbar}>
          <span className={s.abDot} /> <span className={s.abTopTitle}>Project console</span>
        </div>
        <div className={s.abBody}>
          <aside className={s.abSidebar}>
            <div className={s.abNavRow}>Overview</div>
            <div className={`${s.abNavRow} ${s.abNavSelected}`}>Agents</div>
            <div className={s.abNavRow}>Logs</div>
            <div className={s.abNavRow}>Settings</div>
          </aside>
          <main className={s.abMain}>
            <div className={s.abCard}>
              <div className={s.abCardTitle}>Trigger</div>
              <div className={s.abInput}>nightly-regression</div>
              <div className={s.abNested}>
                <div className={s.abNestedTitle}>Nested panel</div>
                <div className={s.abRowHover}>Hover row</div>
              </div>
              <pre className={s.abInset}>$ kilo build tokens</pre>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

function SurfacesPanel({ tokens }: { tokens: Tokens }) {
  return (
    <section className={s.sec}>
      <h2 className={s.secTitle}>Surfaces</h2>
      <p className={s.lede}>The surface value ladder, shown on a mini app shell. Edit the surface tokens in the sidebar to see it respond.</p>
      <SurfaceSpecimen surface={tokens.color.surface} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

export function Gallery({ tokens }: { tokens: Tokens }) {
  const [tab, setTab] = useState<TabId>("foundations");

  return (
    <div className={s.surface}>
      <GalleryTabs active={tab} onSelect={setTab} />
      <div className={s.panel} role="tabpanel">
        {tab === "foundations" && <FoundationsPanel tokens={tokens} />}
        {tab === "surfaces" && <SurfacesPanel tokens={tokens} />}
        {tab === "buttons" && <ButtonsPanel tokens={tokens} />}
        {tab === "forms" && <FormsPanel />}
        {tab === "cards" && <CardsPanel />}
        {tab === "editor" && <EditorPanel tokens={tokens} />}
        {tab === "diff" && <DiffPanel />}
        {tab === "chat" && <ChatPanel tokens={tokens} />}
      </div>
    </div>
  );
}
