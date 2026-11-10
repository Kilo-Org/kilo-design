import { ChevronDown, ChevronRight, Circle, CircleAlert, Clock, History, Plus, Search, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import type { ScreenMeta } from "../../../registry";
import { Phone, TabBar } from "../Phone";

export const meta: ScreenMeta = { title: "Agents", order: 2, source: "kilo-cloud/apps/mobile agents" };

const live = <Circle className="s3" fill="currentColor" style={{ color: "var(--m-good)" }} />;

const ROWS: { hue: string; dim?: boolean; repo: string; status: ReactNode; warn?: boolean; title: string; sub: string }[] = [
  { hue: "--h-cloud", repo: "kilo-cloud", warn: true, status: <><CircleAlert className="s3" />Needs input</>, title: "Fix terminal ANSI palette", sub: "fix/ansi-palette · #771" },
  { hue: "--h-yuki", repo: "kilo-desktop", status: <>{live}$0.84 · 2M AGO</>, title: "Single Kilo yellow across themes", sub: "yacu/single-yellow · #765" },
  { hue: "--h-sky", repo: "kilo-design", status: <>{live}$0.12 · JUST NOW</>, title: "Accent strategy explorer", sub: "main" },
  { hue: "--h-kilo", dim: true, repo: "kilo-desktop", status: <><Clock className="s3" style={{ color: "var(--m-muted-soft)" }} />Scheduled · 9:00 AM</>, title: "Nightly dependency bumps", sub: "chore/deps" },
  { hue: "--h-coral", dim: true, repo: "kilo-cloud", status: <><Circle className="s3" style={{ color: "var(--m-muted-soft)" }} />$0.33 · 2D AGO</>, title: "Cloud usage chart tooltip", sub: "feat/usage-tooltip · #2381" },
];

export default function Agents() {
  return (
    <Phone>
      <div className="m-agh"><h2>Agents</h2><span className="m-ctxc">Personal<ChevronDown className="s14" /></span><span className="m-ib"><History className="s20" /></span></div>
      <div className="m-tabrow"><span className="on">Sessions</span><span>To-dos</span><span style={{ flex: 1 }}></span><span className="m-ib"><Search className="s20" /></span><span className="m-filter"><SlidersHorizontal className="s20" /><b>1</b></span></div>
      {ROWS.map((r) => (
        <div className="m-row" key={r.title}>
          <span className="strip" style={{ background: `var(${r.hue})`, opacity: r.dim ? 0.3 : undefined }}></span>
          <div className="bd">
            <div className="eb">
              <span className="rp" style={{ color: r.dim ? "var(--m-muted)" : `var(${r.hue})` }}>{r.repo}</span>
              <span className="mt" style={r.warn ? { color: "var(--m-warn)" } : undefined}>{r.status}</span>
            </div>
            <div className="ti">{r.title}</div>
            <div className="su">{r.sub}</div>
          </div>
          <ChevronRight className="s14" />
        </div>
      ))}
      <div className="m-fab"><Plus className="s24" /></div>
      <TabBar active="Agents" />
    </Phone>
  );
}
