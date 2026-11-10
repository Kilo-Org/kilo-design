import type { ReactNode } from "react";
import { Bot, House, MessageCircle, MessageSquare, UserRound, Wifi, type LucideIcon } from "lucide-react";

/** iPhone frame (393 × 852) with Dynamic Island, status bar and home indicator. */
export function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="ios phone">
      <div className="scr">
        <div className="island"></div>
        <div className="sb"><span>9:41</span><span className="r"><Wifi className="s18" /><span className="bat" /></span></div>
        {children}
        <div className="home-ind"></div>
      </div>
    </div>
  );
}

const TABS: [LucideIcon, string, badge?: number][] = [
  [House, "Home"], [MessageSquare, "KiloClaw"], [Bot, "Agents", 1], [MessageCircle, "Chat"], [UserRound, "Profile"],
];

export function TabBar({ active }: { active: string }) {
  return (
    <div className="m-tabbar">
      {TABS.map(([Icon, label, badge]) => {
        const icon = <Icon className="s22" strokeWidth={label === active ? 2 : 1.5} />;
        return (
          <div key={label} className={label === active ? "m-tbi on" : "m-tbi"}>
            {badge ? <span className="ib">{icon}<b>{badge}</b></span> : icon}
            {label}
          </div>
        );
      })}
    </div>
  );
}
