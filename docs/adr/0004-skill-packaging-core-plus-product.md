# Skill packaging: a shared Core Skill + thin Product Skills, composed by convention

Status: Superseded by ADR 0011 for the Cloud pilot. The shared-core concept is deferred; the first shipped runtime skill is `kilo-design-cloud`.

The design guidance ships as **multiple skills published from the one `kilo-design` repo**
(the same way `cloudflare/skills` exposes `durable-objects`, `wrangler`, … from one repo):

- **`kilo-design-core`** — brand language, voice, token meaning, and the context-router rules.
  Installed by anyone doing Kilo UI.
- **`kilo-design-cloud` / `-editor` / `-landing` / `-mobile`** — each is small: that product's
  overlay + its pattern recipes. Each `SKILL.md` opens with "load `kilo-design-core` first."

Teams install only what they need (e.g. the editor team installs `kilo-design-core` +
`kilo-design-editor`), which matches Kilo's team structure and the existing per-skill,
hash-locked install model in `skills-lock.json`.

Why not one skill with overlays (option B): teams wanted to install only their surface. Why
"compose by convention" and not a generated single bundle (C1): the skill tool has **no native
composition** (`skills-lock.json` is a flat `{source, hash}` list with no `extends`), so the
choices were duplicate-the-core (drift — rejected), generate self-contained bundles (needs a
skill-assembly pipeline + couples everyone's version), or publish the core as its own
installable skill that product skills tell the agent to load first. The last keeps the core
authored *and installed* exactly once, lets it version independently, and adds no build step
beyond the token generator. The cost — two installs per team and a "load core first" line that
is convention rather than tool-enforced — is acceptable because that is already how `SKILL.md`
routing works.
