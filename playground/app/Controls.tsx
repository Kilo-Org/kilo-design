"use client";

import { Tokens, isMeta, isColor, isDimension, COLOR_BUCKETS, TypeRole } from "@/lib/tokens";
import { toOklch } from "@/lib/oklch";
import c from "./controls.module.css";

type Setter = (value: string | number) => void;
type Getter = () => string | number;

function ColorControl({ label, get, set }: { label: string; get: () => string; set: (v: string) => void }) {
  const value = get();
  const base6 = value.match(/^#([0-9a-fA-F]{6})/);
  const pickerValue = base6 ? `#${base6[1]}` : "#000000";
  const ok = toOklch(value);

  return (
    <div className={c.ctrl}>
      <label className={c.label} title={label}>{label}</label>
      <input
        type="color"
        value={pickerValue}
        onChange={(e) => set(e.target.value)}
      />
      <input
        type="text"
        className={c.text}
        value={value}
        onChange={(e) => set(e.target.value)}
      />
      {ok && (
        <div className={`${c.oklch} ${ok.outOfGamut ? c.warn : ""}`}>
          → {ok.css}{ok.outOfGamut ? "  ⚠ out of sRGB" : ""}
        </div>
      )}
    </div>
  );
}

function DimControl({ label, get, set }: { label: string; get: () => string; set: (v: string) => void }) {
  const value = get();
  const unit = (value.match(/(px|rem|em)$/)?.[1] ?? "px") as string;
  const max = unit === "px" ? 64 : 4;
  const step = unit === "px" ? 1 : 0.0625;
  return (
    <div className={c.ctrl}>
      <label className={c.label} title={label}>{label}</label>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={parseFloat(value) || 0}
        onChange={(e) => set(`${e.target.value}${unit}`)}
      />
      <input type="text" className={c.text} value={value} onChange={(e) => set(e.target.value)} />
    </div>
  );
}

function TextControl({ label, get, set, wide }: { label: string; get: Getter; set: Setter; wide?: boolean }) {
  return (
    <div className={c.ctrl}>
      <label className={c.label} title={label}>{label}</label>
      <input
        type="text"
        className={`${c.text} ${wide ? c.wide : ""}`}
        value={String(get())}
        onChange={(e) => set(e.target.value)}
      />
    </div>
  );
}

function NumControl({ label, get, set }: { label: string; get: () => number; set: (v: number) => void }) {
  return (
    <div className={c.ctrl}>
      <label className={c.label} title={label}>{label}</label>
      <input
        type="number"
        className={c.text}
        step="any"
        value={get()}
        onChange={(e) => set(parseFloat(e.target.value))}
      />
    </div>
  );
}

function Group({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <details className={c.group} open>
      <summary className={c.summary}>{title}</summary>
      <div className={c.body}>
        {note && <p className={c.note}>{note}</p>}
        {children}
      </div>
    </details>
  );
}

export function Controls({ tokens, onChange }: { tokens: Tokens; onChange: (next: Tokens) => void }) {
  // Immutable update helper: clone, mutate by path, emit.
  const update = (mutate: (draft: Tokens) => void) => {
    const next = structuredClone(tokens);
    mutate(next);
    onChange(next);
  };

  return (
    <div>
      {COLOR_BUCKETS.map((bucket) => {
        const entries = Object.entries(tokens.color[bucket] as Record<string, string>).filter(
          ([k]) => !isMeta(k),
        );
        const note = (tokens.color[bucket] as { $comment?: string }).$comment;
        return (
          <Group key={bucket} title={`color · ${bucket}`} note={note}>
            {entries.map(([name, val]) =>
              isColor(val) ? (
                <ColorControl
                  key={name}
                  label={name}
                  get={() => (tokens.color[bucket] as Record<string, string>)[name]}
                  set={(v) => update((d) => { (d.color[bucket] as Record<string, string>)[name] = v; })}
                />
              ) : (
                <TextControl
                  key={name}
                  label={name}
                  get={() => (tokens.color[bucket] as Record<string, string>)[name]}
                  set={(v) => update((d) => { (d.color[bucket] as Record<string, string>)[name] = String(v); })}
                />
              ),
            )}
          </Group>
        );
      })}

      <Group title="shadow" note={tokens.shadow.$comment}>
        {Object.entries(tokens.shadow).filter(([k]) => !isMeta(k)).map(([name]) => (
          <TextControl
            key={name}
            label={name}
            wide
            get={() => tokens.shadow[name]}
            set={(v) => update((d) => { d.shadow[name] = String(v); })}
          />
        ))}
      </Group>

      <Group title="statusDomain" note={tokens.statusDomain.$comment}>
        {Object.entries(tokens.statusDomain).filter(([k]) => !isMeta(k)).map(([domain]) => (
          <TextControl
            key={domain}
            label={domain}
            get={() => tokens.statusDomain[domain]}
            set={(v) => update((d) => { d.statusDomain[domain] = String(v); })}
          />
        ))}
      </Group>

      <Group title="radius">
        {Object.entries(tokens.radius).filter(([k]) => !isMeta(k)).map(([name, val]) =>
          isDimension(val) ? (
            <DimControl key={name} label={name} get={() => tokens.radius[name]} set={(v) => update((d) => { d.radius[name] = String(v); })} />
          ) : (
            <TextControl key={name} label={name} get={() => tokens.radius[name]} set={(v) => update((d) => { d.radius[name] = String(v); })} />
          ),
        )}
      </Group>

      <Group title="spacing">
        {Object.entries(tokens.spacing).filter(([k]) => !isMeta(k)).map(([name]) => (
          <DimControl
            key={name}
            label={name.replace("_", ".")}
            get={() => tokens.spacing[name]}
            set={(v) => update((d) => { d.spacing[name] = String(v); })}
          />
        ))}
      </Group>

      <Group title="typography" note={typeof tokens.typography.$comment === "string" ? tokens.typography.$comment : undefined}>
        {Object.entries(tokens.typography)
          .filter(([k, v]) => !isMeta(k) && typeof v !== "string")
          .map(([role, def]) => {
            const d = def as TypeRole;
            const getRole = () => tokens.typography[role] as TypeRole;
            return (
              <div key={role} className={c.typeBlock}>
                <div className={c.typeRole}>{role}</div>
                <TextControl label="family" get={() => getRole().fontFamily} set={(v) => update((t) => { (t.typography[role] as TypeRole).fontFamily = String(v); })} />
                <DimControl label="size" get={() => getRole().fontSize} set={(v) => update((t) => { (t.typography[role] as TypeRole).fontSize = String(v); })} />
                <NumControl label="weight" get={() => getRole().fontWeight} set={(v) => update((t) => { (t.typography[role] as TypeRole).fontWeight = v; })} />
                <NumControl label="lineHeight" get={() => getRole().lineHeight} set={(v) => update((t) => { (t.typography[role] as TypeRole).lineHeight = v; })} />
                {d.letterSpacing !== undefined && (
                  <TextControl label="letterSpacing" get={() => getRole().letterSpacing ?? ""} set={(v) => update((t) => { (t.typography[role] as TypeRole).letterSpacing = String(v); })} />
                )}
              </div>
            );
          })}
      </Group>
    </div>
  );
}
