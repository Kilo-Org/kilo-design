import { ChevronDown, Earth, Files, Folder, GitBranch, Laptop, Notebook, SquareTerminal } from "lucide-react";
import type { ScreenMeta } from "../../../registry";
import { ComposerRow, DesktopWindow } from "../DesktopWindow";

export const meta: ScreenMeta = { title: "New session", order: 3 };

export default function NewSession() {
  return (
    <DesktopWindow session={false}>
      <div className="d-card pane-edge">
        <div className="d-launch">
          <svg className="logo" viewBox="0 0 100 100" fill="currentColor"><use href="#kpath" /></svg>
          <h1>What should we work on in kilo-desktop?</h1>
          <div className="d-starter">
            <div className="in">Send a message, @ to mention files, or / for commands…</div>
            <ComposerRow />
          </div>
          <div className="d-loc">
            <span className="p"><small>Workspace</small><Folder className="s14" style={{ color: "#60a5fa" }} />kilo-desktop<ChevronDown className="s14 cv" /></span>
            <span className="p"><small>Use</small><Laptop className="s14" />Current checkout<ChevronDown className="s14 cv" /></span>
            <span className="p"><small>Branch</small><GitBranch className="s14" />main<ChevronDown className="s14 cv" /></span>
          </div>
          <div className="d-tiles"><span><SquareTerminal className="s14" />Terminal</span><span><Notebook className="s14" />Notebook</span><span><Earth className="s14" />Browser</span><span><Files className="s14" />Files</span></div>
        </div>
      </div>
    </DesktopWindow>
  );
}
