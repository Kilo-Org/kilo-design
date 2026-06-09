# Primary action color is the brand yellow-green (primary and brand are one token)

The Kilo suite is dark-first, and the neon yellow-green is the brand's defining accent. A
neutral/gray primary reads as dead and generic in dark mode, so **`--primary` *is* the brand
color** — primary and brand are the same token, exactly as `tokens.json` already encodes
(`primary` === `brand` === `#EDFF00`), with near-black `--primary-foreground` (`#1F1F1F`) for
AA contrast. shadcn's default button variant carries it.

Consequence: cloud's current neutral `--primary` (`oklch(0.922 0 0)`) is **Drift** to be
migrated to the brand yellow — consistent with ADR 0001, and the target `DriftAudit` already
records.

Risk and mitigation: agents default to `<Button>` and could scatter yellow. This is contained
by the `primary-actions` Pattern Recipe — "exactly one primary action per surface; all other
actions use `secondary` / `outline` / `ghost`" — reinforced by `DriftAudit` and review, **not**
by neutralizing the token.

Rejected: a neutral `--primary` plus a separate scarce `cta`/`brand` variant. It contradicts
the brand and `tokens.json`, and a neutral primary looks generic on a dark canvas. The earlier
lean toward this option was wrong because it fought the project's own source of truth.
