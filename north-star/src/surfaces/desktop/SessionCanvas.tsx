import type { ReactNode } from "react";
import {
  ArrowDownToLine, ArrowUp, BookOpen, Bot, Check, ChevronDown, ChevronRight, FilePen, Folder,
  GitBranch, GitCompare, ListCollapse, LoaderCircle, SquareTerminal, Terminal,
} from "lucide-react";

/** Pane canvas of an open session: agent thread on the left, Changes + Terminal on the right. `bottom` replaces the composer slot. */
export function SessionCanvas({ bottom }: { bottom: ReactNode }) {
  return (
    <div className="d-canvas">
      <div className="d-col">
        <div className="d-island pane-edge focus">
          <div className="d-tabs"><div className="d-tab on"><Bot className="s14" /><span>Agent</span></div><div className="d-tab"><Bot className="s14" /><span>Agent 2</span></div></div>
          <div className="d-div"></div>
          <div className="d-body" style={{ background: "var(--card)" }}>
            <div className="d-thread"><div className="d-col-inner">
              <div className="d-worked"><ChevronRight className="s14" />Worked for 48s</div>
              <div className="d-umsg">Use a single #ffdd00 Kilo yellow in both light and dark themes. Update the splash window and its tests.</div>
              <div className="d-amsg">I'll change the theme contract first, then collapse the splash logo to one constant.</div>
              <div className="d-act">
                <div className="trig"><span className="stack"><span className="c-sky"><BookOpen className="s3" /></span><span className="c-amber"><FilePen className="s3" /></span></span><span className="lab">Edited <em>3 files</em></span><ChevronDown className="s14" /></div>
                <div className="d-rail">
                  <div className="r"><Check className="s3" /><b>Read</b> app-themes.ts<span className="dots" /><ChevronRight className="s3" /></div>
                  <div className="r"><Check className="s3" /><b>Edited</b> app-themes.ts<span className="plus">+3</span><span className="minus">-3</span><span className="dots" /><ChevronRight className="s3" /></div>
                  <div className="r"><Check className="s3" /><b>Edited</b> SplashWindow.ts<span className="plus">+1</span><span className="minus">-3</span><span className="dots" /><ChevronRight className="s3" /></div>
                </div>
              </div>
              <div className="d-amsg">Splash now reads <code>KILO_LOGO_YELLOW</code> in both modes. Light mode keeps gray for small marks, since the yellow is about 1.35:1 on white. See the <a>contrast note in app-themes.ts</a>.</div>
              <div className="d-runhead">Working for 12s</div>
              <div className="d-act"><div className="trig"><span className="stack"><span className="c-zinc"><Terminal className="s3" /></span></span><span className="lab">Running <em>pnpm vitest run SplashWindow</em></span></div></div>
              <div className="d-working"><span className="pix">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span><span className="shimmer">Considering next steps</span></div>
            </div></div>
            <div className="d-bottom"><div className="d-bottom-in">
              <div className="d-tasks">
                <div className="hd">Tasks <span className="c">2/4 Completed</span><ChevronDown className="s14" /></div>
                <div className="it done"><span className="d-tbox done"><Check /></span>Update theme contract and tests</div>
                <div className="it done"><span className="d-tbox done"><Check /></span>Collapse splash logo to one constant</div>
                <div className="it"><LoaderCircle className="s3 spin" style={{ color: "var(--ink)", margin: "0 1px" }} />Run SplashWindow tests</div>
                <div className="it pend"><span className="d-tbox" />Regenerate icon.icns and volume icon</div>
              </div>
              {bottom}
              <div className="d-foot"><span><Folder className="s3" />Local</span><span><GitBranch className="s3" />yacu/single-yellow</span><span className="grow" /><span><ArrowUp className="s3" />48.2k</span><span><ArrowDownToLine className="s3" />6.1k</span><span>$0.84</span></div>
            </div></div>
          </div>
        </div>
      </div>
      <div className="d-col">
        <div className="d-island pane-edge" style={{ flex: 1.5 }}>
          <div className="d-tabs"><div className="d-tab shown"><GitCompare className="s14" /><span>Changes</span></div></div>
          <div className="d-div"></div>
          <div className="d-body">
            <div className="d-ph">Changes <span className="plus">+9</span><span className="minus">−11</span><span className="grow" /><span className="d-btn ghost mut icon-xs"><ListCollapse className="s14" /></span></div>
            <div className="d-file"><ChevronDown className="s3" style={{ color: "var(--muted)" }} /><span className="p">SplashWindow.ts <span>apps/desktop/src/main/platform</span></span><span className="plus">+1</span><span className="minus">-3</span></div>
            <div className="diff">
              <span className="ln"><span className="n">14</span><span className="s"> </span><span className="kw">const</span> <span className="ty">SPLASH_WIDTH</span> = <span className="nu">320</span>;</span>
              <span className="ln d"><span className="n">16</span><span className="s">−</span><span className="kw">const</span> <span className="ty">KILO_LOGO_LIGHT</span> = <span className="st">"#f0f042"</span>;</span>
              <span className="ln d"><span className="n">17</span><span className="s">−</span><span className="kw">const</span> <span className="ty">KILO_LOGO_DARK</span> = <span className="st">"#f7f586"</span>;</span>
              <span className="ln a"><span className="n">16</span><span className="s">+</span><span className="kw">const</span> <span className="ty">KILO_LOGO_YELLOW</span> = <span className="st">"#ffdd00"</span>;</span>
              <span className="ln"><span className="n">17</span><span className="s"> </span></span>
              <span className="ln"><span className="n">18</span><span className="s"> </span><span className="kw">export function</span> <span className="fn">resolveSplashTheme</span>(</span>
            </div>
            <div className="d-file"><ChevronDown className="s3" style={{ color: "var(--muted)" }} /><span className="p">app-themes.ts <span>packages/ui/src/themes</span></span><span className="plus">+3</span><span className="minus">-3</span></div>
            <div className="diff">
              <span className="ln d"><span className="n">288</span><span className="s">−</span>{"  "}<span className="pr">primary</span>: <span className="st">"#f1f200"</span>,</span>
              <span className="ln a"><span className="n">288</span><span className="s">+</span>{"  "}<span className="pr">primary</span>: <span className="st">"#ffdd00"</span>,</span>
              <span className="ln"><span className="n">289</span><span className="s"> </span>{"  "}<span className="pr">primaryForeground</span>: <span className="st">"#1f1f1f"</span>,</span>
            </div>
            <div className="d-file"><ChevronRight className="s3" style={{ color: "var(--muted)" }} /><span className="p">SplashWindow.test.ts <span>apps/desktop/src/main/platform</span></span><span className="plus">+5</span><span className="minus">-5</span></div>
          </div>
        </div>
        <div className="d-island pane-edge">
          <div className="d-tabs"><div className="d-tab shown"><SquareTerminal className="s14" /><span>Terminal</span></div></div>
          <div className="d-div"></div>
          <div className="d-body"><div className="term">
            <span className="m">~/kilo-desktop</span> <span className="b">pnpm vitest run SplashWindow</span>{"\n "}
            <span className="g">✓</span> resolveSplashTheme <span className="m">(4)</span>{"\n "}
            <span className="g">✓</span> SplashWindow <span className="m">(6)</span>{"\n "}
            <span className="y">▲ icon.icns is 841 KB, budget 512 KB</span>{"\n "}
            <span className="b">Tests</span>{"  "}<span className="g">10 passed</span> <span className="m">(10)</span>{"  "}<span className="m">812ms</span>
          </div></div>
        </div>
      </div>
    </div>
  );
}
