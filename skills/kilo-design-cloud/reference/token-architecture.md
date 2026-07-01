# Token Architecture

The design-system core for products is the token source and generated artifacts, not this skill.

## Layers

1. `tokens.json` stores raw/source values.
2. `src/tokens.web.css`, `src/tokens.cloud.ts`, and `src/tokens.editor-host-map.md` expose values per target.
3. Cloud maps generated values to semantic UI roles in `apps/web/src/app/globals.css`.
4. Recipes tell agents which semantic roles to use for repeated Cloud patterns.
5. Component tokens wait until repeated drift proves they are needed.

The playground sits outside this product-consumption path. It previews and edits token values, but Cloud implementation decisions still come from Cloud code, semantic roles, and recipes.

## Agent Rules

- Prefer semantic roles over raw values in Cloud code.
- Do not hardcode hex unless the task explicitly accepts legacy debt.
- Do not rename token concepts for local convenience.
- Do not add component tokens before repeated drift proves the need.
- Treat primitive or semantic value changes as high risk.

## Naming Discipline

| Prefer | Avoid |
| --- | --- |
| primary action | yellow button |
| muted foreground | gray text |
| raised surface | dark card |
| danger feedback | red alert |
| focus ring | green glow |
