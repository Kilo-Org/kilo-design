import { ArrowUp, Bell, ChevronDown, ChevronLeft, ChevronRight, CircleDot, Code, Eye, GitPullRequest, LoaderCircle, Paperclip, Pencil } from "lucide-react";
import type { ScreenMeta } from "../../../registry";
import { Phone } from "../Phone";

export const meta: ScreenMeta = { title: "Session", order: 3, source: "kilo-cloud/apps/mobile agent-chat" };

export default function Session() {
  return (
    <Phone>
      <div className="m-chead"><span className="bk"><ChevronLeft className="s24" /></span><h3>Single Kilo yellow across themes</h3><span className="m-ib"><Bell className="s20" /></span><span className="m-ctxp"><span className="rg" /><b>42%</b><span>$0.84</span></span></div>
      <div className="m-goal"><span className="m-prb"><GitPullRequest className="s3" />#765</span><CircleDot className="s14" style={{ color: "var(--m-ink)" }} /><div><div className="st">Active goal</div><div className="tx">Ship one #ffdd00 across light and dark</div></div></div>
      <div className="m-trans">
        <div className="m-time">Today 9:38</div>
        <div className="m-ub">Use one yellow in both themes and update the splash tests.</div>
        <div className="m-ab">On it. Changing the theme contract first, then the splash window.</div>
        <div className="m-tool"><Eye className="s14" />app-themes.ts<span style={{ fontSize: 11 }}>L270, 80 lines</span><ChevronRight className="s14 cv" /></div>
        <div className="m-tool"><Pencil className="s14" />SplashWindow.ts<ChevronRight className="s14 cv" /></div>
        <div className="m-ab">Splash now reads <code>KILO_LOGO_YELLOW</code> in both modes.</div>
        <div className="m-wk"><LoaderCircle className="s14 spin" />Running commands · 12s</div>
      </div>
      <div className="m-composer">
        <div className="m-chips"><span className="m-chip"><Code className="s14" />Code<ChevronDown className="s14" /></span><span className="m-chip">Opus 5.5<ChevronDown className="s14" /></span></div>
        <div className="m-inrow"><span className="m-clip"><Paperclip className="s18" /></span><span className="m-in">Message</span><span className="m-send"><ArrowUp className="s18" strokeWidth={2.5} /></span></div>
      </div>
    </Phone>
  );
}
