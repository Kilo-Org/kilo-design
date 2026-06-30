# Kilo Design System — Execution Checklist (Progress Tracker)

**Purpose:** the ordered, trackable task list for unifying Kilo's look & feel across products.
Pair this with the rationale in `kilo-design-system-foundation.md`. This file is the *what & when*;
that file is the *why*.

**Owner:** Iván (Design). **Contributors:** per-task below. **Updated:** _set on each edit_.

### How to read this
- Work top to bottom. Milestones are gated — don't start a milestone until its predecessor's
  "Exit criteria" are met (except where marked _parallel-ok_).
- Each task has an ID (`T#.#`), an acceptance check, and dependencies.
- Update the **Status** marker as you go.

### Status legend
`☐` not started · `◐` in progress · `☑` done · `⏸` blocked · `▷` parallel-ok

### Step progress (fill in as you go — mirrors Linear VVV-118…125)

|Step |Name |Goal |Status |Target |
|---|---|---|---|---|
|1 |Lock decisions & stop the context bloat |Decisions locked; path-scoped trigger |◐ |Week 1 |
|2 |Tokens + fix the cloud styles |One source of values; cloud code matches it |☐ |Week 1-2 |
|3 |Build the design skill & ship it |Installable `kilo-design-core` + `-cloud` |☐ |Week 2 |
|4 |Fix the core components |Recipes + migrations (cloud) |☐ |Week 3-4 |
|5 |Roll out to Landing |Landing consumes tokens + skill |☐ |Week 4 |
|6 |Roll out to the VS Code panel (+ Console) |Editor + Console skills |☐ |Week 5-6 |
|7 |Roll out to JetBrains, CLI & Mobile |Sub-overlays + mobile skill; light mode removed |☐ |Week 6-7 |
|8 |Keep it from drifting |Governance A→B→C |☐ |Ongoing |

---

> **Granularity:** one line per logical unit, mirroring the 8 Linear steps (VVV-118…125).
> Decisions are settled — see `docs/adr/0001-0010`. Each line carries a definition of done (DoD).

## Step 1 / M0 — Lock decisions & stop the context bloat
- `☑` **T0.1 Decisions locked.** ADRs 0001-0010 exist in `docs/adr/`. _DoD: done._
- `☐` **T0.2 Path-scoped trigger (kilo-cloud).** Remove the unconditional "touch UI → read
  DESIGN.md" mandate from `AGENTS.md` + `apps/web/AGENTS.md`; replace with ONE pointer keyed on
  **file path** (`apps/web/src/**`), never the word "design"; keep `/kilo-design`. _(ADR 0008.)_
  _DoD: a non-UI task no longer auto-loads design docs; the pointer fires only on UI paths._

## Step 2 / M1 — Tokens + fix the cloud styles
> Repo was clean-slated (Option A): only `README.md`, `CONTEXT.md`, `docs/adr/`, `.plans/` remain.
> Old token values recoverable from git commit `acdcc60`.
- `☑` **T1.1 Author `tokens.json`** (hand-authored **hex** source). `primary` === `brand` ===
  `#EDFF00`, `--primary-foreground` = `#1F1F1F`; split into **brand+status (mode-agnostic)** vs
  **dark surface neutrals**; include status domain→color map, type scale (Inter + Roboto Mono),
  spacing, radius. _(ADR 0003, 0005, 0009.)_ _DoD: `tokens.json` exists and matches the ADRs._
- `☑` **T1.2 Build the generator** (`build/` + `culori`): emits `tokens.web.css` (OKLCH, web),
  `tokens.ts` (hex, portable), `tokens.host-map.md` (incl. the `--vscode-*` mapping); own
  `package.json` + a **CI staleness check**. _(ADR 0003, 0010.)_ _DoD: `node build` regenerates
  all three; CI fails if artifacts drift from source._
- `☐` **T1.3 Reconcile cloud `globals.css`** to the tokens: `--primary` = brand yellow + near-black
  foreground, fix the font wiring (drop dead `--font-geist-*`), remove the light-mode `:root` leak.
  _(ADR 0001, 0005, 0009.)_ _DoD: DriftAudit token/font + "Primary action color" rows read Aligned._

## Step 3 / M2 — Build the design skill & ship it to the repos
- `☐` **T2.1 Verify private-repo skill-sync** (the one open prerequisite — do first). _(Risk note.)_
  _DoD: confirmed sync from a private Kilo repo, or blocker escalated to eng._
- `☐` **T2.2 Build `kilo-design-core` + `kilo-design-cloud`.** Core = brand + voice + router
  (router lives in `SKILL.md`: smallest useful source, ≤3 files, else stop and explain). Cloud =
  "load core first" + cloud overlay + `patterns/cloud-web/**`. _(ADR 0004, 0008.)_ _DoD: both
  skills exist; core authored once._
- `☐` **T2.3 Publish + adopt in `kilo-cloud`.** Publish both from the repo (`cloudflare/skills`
  pattern); add to `skills-lock.json` (guidance → `.agents/`, token values → `src/`); delete the
  old local skill + root `DESIGN.md` (do not recreate). _(ADR 0002, 0008.)_ _DoD: installed via
  lockfile; old skill + 390-line `DESIGN.md` gone._
- `☐` **T2.4 Pass the proof gate** for `primary-actions` + `tabs`. _(Proof gate.)_ _DoD: a fresh
  agent loads ≤3 files and copies the Canonical Example; one real merged PR per recipe._

## Step 4 / M3 — Fix the core components _(ordered by drift severity)_
> Per-component pattern: recipe (points at ONE Canonical Example) → migrate worst offenders →
> Storybook story → flip the `DriftAudit` row. Recipes earn their place by drift (promotion rule),
> so beyond the two proof-gate recipes the rest are seeded as drift demands — not exhaustively.
- `☐` **T3.1 Button / primary actions** (worst drift; needs T1.3). Finalize the recipe (brand
  yellow; one primary per surface, all else secondary/outline/ghost); migrate `ui/button.tsx` +
  legacy `Button.tsx` off blue `#2B6AD2`. _DoD: recipe → one impl; Button stickersheet Chromatic
  green; DriftAudit button rows Aligned._
- `☐` **T3.2 Tabs.** Finalize the recipe (segmented vs underline); extract a shared variant on
  `ui/tabs.tsx`; migrate 1-2 admin surfaces. _DoD: one canonical tab impl; Storybook green._
- `☐` **T3.3 Seed badges / alerts / dialogs as drift earns them** (promotion rule): status badges
  (`/20` + ring + `text-400`), alerts/banners (`/20`, no colored button fills), dialogs (overlay,
  max-widths, footer order, destructive-only). _DoD: each recipe that exists points at one impl
  and its DriftAudit row is Aligned._

## Step 5 / M4 — Roll out to Landing
- `☐` **T4.1 Adopt in `kilo-landing`.** Install `kilo-design-core` + `kilo-design-landing`; consume
  `tokens.web.css`; delete `kilo-landing/DESIGN.md` (don't recreate) + add the path-scoped pointer.
  _(ADR 0008.)_ _DoD: landing installs the skills, consumes tokens, keeps no parallel rules._
- `☐` **T4.2 Seed landing recipes only where drift is real** (e.g. CTA, pricing card). _DoD:
  recipes exist only for genuinely drifted patterns._

## Step 6 / M5 — Roll out to the VS Code panel _(+ Console)_
- `☐` **T5.1 Webview = Kilo-dark.** Consume `tokens.ts` in the Solid packages
  (`@kilocode/kilo-web-ui`/`kilo-ui`/`ui`); render Kilo-dark, brand-yellow accent over host chrome;
  **honor VS Code high-contrast only** (don't follow host light theme). _(ADR 0009, 0007.)_ _DoD:
  webview renders Kilo-dark from tokens; high-contrast respected._
- `☐` **T5.2 Build + install `kilo-design-editor`** (`vscode-webview` sub-overlay; recipes name
  `@kilocode/kilo-web-ui` components; reuse kilo-code's existing Storybook). Add to
  `skills-lock.json` with a pointer for `kilo-vscode/**`. _(ADR 0007.)_ _DoD: editor skill
  installed with webview recipes seeded._
- `☐` **T5.3 Build + install `kilo-design-console`** (its own product; Kilo-dark; consumes
  `tokens.web.css`). Pointer for `kilo-console/**`. _(ADR 0007.)_ _DoD: console skill installed._

## Step 7 / M6 — Roll out to JetBrains, CLI & Mobile
- `☐` **T6.1 JetBrains + CLI sub-overlays** (on `kilo-design-editor`). JetBrains = thin (tokens +
  voice); specifics in `kilo-jetbrains/AGENTS.md` (with Kirill); IntelliJ + ANSI mappings in
  `tokens.host-map.md`. _(ADR 0006, 0007.)_ _DoD: both sub-overlays exist with host token mappings._
- `☐` **T6.2 Build + install `kilo-design-mobile`; remove the incidental light mode.** Consume
  `tokens.ts` (dark only) in `apps/mobile`; coordinate with the mobile dev. _(ADR 0009.)_ _DoD:
  mobile skill installed and the light mode removed._

## Step 8 / M7 — Keep it from drifting _(runs continuously from Step 4; A → B → C)_
- `☐` **T7.1 Stage A (now): manual review.** Iván reviews design-touching PRs; promotion rule live;
  `DriftAudit` kept current. _(ADR 0006.)_ _DoD: design PRs reviewed; recipes earned by drift._
- `☐` **T7.2 Stage B/C triggers.** When manual review/hand-bumping is a bottleneck: automate the
  Chromatic + DriftAudit gate, version `tokens.json` (semver) with a Renovate-style bot, and hand
  product skills to team champions (Iván keeps Core). _(ADR 0006, 0010.)_ _DoD: triggers wired so
  automation/champions activate on bottleneck._

---

## Dependency map (quick reference)
- All decisions are locked (ADRs 0001-0010); nothing is gated on an open decision.
- **Step 2** can start now (tokens authored from the ADRs).
- **Step 3** depends on Step 2 + **T2.1** (private-repo skill-sync verified — the one open risk).
- **Step 4** depends on Step 2 (tokens) + Step 3 (skills installed); **T3.1** depends on **T1.3**.
- **Steps 5-7** depend on **Step 3 proven in cloud** (the proof gate, **T2.4**); ordered
  cloud → landing → editor/console → jetbrains/cli/mobile.
- **Step 8** runs continuously from Step 4 onward.

## Out of scope (explicitly, to avoid scope creep)
- Figma-to-code token pipeline. A global multi-product Storybook. Rewriting all legacy blue CTAs
  at once (migrate as surfaces are touched). Enforcement automation beyond Chromatic + review.
