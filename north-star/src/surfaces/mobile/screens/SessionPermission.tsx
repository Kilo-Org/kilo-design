import { Brain, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import type { ScreenMeta } from "../../../registry";
import { Phone } from "../Phone";

export const meta: ScreenMeta = { title: "Session · permission", order: 4 };

export default function SessionPermission() {
  return (
    <Phone>
      <div className="m-chead"><span className="bk"><ChevronLeft className="s24" /></span><h3>Fix terminal ANSI pal…</h3><span className="m-ctxp"><span className="rg" /><b>18%</b><span>$0.21</span></span></div>
      <div className="m-trans">
        <div className="m-time">Today 9:12</div>
        <div className="m-ub">The terminal yellow is unreadable on light. Fix the palette.</div>
        <div className="m-tool dash"><Brain className="s14" /><span className="eyebrow" style={{ fontSize: 10 }}>Thought</span><ChevronRight className="s14 cv" /></div>
        <div className="m-tool"><Pencil className="s14" />app-themes.ts<ChevronRight className="s14 cv" /></div>
        <div className="m-ab">ANSI yellow now uses <code>#d28100</code> in light. I'll run the terminal tests next.</div>
      </div>
      <div className="m-perm">
        <div className="h"><b>Permission required</b><p>The agent is waiting for permission. While this request is open, your message to the agent is paused.</p></div>
        <div className="bd">Allow bash?<div className="ap">Applies to:<br />• pnpm test --filter terminal</div></div>
        <div className="f"><span className="o">Deny</span><span className="s">Allow Once</span><span className="p">Always Allow</span></div>
      </div>
    </Phone>
  );
}
