import {
  ChevronRight, ChevronsUpDown, Ellipsis, FileDiff, FileText, FolderPlus, GitBranch, GitCompare, LoaderCircle,
  MessageSquare, Paperclip, Plus, Search, Send, Settings, SlidersHorizontal, SquarePen, Terminal, Volume2,
} from "lucide-react";
import type { ScreenMeta } from "../../../registry";
import { CloudWindow } from "../CloudWindow";

export const meta: ScreenMeta = { title: "Cloud Agent", order: 1, source: "kilo-cloud/apps/web CloudChatPage" };

export default function Agent() {
  return (
    <CloudWindow
      path="/cloud/chat"
      active="Cloud Agent"
      title={<>Review #765 kilo-ui yellow <span className="c-btn ghost sm" style={{ height: 28, color: "var(--c-muted)" }}>Cost <span className="mono" style={{ color: "var(--c-fg)" }}>$0.84</span></span></>}
      actions={<span className="c-ibtn"><Settings className="s14" /></span>}
    >
      <div className="c-agent">
        <div className="c-sess">
          <div className="hd"><span><SquarePen className="s14" /></span><span><FolderPlus className="s14" /></span><span className="r"><Search className="s14" /></span><span><SlidersHorizontal className="s14" /></span></div>
          <div className="list">
            <div className="gh">Today</div>
            <div className="c-srow on"><span className="t">Review #765 kilo-ui yellow</span><span className="tm">2m</span></div>
            <div className="c-srow"><span className="t">Triage #db-alerts</span><LoaderCircle className="s14 spin" style={{ color: "var(--c-live)" }} /></div>
            <div className="c-srow"><span className="t">Fix flaky notebook kernel test</span><span className="tm">3h</span></div>
            <div className="gh">Yesterday</div>
            <div className="c-srow"><span className="t">Cloud usage chart tooltip</span><span className="c-ping" /></div>
            <div className="c-srow"><span className="t">Bump koffi to 3.3.3</span><span className="tm">1d</span></div>
            <div className="gh">Monday</div>
            <div className="c-srow"><span className="t">Migrate oxfmt config</span><span className="tm">2d</span></div>
            <div className="c-srow"><span className="t">kilo run --fix lint</span><span className="tm">2d</span></div>
            <div className="gh">Older</div>
            <div className="c-srow"><span className="t">Security agent: lockfile audit</span><span className="tm">Nov 2</span></div>
          </div>
        </div>
        <div className="c-chat">
          <div className="c-tabs">
            <span className="c-tab on"><MessageSquare className="s14" /><span>Review #765 and check light…</span></span>
            <span className="c-tab"><Terminal className="s14" /><span>Terminal</span><i style={{ width: 6, height: 6, borderRadius: 9, background: "var(--c-success)" }}></i></span>
            <span className="c-tab"><FileDiff className="s14" /><span>SplashWindow.test.ts</span></span>
            <span className="c-ibtn"><Plus className="s14" /></span>
            <span className="grow" />
            <span className="c-btn ghost sm" style={{ height: 28 }}><GitCompare className="s14" /><span className="mono" style={{ color: "var(--c-success)" }}>+9</span><span className="mono" style={{ color: "#f87171" }}>−11</span></span>
            <span className="c-status"><i></i>Sandbox</span>
            <span className="c-ibtn"><Volume2 className="s14" /></span>
            <span className="c-ibtn"><Ellipsis className="s14" /></span>
          </div>
          <div className="c-msgs">
            <div className="c-umsg">Review #765 and check light theme contrast for the new yellow.</div>
            <div className="c-amsg">Cloned <code>Kilo-Org/kilo-desktop</code> on <code>yacu/single-yellow</code>. Reading the diff.</div>
            <div className="c-tool"><FileText className="s14" />Read · <code>packages/contracts/src/features/app-themes.ts</code><ChevronRight className="s14 cv" /></div>
            <div className="c-tool"><Search className="s14" />Searched · <code>"#f7f586"</code><ChevronRight className="s14 cv" /></div>
            <div className="c-tool"><Terminal className="s14" />Ran · <code>pnpm vitest run app-themes</code><ChevronRight className="s14 cv" /></div>
            <div className="c-amsg">Two findings. <code>#ffdd00</code> is 1.35:1 on white, so light-mode primary buttons lose their edge. And one splash test still expects the old light logo color.</div>
            <div className="c-umsg">Fix the test and leave a review note on the contrast.</div>
            <div className="c-work"><LoaderCircle className="s14 spin" />Making edits</div>
          </div>
          <div className="c-inputw">
            <div className="c-input">
              <div className="ta">Ask anything…</div>
              <div className="tb"><span className="c-combo">Code<ChevronsUpDown className="s14" /></span><span className="c-combo">Sonnet 5<ChevronsUpDown className="s14" /></span><span className="grow" /><span className="c-ibtn"><Paperclip className="s14" /></span><span className="c-send"><Send className="s14" /></span></div>
            </div>
            <div className="c-meta"><GitBranch className="s14" />Kilo-Org/kilo-desktop · yacu/single-yellow<span className="grow" />38% context</div>
          </div>
        </div>
      </div>
    </CloudWindow>
  );
}
