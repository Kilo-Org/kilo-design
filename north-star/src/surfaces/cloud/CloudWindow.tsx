import type { ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, Bot, Building2, Cable, ChartColumnIncreasing, ChevronDown, ChevronsUpDown,
  Cloud, Coins, CreditCard, Key, List, Lock, PanelLeft, PanelRight, RotateCw, Shield, User, Webhook,
  type LucideIcon,
} from "lucide-react";

const NAV: [group: string, items: [LucideIcon, string][]][] = [
  ["Dashboard", [[User, "Your Profile"], [Building2, "Organizations"], [ChartColumnIncreasing, "Usage"]]],
  ["Cloud", [[Cloud, "Cloud Agent"], [List, "Sessions"], [Webhook, "Webhooks / Triggers"], [Bot, "Code Reviewer"], [Shield, "Security Agent"]]],
  ["Account", [[CreditCard, "Subscriptions"], [Cable, "Integrations"], [Coins, "Credits"], [Key, "Bring Your Own Key (BYOK)"]]],
];

/** Browser chrome + app.kilo.ai sidebar + top bar. `active` is the sidebar label to highlight. */
export function CloudWindow({ path, active, title, actions, children }: { path: string; active: string; title: ReactNode; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="win cloud" style={{ inset: 0 }}>
      <div className="c-chrome">
        <div className="lights"><i></i><i></i><i></i></div><ArrowLeft className="s14" /><ArrowRight className="s14" style={{ opacity: 0.4 }} /><RotateCw className="s14" />
        <div className="c-url"><Lock className="s3" />app.kilo.ai<span>{path}</span></div><PanelRight className="s14" />
      </div>
      <div className="c-app">
        <aside className="c-side">
          <div className="c-side-h">
            <div className="c-logo"><svg width="48" height="48" viewBox="0 0 100 100" fill="currentColor"><use href="#kpath" /></svg><b>Kilo</b></div>
            <div className="c-org"><div><b>Personal</b><small>Personal Workspace</small></div><ChevronDown className="s14" /></div>
          </div>
          <nav className="c-nav">
            {NAV.map(([group, items]) => (
              <div key={group}>
                <div className="c-gl">{group}</div>
                {items.map(([Icon, label]) => (
                  <div key={label} className={label === active ? "c-mi on" : "c-mi"}><Icon />{label}</div>
                ))}
              </div>
            ))}
          </nav>
          <div className="c-promo"><b>Up to 50% Free AI Credits</b><p>Maximize your AI output per dollar with Kilo Pass</p><span className="c-btn primary sm" style={{ width: "100%" }}>Get Kilo Pass</span></div>
          <div className="c-user"><span className="av">YC</span><div><b>Yacu</b><small>yacu@kilocode.ai</small></div><ChevronsUpDown className="s14" /></div>
        </aside>
        <div className="c-inset">
          <header className="c-top">
            <span className="trig"><PanelLeft /></span>
            <span className="ttl">{title}</span>
            {actions && <span className="act">{actions}</span>}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
