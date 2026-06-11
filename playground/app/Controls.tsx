"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { COLOR_BUCKETS, ColorBucket, Tokens, isMeta, isColor, isDimension, TypeRole } from "@/lib/tokens";
import c from "./controls.module.css";

type Setter = (value: string | number) => void;
type Getter = () => string | number;
type Entry = [string, unknown];
type GroupId = ColorBucket | "statusDomain" | "radius" | "spacing" | "typography";

const GROUP_IDS: GroupId[] = [...COLOR_BUCKETS, "statusDomain", "radius", "spacing", "typography"];
const INITIAL_OPEN_STATE = Object.fromEntries(GROUP_IDS.map((id) => [id, true])) as Record<GroupId, boolean>;

/** A complete hex color: #rgb, #rgba, #rrggbb, or #rrggbbaa. */
const isHex = (v: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v.trim());

function ColorSwatch({
  bucket,
  tokenName,
  label,
  value,
  onChange,
}: {
  bucket: ColorBucket;
  tokenName: string;
  label: string;
  value: string;
  onChange: (bucket: ColorBucket, name: string, value: string) => void;
}) {
  const base6 = value.match(/^#([0-9a-fA-F]{6})/);
  const pickerValue = base6 ? `#${base6[1]}` : "#000000";
  const fieldLabel = `color.${bucket}.${tokenName}`;
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value]);

  const commit = () => {
    const next = draft.trim();
    if (isHex(next)) {
      if (next !== value) onChange(bucket, tokenName, next);
    } else {
      setDraft(value);
    }
  };

  const onText = (raw: string) => {
    setDraft(raw);
    if (isHex(raw.trim())) onChange(bucket, tokenName, raw.trim());
  };

  return (
    <div className={c.swatch}>
      <div className={c.chip} style={{ background: value }}>
        <input
          className={c.swatchPicker}
          type="color"
          aria-label={`Pick ${fieldLabel}`}
          value={pickerValue}
          onChange={(e) => onChange(bucket, tokenName, e.target.value)}
        />
        <span className={c.chipCue}>Edit</span>
      </div>
      <div className={c.swatchMeta}>
        <div className={c.swatchName} title={label}>{label}</div>
        <input
          className={c.swatchVal}
          aria-label={`Set ${fieldLabel}`}
          value={draft}
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => onText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") { setDraft(value); (e.target as HTMLInputElement).blur(); }
          }}
        />
      </div>
    </div>
  );
}

function StatusSwatches({
  rows,
  onChange,
}: {
  rows: [string, string][];
  onChange: (bucket: ColorBucket, name: string, value: string) => void;
}) {
  const families = new Map<string, [string, string][]>();
  const other: [string, string][] = [];

  for (const [name, value] of rows) {
    const match = name.match(/^([a-z]+)(\d{3})$/i);
    if (match) {
      const family = match[1];
      if (!families.has(family)) families.set(family, []);
      families.get(family)!.push([name, value]);
    } else {
      other.push([name, value]);
    }
  }

  const renderFamily = (family: string, swatches: [string, string][]) => {
    swatches.sort((a, b) => Number(a[0].match(/\d+$/)?.[0] ?? 0) - Number(b[0].match(/\d+$/)?.[0] ?? 0));
    return (
      <div key={family} className={c.statusFamily}>
        <span className={c.familyLabel}>{family}</span>
        <div className={c.statusSwatchRow}>
          {swatches.map(([name, value]) => (
            <ColorSwatch key={name} bucket="status" tokenName={name} label={name} value={value} onChange={onChange} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={c.statusGroups}>
      {Array.from(families, ([family, swatches]) => renderFamily(family, swatches))}
      {other.length > 0 && renderFamily("other", other)}
    </div>
  );
}

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

  const colorRows = (bucket: ColorBucket): [string, string][] => {
    const rows = Object.entries(tokens.color[bucket]).filter(([k, v]) => !isMeta(k) && isColor(v)) as [string, string][];
    const title = `color.${bucket}`;
    if (!filterActive || m(title) || m(bucket)) return rows;
    return rows.filter(([k, v]) => m(k) || m(v));
  };

  const setColor = (bucket: ColorBucket, name: string, value: string) => {
    update((draft) => { draft.color[bucket][name] = value; });
  };

  const groups: ReactNode[] = [];

  for (const bucket of COLOR_BUCKETS) {
    const rows = colorRows(bucket);
    if (!rows.length) continue;
    const note = typeof tokens.color[bucket].$comment === "string" ? tokens.color[bucket].$comment : undefined;
    groups.push(
      <Group key={bucket} title={`color.${bucket}`} note={note} {...groupProps(bucket)}>
        {bucket === "status" ? (
          <StatusSwatches rows={rows} onChange={setColor} />
        ) : (
          <div className={c.colorGrid}>
            {rows.map(([name, value]) => (
              <ColorSwatch key={name} bucket={bucket} tokenName={name} label={name} value={value} onChange={setColor} />
            ))}
          </div>
        )}
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
          <p className={c.emptyHint}>Try a token name like <code>radius</code>, <code>spacing</code>, or <code>primary</code>.</p>
          <button className={c.emptyClear} type="button" onClick={() => setFilter("")}>Clear filter</button>
        </div>
      )}
    </div>
  );
}
