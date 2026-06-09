# Governance starts manual (A), graduates to automation (B), then champions (C)

To stay lean, the design system **starts with manual review**: Iván reviews design-touching
PRs directly, rather than standing up Chromatic gates, `DriftAudit` enforcement, and per-team
ownership before the system even exists.

This is a deliberate staged model, not a permanent state. The graduation triggers:

- **A → B (automation as first reviewer):** when manual review becomes a bottleneck — review
  latency or PR volume exceeds what one person can hold, typically once the cloud pilot has
  proven the recipes. B = Chromatic visual-regression + `DriftAudit` catch regressions
  automatically; human review narrows to `kilo-design` changes (tokens, core, recipes) and
  net-new patterns flagged as recipe candidates.
- **B → C (per-team champions):** when product teams have stable ownership and each can own its
  Product Skill while Iván owns the Core Skill.

Risk: A is a bottleneck and the system can rot if the triggers are ignored. This ADR exists so
that "A forever" is recognized as a failure mode, and the move to B is expected, not optional.
