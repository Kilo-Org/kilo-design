import type { ReactNode } from "react";
import {
  Archive, ArrowUp, Bot, ChevronDown, ChevronRight, CircleAlert, Files, Folder, GalleryHorizontal,
  GitCommitHorizontal, GitPullRequest, Hammer, Hand, LayoutGrid, ListFilter, LoaderCircle,
  MessageCircleQuestion, MessageSquare, PanelLeft, Plus, RotateCw, Search, Settings,
} from "lucide-react";

/** App window: sidebar + header. `session` adds the breadcrumb and git actions of an open session. */
export function DesktopWindow({ session, children }: { session: boolean; children: ReactNode }) {
  return (
    <div className="win desk" style={{ inset: 0 }}>
      <aside className="d-side">
        <div className="d-side-h"><div className="lights"><i></i><i></i><i></i></div></div>
        <div className="d-cluster"><span className="d-btn ghost mut icon-sm"><PanelLeft className="s14" /></span><span className="d-badge-soft">Beta</span></div>
        <div className="d-side-c">
          <div className="d-actions">
            <div className="d-mi"><MessageSquare className="s14" />New session</div>
            <div className="d-mi"><Search className="s14" />Search</div>
          </div>
          <div className="d-grouprow"><div className="d-wsf"><LayoutGrid className="s14" />All workspaces<ChevronDown className="s14 cv" /></div><span className="d-btn ghost mut icon-xs"><ListFilter className="s14" /></span></div>
          <div className="d-shelf warn">Needs attention</div>
          <div className="d-row"><div className="t"><span className="g" style={{ color: "var(--warn)" }}><CircleAlert className="s14" /></span><span className="ti">Fix terminal ANSI palette</span></div></div>
          <div className="d-row"><div className="t"><span className="g" style={{ color: "var(--warn)" }}><MessageCircleQuestion className="s14" /></span><span className="ti">Pick a token migration path</span></div></div>
          <div className="d-shelf">Pinned</div>
          <div className="d-row"><div className="t"><span className="g"><span className="d-done" /></span><span className="ti">Design tokens v0.3</span><span className="tr"><GitPullRequest className="s3" />#742</span></div></div>
          <div className="d-shelf">Active</div>
          <div className="d-row on"><div className="t"><span className="g" style={{ color: "var(--live)" }}><LoaderCircle className="s14 spin" /></span><span className="ti">Single Kilo yellow</span><span className="tr"><GitPullRequest className="s3" />#765</span></div></div>
          <div className="d-row"><div className="t"><span className="g" style={{ color: "var(--live)", opacity: 0.75 }}><LoaderCircle className="s14 spin" /></span><span className="ti">Native app menu from contributions</span></div></div>
          <div className="d-row"><div className="t"><span className="g"><span className="d-done" /></span><span className="ti">Bump koffi to 3.3.3</span><span className="tr"><GitPullRequest className="s3" />#608</span></div></div>
          <div className="d-row"><div className="t"><span className="g" /><span className="ti">Update oxfmt to 0.72.0</span></div></div>
          <div className="d-row"><div className="t"><span className="g" /><span className="ti">Notebook kernel restart flake</span></div></div>
          <div className="d-row"><div className="t"><span className="g"><span className="d-done" /></span><span className="ti">Local models list empty state</span></div></div>
          <div className="d-shelf"><Archive className="s14" />Archived<ChevronRight className="s3" style={{ opacity: 0.6 }} /></div>
        </div>
        <div className="d-side-f">
          <div className="d-upd"><RotateCw className="s14" />Restart to update</div>
          <div className="d-acctrow"><div className="d-acct"><span className="d-av">YC</span>Yacu</div><span className="d-btn ghost mut icon"><Settings className="s14" /></span></div>
        </div>
      </aside>

      <main className="d-inset">
        <header className="d-head">
          {session && <div className="d-crumb"><span className="ws"><Folder className="s14" style={{ color: "#60a5fa" }} />kilo-desktop</span><ChevronRight className="s3 sep" /><span className="ti">Single Kilo yellow across themes</span></div>}
          <span className="grow" />
          {session && (
            <>
              <div className="d-git">
                <span className="d-btn ghost sm"><Files className="s14" style={{ color: "var(--muted)" }} /><span style={{ color: "var(--muted)" }}>3</span><span className="plus">+9</span><span className="minus">-11</span></span>
                <span className="split"><span className="d-btn ghost sm"><GitCommitHorizontal className="s14" />Commit &amp; push</span><span className="d-btn ghost icon-sm"><ChevronDown className="s14" /></span></span>
              </div>
              <span className="d-btn ghost icon-sm"><Plus className="s14" /></span>
              <span className="d-btn ghost icon-sm"><Bot className="s14" /></span>
              <span className="d-btn ghost icon-sm"><GalleryHorizontal className="s14" /></span>
            </>
          )}
        </header>
        {children}
      </main>
    </div>
  );
}

/** Agent picker, model picker, approval mode, send. Shared by the session composer and the launcher. */
export function ComposerRow({ modelIcon }: { modelIcon?: boolean }) {
  return (
    <div className="row">
      <span className="d-btn ghost mut icon-sm" style={{ borderRadius: 99 }}><Plus className="s18" strokeWidth={1.5} /></span>
      <span className="d-pick"><Hammer className="s14" />Code<ChevronDown className="s14 cv" /></span>
      <span className="d-pick">
        {modelIcon && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.3 3.5h-3.6L20.2 20.5h3.6zM6.7 3.5 0 20.5h3.7l1.4-3.6h7l1.3 3.6h3.7L10.5 3.5zm-.4 10.3 2.3-6 2.3 6z" /></svg>}
        Opus 5.5<span className="eff">High</span><ChevronDown className="s14 cv" />
      </span>
      <span className="grow" style={{ flex: 1 }} />
      <span className="d-pick"><Hand className="s14" />Manual</span>
      <span className="d-send"><ArrowUp className="s18" /></span>
    </div>
  );
}
