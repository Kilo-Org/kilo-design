# Cloud Web Pattern: Primary Actions

Pattern ID: `cloud-web.primary-actions`

## When To Use

Use this recipe when a Cloud surface has a main CTA, button hierarchy, primary button drift, or hardcoded blue button background.

## Rule

Each surface gets one primary action. It uses the semantic primary action role, not a color name. Secondary choices use secondary, outline, ghost, destructive, or link variants.

## Canonical Example

Real code to copy:

- `apps/web/src/components/ui/button.tsx`
- `Button` default variant: `bg-primary text-primary-foreground shadow hover:bg-primary/90`

Do not copy the current `variant="primary"` implementation in the same file. It is hardcoded blue drift and is tracked for migration.

## Implementation Rules

- Use `<Button>` with the default variant for the primary action.
- Use `variant="secondary"`, `variant="outline"`, `variant="ghost"`, or `variant="link"` for lower-emphasis actions.
- Use `variant="destructive"` only for destructive actions.
- Do not create new color variants for one-off product needs.
- Do not use blue backgrounds for CTAs. Blue is acceptable for inline links and legacy drift only.
- Keep labels specific: `Create workspace`, `Save changes`, `Delete project`.
- Include disabled, loading, focus-visible, and responsive behavior when the surrounding component owns those states.

## Review Checklist

- Is there only one primary action in the visible decision area?
- Does the primary action use semantic `primary` tokens?
- Are secondary actions visually subordinate?
- Are hardcoded blue CTA fills removed or explicitly called out as drift?
- Does the label name the action and object?

## Known Drift

- `apps/web/src/components/ui/button.tsx` still has a blue `primary` variant.
- `apps/web/src/components/Button.tsx` has legacy color variants.
- Cloud token adoption in `globals.css` is tracked separately by `VVV-130`.
