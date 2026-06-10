"use client";

import { useId, useState, type ReactNode } from "react";
import { Tokens, isMeta, isDimension, TypeRole } from "@/lib/tokens";
import c from "./controls.module.css";

type Setter = (value: string | number) => void;
type Getter = () => string | number;
type Entry = [string, unknown];
type GroupId = "shadow" | "statusDomain" | "radius" | "spacing" | "typography";

const GROUP_IDS: GroupId[] = ["shadow", "statusDomain", "radius", "spacing", "typography"];
const INITIAL_OPEN_STATE = Object.fromEntries(GROUP_IDS.map((id) => [id, true])) as Record<GroupId, boolean>;

function DimControl({ label, get, set }: { label: string; get: () => string; set: (v: string) => void }) {
  const id = useId();
  const value = get();
  const unit = (value.match(/(px|rem|em)$/)?.[1] ?? "px") as string;
  const max = unit === "px" ? 64 : 4;
  const step = unit === "px" ? 1 : 0.0625;
  return (
    <div className={c.ctrl}>
      <label className={c.label} htmlFor={id} title={label}>{label}</label>
      <input
        type="range"
        aria-label={`${label} slider`}
        min={0}
        max={max}
        step={step}
        value={parseFloat(value) || 0}
        onChange={(e) => set(`${e.target.value}${unit}`)}
      />
      <input id={id} type="text" className={c.text} value={value} onChange={(e) => set(e.target.value)} spellCheck={false} />
    </div>
  );
}

function TextControl({ label, get, set, wide }: { label: string; get: Getter; set: Setter; wide?: boolean }) {
  const id = useId();
  return (
    <div className={c.ctrl}>
      <label className={c.label} htmlFor={id} title={label}>{label}</label>
      <input
        id={id}
        type="text"
        className={`${c.text} ${wide ? c.wide : ""}`}
        value={String(get())}
        spellCheck={false}
        onChange={(e) => set(e.target.value)}
      />
    </div>
  );
}

function NumControl({ label, get, set }: { label: string; get: () => number; set: (v: number) => void }) {
  const id = useId();
  return (
    <div className={c.ctrl}>
      <label className={c.label} htmlFor={id} title={label}>{label}</label>
      <input
        id={id}
        type="number"
        className={c.text}
        step="any"
        value={get()}
        onChange={(e) => set(parseFloat(e.target.value))}
      />
    </div>
  );
}

function Group({
  title,
  note,
  open,
  isStatic,
  onToggle,
  children,
}: {
  title: string;
  note?: string;
  open: boolean;
  isStatic?: boolean;
  onToggle?: (open: boolean) => void;
  children: ReactNode;
}) {
  if (isStatic) {
    return (
      <section className={c.group}>
        <div className={`${c.summary} ${c.summaryStatic}`}>{title}</div>
        <div className={c.body}>
          {note && <p className={c.note}>{note}</p>}
          {children}
        </div>
      </section>
    );
  }
  return (
    <details className={c.group} open={open} onToggle={(event) => onToggle?.(event.currentTarget.open)}>
      <summary className={c.summary}>
        <span className={c.caret} aria-hidden="true" />
        {title}
      </summary>
      <div className={c.body}>
        {note && <p className={c.note}>{note}</p>}
        {children}
      </div>
    </details>
  );
}

export function Controls({ tokens, onChange }: { tokens: Tokens; onChange: (next: Tokens) => void }) {
  const [openGroups, setOpenGroups] = useState<Record<GroupId, boolean>>(INITIAL_OPEN_STATE);
  const [filter, setFilter] = useState("");

  const allOpen = GROUP_IDS.every((id) => openGroups[id]);
  const q = filter.trim().toLowerCase();
  const filterActive = q.length > 0;
  const m = (text: string) => text.toLowerCase().includes(q);

  // Immutable update helper: clone, mutate by path, emit.
  const update = (mutate: (draft: Tokens) => void) => {
    const next = structuredClone(tokens);
    mutate(next);
    onChange(next);
  };

  const setGroupOpen = (id: GroupId, open: boolean) => {
    setOpenGroups((current) => ({ ...current, [id]: open }));
  };

  const toggleAllGroups = () => {
    const nextOpen = !allOpen;
    setOpenGroups(Object.fromEntries(GROUP_IDS.map((id) => [id, nextOpen])) as Record<GroupId, boolean>);
  };

  // Return the rows that should render for a flat group given the active filter.
  // A group-title match reveals all rows; otherwise only label-matching rows show.
  const pick = (entries: Entry[], title: string, labelOf: (k: string) => string): Entry[] => {
    const rows = entries.filter(([k]) => !isMeta(k));
    if (!filterActive || m(title)) return rows;
    return rows.filter(([k]) => m(labelOf(k)));
  };

  const groupProps = (id: GroupId) => ({
    open: filterActive ? true : openGroups[id],
    isStatic: filterActive,
    onToggle: (open: boolean) => setGroupOpen(id, open),
  });

  const groups: ReactNode[] = [];

  const shadowRows = pick(Object.entries(tokens.shadow), "shadow", (k) => k);
  if (shadowRows.length) {
    groups.push(
      <Group key="shadow" title="shadow" note={tokens.shadow.$comment} {...groupProps("shadow")}>
        {shadowRows.map(([name]) => (
          <TextControl
            key={name}
            label={name}
            wide
            get={() => tokens.shadow[name]}
            set={(v) => update((d) => { d.shadow[name] = String(v); })}
          />
        ))}
      </Group>,
    );
  }

  const statusRows = pick(Object.entries(tokens.statusDomain), "statusDomain", (k) => k);
  if (statusRows.length) {
    groups.push(
      <Group key="statusDomain" title="statusDomain" note={tokens.statusDomain.$comment} {...groupProps("statusDomain")}>
        {statusRows.map(([domain]) => (
          <TextControl
            key={domain}
            label={domain}
            get={() => tokens.statusDomain[domain]}
            set={(v) => update((d) => { d.statusDomain[domain] = String(v); })}
          />
        ))}
      </Group>,
    );
  }

  const radiusRows = pick(Object.entries(tokens.radius), "radius", (k) => k);
  if (radiusRows.length) {
    groups.push(
      <Group key="radius" title="radius" {...groupProps("radius")}>
        {radiusRows.map(([name, val]) =>
          isDimension(val) ? (
            <DimControl key={name} label={name} get={() => tokens.radius[name]} set={(v) => update((d) => { d.radius[name] = String(v); })} />
          ) : (
            <TextControl key={name} label={name} get={() => tokens.radius[name]} set={(v) => update((d) => { d.radius[name] = String(v); })} />
          ),
        )}
      </Group>,
    );
  }

  const spacingLabel = (k: string) => k.replace("_", ".");
  const spacingRows = pick(Object.entries(tokens.spacing), "spacing", spacingLabel);
  if (spacingRows.length) {
    groups.push(
      <Group key="spacing" title="spacing" {...groupProps("spacing")}>
        {spacingRows.map(([name]) => (
          <DimControl
            key={name}
            label={spacingLabel(name)}
            get={() => tokens.spacing[name]}
            set={(v) => update((d) => { d.spacing[name] = String(v); })}
          />
        ))}
      </Group>,
    );
  }

  const typographyTitleMatch = m("typography");
  const typographyRoles = (Object.entries(tokens.typography).filter(
    ([k, v]) => !isMeta(k) && typeof v !== "string",
  ) as [string, TypeRole][]).filter(([role, def]) => {
    if (!filterActive || typographyTitleMatch) return true;
    if (m(role)) return true;
    const fields = ["family", "size", "weight", "lineHeight", "letterSpacing"];
    return fields.some((f) => m(f)) || m(def.fontFamily);
  });
  if (typographyRoles.length) {
    groups.push(
      <Group
        key="typography"
        title="typography"
        note={typeof tokens.typography.$comment === "string" ? tokens.typography.$comment : undefined}
        {...groupProps("typography")}
      >
        {typographyRoles.map(([role, def]) => {
          const getRole = () => tokens.typography[role] as TypeRole;
          return (
            <div key={role} className={c.typeBlock}>
              <div className={c.typeRole}>{role}</div>
              <TextControl label="family" get={() => getRole().fontFamily} set={(v) => update((t) => { (t.typography[role] as TypeRole).fontFamily = String(v); })} />
              <DimControl label="size" get={() => getRole().fontSize} set={(v) => update((t) => { (t.typography[role] as TypeRole).fontSize = String(v); })} />
              <NumControl label="weight" get={() => getRole().fontWeight} set={(v) => update((t) => { (t.typography[role] as TypeRole).fontWeight = v; })} />
              <NumControl label="lineHeight" get={() => getRole().lineHeight} set={(v) => update((t) => { (t.typography[role] as TypeRole).lineHeight = v; })} />
              {def.letterSpacing !== undefined && (
                <TextControl label="letterSpacing" get={() => getRole().letterSpacing ?? ""} set={(v) => update((t) => { (t.typography[role] as TypeRole).letterSpacing = String(v); })} />
              )}
            </div>
          );
        })}
      </Group>,
    );
  }

  return (
    <div>
      <div className={c.toolbar}>
        <div className={c.search}>
          <svg className={c.searchIcon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M13 13l-2.6-2.6" />
          </svg>
          <input
            className={c.searchInput}
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter tokens by name"
            placeholder="Filter tokens"
          />
          {filterActive && (
            <button className={c.clearBtn} type="button" onClick={() => setFilter("")} aria-label="Clear filter">
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          )}
        </div>
        {!filterActive && (
          <button className={c.toggleAll} type="button" onClick={toggleAllGroups} aria-expanded={allOpen}>
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        )}
      </div>

      {groups.length > 0 ? (
        groups
      ) : (
        <div className={c.empty}>
          <p className={c.emptyTitle}>No tokens match &ldquo;{filter.trim()}&rdquo;</p>
          <p className={c.emptyHint}>Try a token name like <code>radius</code>, <code>spacing</code>, or <code>shadow</code>.</p>
          <button className={c.emptyClear} type="button" onClick={() => setFilter("")}>Clear filter</button>
        </div>
      )}
    </div>
  );
}
