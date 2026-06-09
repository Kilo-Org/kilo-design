# Authority model: prescriptive values, descriptive-but-evolving patterns

The canonical Kilo design system (`kilo-design`) is **prescriptive for values** — tokens
(color, spacing, radius, type) define the target state, and shipped code that disagrees is
Drift to be migrated. It is **descriptive-but-evolving for patterns** — every Pattern Recipe
must point at a Canonical Example in real, shipped code, never at an aspirational mock.

Why: the team asked to "point the agent at real code" (design-system meeting, 2026-06), so
recipes that reference non-existent ideals would induce hallucination. Conversely, leaving
token values unaligned (e.g. cloud `--primary` ships gray while `tokens.json` says yellow)
leaves code lying about its own system. Aligning values is a contained, mechanical migration;
aligning patterns is gradual and evidence-led via recipes + `DriftAudit`.
