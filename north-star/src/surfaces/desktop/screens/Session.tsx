import type { ScreenMeta } from "../../../registry";
import { ComposerRow, DesktopWindow } from "../DesktopWindow";
import { SessionCanvas } from "../SessionCanvas";

export const meta: ScreenMeta = { title: "Session", order: 1, source: "kilo-desktop thread.tsx, session-list-content.tsx" };

export default function Session() {
  return (
    <DesktopWindow session>
      <SessionCanvas
        bottom={
          <div className="d-composer" style={{ flexDirection: "column" }}>
            <div className="in">Send a message, @ to mention files, or / for commands…</div>
            <ComposerRow modelIcon />
          </div>
        }
      />
    </DesktopWindow>
  );
}
