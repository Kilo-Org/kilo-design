# Kilo Cloud Skill Comparison

Static comparison playground for testing the same Cloud UI prompts under three conditions:

1. `01-no-skill`: baseline output with no design skill.
2. `02-frontend-design`: output shaped by the generic `frontend-design` skill.
3. `03-kilo-design-cloud`: output shaped by `skills/kilo-design-cloud`.

Open `index.html` in a browser to compare the generated HTML files side by side.

## Prompts

Each condition uses the same three prompts:

- Dashboard: `Design a Kilo Cloud workspace usage dashboard. Build in an HTML file. Ask no questions.`
- Agent thread: `Design a Kilo Cloud agent session thread interface. Build in an HTML file. Ask no questions.`
- Settings: `Design a Kilo Cloud workspace settings page with tabs and a primary action. Build in an HTML file. Ask no questions.`

The current files are first-pass static specimens. They can be replaced by true isolated agent runs later without changing the gallery structure.
