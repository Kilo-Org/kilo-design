# Product Judgment

This reference is for agent behavior inside Cloud UI work. It is not product code guidance by itself.

## Modes

| Mode | Do | Done when |
| --- | --- | --- |
| Shape | Clarify a flow, hierarchy, states, and tradeoffs. Do not edit. | The recommendation is concrete enough to implement. |
| Implement | Make the smallest coherent Cloud code change. | Changed code matches the overlay or recipe, or calls out a gap. |
| Review | Inspect code/screens and report findings. Do not edit. | Findings cite paths, severity, rule, and fix. |
| Copy | Improve labels, empty states, errors, and confirmations. | Copy says what happened and what to do next. |

## Authority Order

Use this order when sources disagree:

1. User's explicit goal.
2. Real Cloud behavior and constraints.
3. Product-facing assets: `tokens.json`, generated `src/` artifacts, and host map.
4. This skill's Cloud overlay.
5. Matching Pattern Recipe.
6. Canonical Example in shipped Cloud code.
7. Nearby shipped UI.
8. General interface heuristics.

Token values are prescriptive. Shipped Cloud code that disagrees with `tokens.json` is Drift.

## Coverage Gaps

If no overlay rule or recipe exists:

- Use current Cloud code and product-facing assets for the smallest safe choice.
- Say which guidance is missing.
- Do not invent a new recipe unless repeated drift proves the need.
- Do not block unrelated work because a recipe is missing.
