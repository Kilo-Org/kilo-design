# Kilo Design System Foundation — Plan

> Archived background rationale. Linear is the canonical active project plan:
> https://linear.app/vheissu/project/kilo-design-30d3263d297a

Owner: Iván (solo design, product-led). Audience: ~20 engineers + their agents.
Scope: kilo-design (canonical), kilo-cloud, kilo-code (extensions/CLI/JetBrains/webview), kilo-landing, kilo-cloud mobile.
Status: proposal for review. Not started.

---

## 1. The problem, stated precisely

The pain is **not** "we lack design docs." It is that the same design language exists in
several places that disagree, and agents load the wrong amount of it at the wrong time.

Evidence gathered across the four repos:

- **The code contradicts the docs.** In `kilo-cloud/apps/web/src/app/globals.css`,
  `--primary` is `oklch(0.922 0 0)` (light gray) and the shipped `ui/button` "primary"
  variant is still hardcoded blue `#2B6AD2`. Both `DESIGN.md` and the `kilo-design` skill
  insist `primary` is the Kilo yellow-green. The yellow only exists as a separate
  `--brand-primary`. Fonts are mis-wired (`globals.css` maps Tailwind `font-sans/mono` to
  undefined `--font-geist-*`; `layout.tsx` defines `--font-sans/mono/jetbrains`). There is a
  light-mode `:root { --background:#fff }` leak (globals.css:105-108). Your own
  `DriftAudit.stories.tsx` already documents all of this.
- **Three overlapping sources of truth.** Root `DESIGN.md` (390 lines, hex, idealized) +
  the local `.agents/skills/kilo-design/` skill (~1,900 lines, OKLCH, adds JetBrains Mono,
  Impeccable-derived) + the `kilo-design` repo (`tokens.json` hex + router + recipes). None
  is wired as the authority; the code follows none of them.
- **Distribution failed, not the design.** `kilo-cloud` tried to vendor `kilo-design` as a
  git submodule (PR #3507) and reverted it days later (PR #3535, "restore original cloud
  guide"). Submodule init/update friction killed it.
- **Context pollution is a *triggering* bug.** Transcript (Roman): an abuse-service task
  pulled in `design.md` because the agent saw the word "design," then the billing spec, etc.
  The `AGENTS.md` rule "whenever you touch UI, read DESIGN.md + load the skill" fires
  unconditionally. Jean's ask was explicit: *be deterministic about what loads.*
- **Tokens alone won't fix it.** Jean: agents already pick the right token and still produce
  a different tab style. The expensive drift is at the **pattern** level (2-3 tab styles, mixed
  badge alphas, blue button fills). Marius and Jean independently asked for the same thing:
  one source that shows "this is how we do UI," point the agent at it.
- **Surfaces are genuinely heterogeneous** (so one CSS file cannot rule them all):

  | Surface | Stack | Theming constraint |
  |---|---|---|
  | kilo-cloud `apps/web` | Next/React/Tailwind v4/shadcn | Free dark-first brand (OKLCH vars) |
  | kilo-cloud `apps/mobile` | React Native/NativeWind | **dark-only** (incidental light mode being removed, ADR 0009); NativeWind opacity limits |
  | kilo-code webview | **Solid** + Vite + Tailwind | **Kilo-dark** (ADR 0009; honor high-contrast only); brand = accent over host chrome |
  | kilo-code JetBrains | JVM native | IntelliJ theming; needs very specific per-IDE guidance |
  | kilo-code CLI/console | terminal | ANSI only |
  | kilo-landing | Next/React/Tailwind/shadcn | free brand, more expressive (already aligned to tokens.json) |

---

## 2. My opinion on your proposed approach

You said: tokens first → build skills from tokens (retire the others) → hook canonical
references. You asked me to be direct.

**Where you're right:**

1. **Tokens first is the correct foundation** — and more urgent than it looks, because the
   cloud code currently *lies* about its own primary color and fonts. Fixing the token source
   and reconciling code to it is the highest-leverage move and unblocks everything else.
2. **A skill is the right delivery vehicle.** It loads on explicit invocation, which is exactly
   the determinism Jean and the team asked for. The transcript is near-unanimous on this.
3. **"A mini-Ivan for everyone, regardless of product" is the right ambition.**

**Where I'll push back (with evidence):**

1. **Do not nuke `kilo-design`.** I expected to design an architecture and instead found you'd
   already built the right one: `tokens.json`, `agent-router.md` (which precisely fixes Roman's
   over-loading: "load the smallest useful source… if >3 files, stop and explain"),
   `CONTEXT.md` glossary (Pattern Recipe, Context Router, Product Overlay), product overlays
   (`editor.md` already handles the `--vscode-*` host-theme constraint), and pattern recipes
   (`tabs.md` is a direct answer to Jean). The bones are correct. What failed was **distribution
   and adoption**, not the design. Keep the architecture; delete only the cruft
   (`session-ses_16f7.md` 78KB, `kilo-ui-system-plan.html` 23KB, duplicated prose).
2. **Don't build one monolithic universal skill.** Kirill is decisive: generic UI guidance
   fails for agents in IDEs; JetBrains needs very specific direction. A single 2,000-line
   "everything" skill is both too generic for the IDEs and too heavy for context — the very
   problem you're solving. **Decided (ADR 0004):** ship a shared **`kilo-design-core`** skill
   (brand, voice, tokens, router) plus thin per-product skills (**`kilo-design-cloud`**,
   `-editor`, `-landing`, `-mobile`) that each say "load core first" — teams install only what
   they need. "Retire the other skills" means **merge the good cloud skill into the core**,
   not delete and start over (keep the Impeccable `NOTICE.md` attribution).
3. **You already have the cross-repo distribution mechanism — use it instead of submodules.**
   Every repo already vendors and **hash-locks** skills from GitHub via `skills-lock.json`
   (`cloudflare/skills`, `remotion-dev/skills` → `.agents/skills/`). Publish the design system
   as a skill from a Kilo-owned GitHub repo and every product installs it the same way,
   version-pinned, no submodule pain. This is the unlock the submodule attempt was missing.
4. **Tokens must be a value source each platform *adapts*, not one stylesheet everyone imports.**
   Web/landing consume brand tokens directly. The Solid VS Code webview must layer brand
   (yellow accent) *over* `--vscode-*` (it cannot adopt `#121212` wholesale). JetBrains/CLI need
   their own mappings. So the canonical `tokens.json` should **generate** artifacts: web CSS
   vars + a plain-TS export (Igor's "barest baseline") + documented host-theme mappings. One
   source of values, N adapters.
5. **Keep Storybook, but scope it as the web reference implementation — don't force it
   everywhere.** Usage is genuinely mixed (Roman situational, Igor dislikes). Cloud's Storybook
   is already a real asset (Chromatic + Stickersheet + DriftAudit) and satisfies Marius's "point
   the agent at a correct repo." kilo-code already has its own Solid Storybook. Do **not** build
   a global multi-product Storybook (your own pilot doc excludes it). Storybook = web visual
   regression + reference; tokens + skill = the cross-product layer.

**Net:** your sequence is right; the correction is *consolidate and distribute what you already
designed*, keep the skill layered + per-surface, and reconcile the code to the tokens.

---

## 3. Target architecture

Decisions are pinned as ADRs in `kilo-design/docs/adr/` (referenced inline below).

```
Kilo-Org/kilo-design   ── standalone canonical source (ADR 0002), publishes MANY skills
  tokens.json                  hand-authored hex source of values (ADR 0003)
  build/                       bespoke generator (+ culori), no Style Dictionary
    tokens.web.css             OKLCH CSS vars   → Cloud + Landing      (ADR 0003)
    tokens.ts                  hex/rgba constants → Solid webview / mobile / CLI (ADR 0003)
    tokens.host-map.md         documented mapping for --vscode-*, JetBrains, ANSI
  skills/
    kilo-design-core/          shared: brand, voice, tokens meaning, the router (ADR 0004)
      SKILL.md                 router lives here (loading rules: ≤3 files, else explain)
      reference/kilo-brand.md  merged from the cloud skill + DESIGN.md
      reference/voice.md
    kilo-design-cloud/         "load kilo-design-core first" + cloud overlay + recipes
    kilo-design-editor/        + editor overlay (host-theme aware) + recipes
    kilo-design-landing/
    kilo-design-mobile/
  docs/adr/                    the locked decisions
  CONTEXT.md                   glossary
  NOTICE.md                    Impeccable attribution

Each product repo (ADR 0002 — two payloads, two destinations):
  skills-lock.json             pins kilo-design-core + its product skill(s) by hash
  .agents/skills/<skills>/     vendored guidance (synced, not hand-edited)
  src/.../tokens.generated.*   vendored token VALUES in a build-visible path (NOT in .agents/)
  AGENTS.md                    ONE path-scoped pointer line (ADR 0008): "for UI files under X,
                               use the kilo-design skill". NO DESIGN.md — rules live in the skill.
```

Two consistency layers:
- **Tokens** (color/space/radius/type) — fixes value drift; **prescriptive** (code that
  disagrees is Drift to migrate, ADR 0001). Primary === brand === yellow-green (ADR 0005).
- **Pattern recipes** (tabs, primary actions, badges, dialogs) — fixes pattern drift;
  **descriptive-but-evolving** (ADR 0001): each recipe points to a Canonical Example in real
  shipped code, never an aspirational mock.

---

## 4. Phased plan (small, sequenced, pilot-first)

### Phase 0 — Stop the bleeding (kilo-cloud only; ~half day)
Cheap, immediate, reversible. Decouples *triggering* from *content* (ADR 0008).
- Remove the unconditional "whenever you touch UI, read `DESIGN.md` + load the skill" mandate
  from `AGENTS.md` and `apps/web/AGENTS.md`. Replace with ONE **path-scoped** pointer line:
  "For UI files under `apps/web/src/**`, use `/kilo-design`" — triggered by file path, never by
  the word "design."
- Keep the existing `kilo-design` skill in place for now (don't delete until Phase 2 replaces it).
- Outcome: Roman's "abuse feature pulled in design.md" class of bug stops.

### Phase 1 — Canonical tokens + reconcile the code (kilo-design + kilo-cloud pilot; ~2-3 days)
- In `kilo-design`: keep `tokens.json` as the single source of values. Add a tiny build step
  that emits `tokens.web.css`, `tokens.ts`, and `tokens.host-map.md`. No Figma pipeline (Marius's
  maintenance-overhead warning — keep it a few dozen lines).
- In `kilo-cloud/apps/web`: reconcile `globals.css` to the tokens. Concretely:
  - **Decided (ADR 0005):** `--primary` *is* the brand yellow-green (primary === brand), with
    near-black `--primary-foreground`; the default button variant carries it. Migrate cloud's
    neutral `--primary` → yellow. Scarcity is enforced by the `primary-actions` recipe ("one
    primary per surface; all else secondary/outline/ghost"), not by neutralizing the token.
  - Fix the font-token mismatch (`--font-geist-*` → `--font-sans/mono`).
  - Remove the light-mode `:root` leak.
  - Migrate `ui/button` "primary" off hardcoded blue per `DriftAudit.stories.tsx`.
- Verify in Storybook (Stickersheet + DriftAudit should move rows from "Drifted" → "Aligned").

### Phase 2 — The skills + distribution (kilo-design + kilo-cloud; ~3-4 days)
- Build `kilo-design-core` (brand/voice/tokens/router, merged from the cloud skill +
  `DESIGN.md`, keep `NOTICE.md`) and `kilo-design-cloud` (overlay + recipes, "load core first").
- Publish both as skills from the one `kilo-design` repo (the `cloudflare/skills` pattern).
- In `kilo-cloud`: add `kilo-design-core` + `kilo-design-cloud` to `skills-lock.json`, vendor
  into `.agents/skills/`; vendor token values into a build-visible `src/` path; delete the
  duplicated local skill **and delete root `DESIGN.md` (do not recreate it — ADR 0008)**.
- **Proof gate (ADR-free process; see §6):** the cloud pilot is "proven" only when the four
  criteria hold — token migration + DriftAudit green, skills installed, the **format test**
  (fresh agent loads ≤3 files and copies the Canonical Example) for `primary-actions` + `tabs`,
  and **one real merged PR per those two recipes**. Do not start Phase 4 until then.

### Phase 3 — Pattern recipes: the real consistency fix (kilo-cloud; ~ongoing, 1 week of seeding)
- Use `DriftAudit.stories.tsx` to prioritize. Seed recipes for the top recurring patterns:
  tabs (exists), primary actions (exists), status badges, alerts/banners, dialogs.
- Each recipe points to **one** authoritative production component by path and says "do not
  invent a variant; if the recipe doesn't fit, explain why" (Jean's "don't invent patterns").
- Promotion rule (already in `agent-router.md`): a pattern earns a recipe once it appears in ≥2
  surfaces or an agent has already produced inconsistent variants.

### Phase 4 — Expand to the other surfaces (kilo-code + landing + mobile; after cloud proves out)
- **landing:** lowest risk; its `DESIGN.md` content already matches `tokens.json`. Install
  `kilo-design-core` + `kilo-design-landing`, consume `tokens.web.css`, then **delete
  `kilo-landing/DESIGN.md`** and replace with the path-scoped AGENTS.md pointer (ADR 0008).
- **kilo-code webview (Solid):** consume `tokens.ts`; render **Kilo-dark** (ADR 0009), honoring
  VS Code high-contrast themes only. Recipes live under the editor skill's webview sub-overlay.
- **JetBrains:** do NOT rely on the generic skill alone. With Kirill, write very specific
  `kilo-jetbrains/AGENTS.md` guidance (his stated preference); the skill supplies tokens + voice
  only. Document the IntelliJ theming mapping in `tokens.host-map.md`.
- **CLI/console:** ANSI mapping in `tokens.host-map.md`; minimal.
- **mobile:** consume `tokens.ts` (dark only); **remove the incidental light mode** (ADR 0009) —
  real work in `apps/mobile`, coordinate with the mobile dev. Mind NativeWind opacity limits.

---

## 5. What to keep vs. delete in `kilo-design`

- **Keep (the architecture):** `tokens.json`, `agent-router.md` (its rules move into
  `kilo-design-core/SKILL.md`), `CONTEXT.md`, `DESIGN.md` (shared language → core), the
  `products/*.md` overlays (become per-product skills), `patterns/**`.
- **Delete (cruft for a canonical repo):** `session-ses_16f7.md` (78KB log),
  `kilo-ui-system-plan.html` (23KB), `.DS_Store`.
- **Reconcile:** fold the cloud skill's `kilo-brand.md` + UX-writing depth into
  `kilo-design-core/reference/`. Color format resolved (ADR 0003): `tokens.json` stays hex;
  generate OKLCH for web, hex for portable targets.

---

## 6. Decisions — RESOLVED (grilling session, ADRs in `kilo-design/docs/adr/`)

| # | Decision | Outcome | ADR |
|---|---|---|---|
| 1 | Authority model | Prescriptive values, descriptive-but-evolving patterns | 0001 |
| 2 | Canonical home | Standalone `kilo-design` repo | 0002 |
| 3 | Distribution | Pinned hash-sync; guidance → `.agents/skills/`, values → `src/` | 0002 |
| 4 | Token formats | Hex source; OKLCH for web; hex for portable (Solid/mobile/CLI) | 0003 |
| 5 | Generator | Bespoke script + `culori`; no Style Dictionary / Figma | 0003 |
| 6 | Skill packaging | `kilo-design-core` + thin per-product skills, compose by convention | 0004 |
| 7 | CTA model | `--primary` *is* the brand yellow; scarcity via recipe | 0005 |
| 8 | Governance | Start manual (A) → automation (B) → champions (C), with triggers | 0006 |

**Proof gate (process, not an ADR).** Cloud pilot is "proven" only when: (1) tokens generated
+ cloud `globals.css` migrated + DriftAudit token/font rows Aligned; (2) `kilo-design-core` +
`kilo-design-cloud` installed, old local skill + 390-line `DESIGN.md` removed; (3) **format
test** — a fresh agent on a real task loads ≤3 design files and copies the Canonical Example,
for `primary-actions` and `tabs`; (4) **value test** — one real merged PR per those two
recipes. Only then start Phase 4.

### Resolved since (ADRs)
- **Editor substructure:** one `kilo-design-editor` skill with `vscode-webview` / `jetbrains` /
  `cli` sub-overlays; `kilo-console` is its own product skill (ADR 0007).
- **Light/dark:** dark-only everywhere; remove mobile's incidental light mode (ADR 0009).
- **Loading/trigger:** path-scoped pointer, no per-repo `DESIGN.md` (ADR 0008).

### All resolved (ADRs 0001-0010)
- **Generator hygiene + update cadence:** generator gets its own `package.json` + a CI staleness
  check; consumers update via manual version-bump PRs now, a Renovate-style bot later (ADR 0010).

---

## 7. Risks & mitigations

- **Skill-sync: private-repo support is the open prerequisite.** Confirmed the tool has **no
  native composition** (flat `{source, hash}` lockfile — hence the core-skill-by-convention
  model). Before Phase 2, confirm it can pull from a **private** Kilo repo (the locked examples
  are public). If not, that tooling change is a prerequisite. *(Verify early.)*
- **Reconciling `--primary` is a visible change** across the cloud app. Mitigate via the
  Stickersheet/DriftAudit in Storybook + Chromatic before/after as the review gate.
- **Over-scoping into a "design ops program."** Counter-mitigation: every phase is independently
  shippable and pilot-gated; nothing past Phase 1 ships until the cloud pilot proves the format.
- **Solo-owner bandwidth.** The skill makes you scale ("mini-Ivan"), but recipes need seeding.
  Seed only patterns that have *already* drifted (promotion rule), not a speculative full library.
