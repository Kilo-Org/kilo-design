import { ShieldAlert } from "lucide-react";
import type { ScreenMeta } from "../../../registry";
import { DesktopWindow } from "../DesktopWindow";
import { SessionCanvas } from "../SessionCanvas";

export const meta: ScreenMeta = { title: "Permission request", order: 2 };

export default function Permission() {
  return (
    <DesktopWindow session>
      <SessionCanvas
        bottom={
          <div className="d-perm" style={{ flexDirection: "column" }}>
            <div className="top"><ShieldAlert className="s14" />Permission request<span className="d-badge-outline">bash</span></div>
            <div><h3>Allow bash?</h3><p>The agent is requesting permission to use bash.</p></div>
            <div className="pat">pnpm vitest run apps/desktop/src/main/platform/SplashWindow</div>
            <div className="acts"><span className="d-btn ghost">Reject</span><span className="grow" /><span className="d-btn outline">Always allow</span><span className="d-btn primary">Allow once</span></div>
          </div>
        }
      />
    </DesktopWindow>
  );
}
