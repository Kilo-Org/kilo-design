import type { CSSProperties } from "react";
import { Camera, ChevronDown, ChevronRight, Circle, CircleAlert, Clock, GitPullRequest, ListTodo, Play, Plus } from "lucide-react";
import type { ScreenMeta } from "../../../registry";
import { Phone, TabBar } from "../Phone";

export const meta: ScreenMeta = { title: "Home", order: 1, source: "kilo-cloud/apps/mobile home" };

export default function Home() {
  return (
    <Phone>
      <div className="m-homeh"><svg width="40" height="40" viewBox="0 0 100 100" style={{ borderRadius: 9 }}><rect width="100" height="100" fill="#FFDD00" /><use href="#kpath" fill="#1F1F1F" /></svg><span className="m-ctxc">Personal<ChevronDown className="s14" /></span></div>
      <div className="m-sec"><span className="eyebrow">Live now</span><span className="seeall">See all</span></div>
      <div className="m-glance">
        <div className="cnt">
          <div className="r"><CircleAlert className="s3" style={{ color: "var(--m-warn)" }} /><b>1</b><span className="on">Needs input</span></div>
          <div className="r"><Circle className="s3" fill="currentColor" style={{ color: "var(--m-good)" }} /><b>2</b><span>Working</span></div>
          <div className="r"><Clock className="s3" style={{ color: "var(--m-muted-soft)" }} /><b>1</b><span>Scheduled</span><small>9:00 AM</small></div>
          <div className="r"><Circle className="s3" style={{ color: "var(--m-muted-soft)" }} /><b>4</b><span>Idle</span></div>
        </div>
        <div className="newest"><div className="t">Single Kilo yellow across themes</div><div className="m"><Circle className="s3" fill="currentColor" style={{ color: "var(--m-good)" }} /><span>Working</span><small>2m</small></div></div>
      </div>
      <div className="m-sec"><span className="eyebrow">Up next</span></div>
      <div className="m-todo"><span className="tl"><ListTodo className="s14" /></span><div className="bd"><b>Audit tokens.json drift</b><small>Design</small></div><span className="pl"><Play className="s14" /></span></div>
      <div style={{ height: 8 }}></div>
      <div className="m-btn primary"><Plus className="s18" />New coding task</div>
      <div className="m-btn secondary"><Camera className="s18" />New task from a picture</div>
      <div className="m-sec" style={{ paddingTop: 12 }}><span className="eyebrow">Explore</span></div>
      <div className="m-cfg">
        <div className="r"><span className="m-tile" style={{ "--h": "var(--h-honey)" } as CSSProperties}><GitPullRequest className="s14" /></span><div><b>Code Reviewer</b><small>Automatic PR reviews</small></div><ChevronRight className="s14" /></div>
      </div>
      <TabBar active="Home" />
    </Phone>
  );
}
