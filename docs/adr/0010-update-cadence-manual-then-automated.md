# Design-system update cadence: manual version bumps now, automate later; CI staleness check

`tokens.json` is semver-versioned. Generated token artifacts are committed from this repo, and
future published skills will be pinned by hash in each consumer (ADR 0002). Consuming repos pick
up design-system changes by **bumping the pinned version** once publication starts, plus
re-running the token sync, via a small PR.

This starts **manual** once consumers are wired: when `kilo-design` changes, the owner opens a
quick bump PR in each consuming repo. When hand-bumping across the 4-5 repos becomes a chore,
enable a Renovate-style bot to auto-open "update available" PRs — the same
start-lean-then-graduate staging as the governance model (ADR 0006).

Guardrail: the `kilo-design` generator has its **own `package.json`** and a **CI check that
fails if the generated token artifacts are stale** versus `tokens.json`, so `tokens.landing.css`,
`tokens.cloud.ts`, and `tokens.extension-host-map.md` can never silently drift from the source
values.
