# Kilo Editor Design

Editor covers the VS Code extension, JetBrains plugin, Agent Manager, sidebar chat, and CLI-adjacent UI surfaces.

## Intent

Editor UI should feel native to the host environment while still carrying Kilo's product language. It should be compact, responsive, and optimized for long working sessions.

## Product Rules

1. Respect host chrome. VS Code and JetBrains surfaces may need to adapt to host theme variables and interaction conventions.
2. Use Kilo yellow sparingly for primary actions, focus, live agent state, and earned brand moments.
3. Agent and terminal surfaces can use mono, streaming affordances, and restrained brand glow.
4. Agent Manager uses the shared system but may use the assigned orange status/product color for Agent Manager domain labeling.
5. Chat and review flows should prioritize readability, diff clarity, and action safety over decoration.
6. Prefer shared `@kilocode/kilo-ui` components where available in Kilocode. Product-specific CSS should be promoted into the shared UI package when it becomes reusable.

## Layout

- Sidebars should stay dense and keyboard-friendly.
- Editor panels can use split panes, tabs, and virtualized lists.
- Controls should remain compact, with stable sizes that do not shift during streaming or loading.
- Diff and review surfaces should preserve line-level precision and avoid visual noise.

## Copy

Use direct labels for actions. Make permission, apply, revert, and destructive flows explicit.
