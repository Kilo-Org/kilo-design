import { CalendarDays, ChevronRight, CircleAlert, CircleCheck, Coins, ExternalLink } from "lucide-react";
import type { ScreenMeta } from "../../../registry";
import { CloudWindow } from "../CloudWindow";

export const meta: ScreenMeta = { title: "Credits", order: 2, source: "kilo-cloud/apps/web credits" };

const PURCHASES = [
  ["Nov 2, 2026", "Top up", "$50.00"],
  ["Oct 14, 2026", "Purchase", "$100.00"],
];

export default function Credits() {
  return (
    <CloudWindow path="/credits" active="Credits" title="Credits">
      <div className="c-page">
        <div className="c-cont">
          <div className="c-sub"><p>Buy credits, view your balance, and manage auto top-up.</p><span className="c-link">Manage subscriptions <ChevronRight className="s14" /></span></div>
          <div className="c-banner"><CircleAlert className="s18" /><span className="grow"><b>Payment is still processing</b></span></div>
          <div className="c-card"><div className="h"><h4>Your credit balance</h4></div><div className="b"><div className="c-bal">
            <div className="it"><span className="big">$8.60</span><span className="lab">available</span></div><span className="div" />
            <div className="it"><b><CircleCheck className="s14" style={{ color: "var(--c-success)" }} />Purchased credits</b><span className="lab">Never expire unless purchased with an expiry</span></div><span className="div" />
            <div className="it"><b><CalendarDays className="s14" />Next credit expiry</b><span className="lab">None scheduled</span></div>
          </div></div></div>
          <div className="c-card"><div className="h"><h4><Coins className="s18" />Buy Credits</h4></div><div className="b"><div className="c-amts"><span className="c-btn outline">$20</span><span className="c-btn outline">$50</span><span className="c-btn outline">$100</span><span className="c-btn outline">Custom</span></div></div></div>
          <div className="c-card"><div className="h"><h4><Coins className="s18" />Automatic Top Up</h4><p>Automatically add credits when your balance falls below $5.</p></div><div className="b"><div className="c-row2"><span className="c-sw" /><span>Enabled</span><span style={{ flex: 1 }}></span><span className="c-btn outline">Configure automatic top-up</span></div></div></div>
          <div className="c-card" style={{ overflow: "hidden" }}>
            <div className="h"><h4>Credit purchase history</h4><p>Completed personal credit purchases and invoices.</p></div>
            <table className="c-tbl">
              <thead><tr><th>Purchase Date</th><th>Type</th><th>Credits Added</th><th>Expires</th><th>Invoice</th></tr></thead>
              <tbody>
                {PURCHASES.map(([date, type, amount]) => (
                  <tr key={date}><td>{date}</td><td>{type}</td><td className="mono">{amount}</td><td>Never</td><td><span className="c-link">View invoice <ExternalLink className="s3" /></span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CloudWindow>
  );
}
