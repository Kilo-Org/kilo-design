# Kilo Design

Canonical design source for Kilo products.

This repo starts intentionally small. It exists to keep design rules and tokens in one place while Cloud, Landing, and Kilocode keep their own implementation details.

## Files

| File | Purpose |
|---|---|
| `DESIGN.md` | Shared Kilo design language for humans and AI agents. |
| `products/cloud.md` | Cloud-specific application of the shared rules. |
| `products/landing.md` | Landing-site-specific application of the shared rules. |
| `products/editor.md` | Editor and agent-surface-specific application of the shared rules. |
| `tokens.json` | Machine-readable foundation values for colors, type, radius, and spacing. |

## Product Repos

Each product repo should keep a tiny local `DESIGN.md` entrypoint that points here and names the relevant product overlay. Product repos can have adapters and implementation details, but design rules should be promoted back to this repo.

Local checkout layout:

```txt
Development/
  kilo-design/
  kilo-cloud/
  kilo-landing/
  kilocode/
```

When this repo is published, product entrypoints can point at the GitHub URL or use a `.kilo/design` submodule.
