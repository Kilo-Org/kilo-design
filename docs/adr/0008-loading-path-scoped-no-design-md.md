# Loading design context: rules live only in the skill, triggered by file path, no per-repo DESIGN.md

Design rules live in **one place only — the skill** — and load on demand. No product repo keeps
a `DESIGN.md`. The old 390-line `DESIGN.md` is deleted and **not recreated** (not even as a tiny
"pointer" file): rules-in-repo-files attract growth, and that file — loaded by an always-on,
keyword-based AGENTS.md mandate — is exactly what polluted agent context (the "abuse-service
task pulled in design.md" failure).

Loading is governed by three layered levers, **none keyed on the word "design"**:

1. **Per-repo install scoping.** A repo installs only `kilo-design-core` + its product skill(s).
   An agent cannot load another product's rules because they are not present.
2. **Path-scoped trigger.** A single narrow line in the repo's *existing* AGENTS.md points to the
   skill when UI files are edited (e.g. `apps/web/src/**/*.tsx`, component/style dirs) — never on
   the keyword "design." This fixes both failure modes: backend tasks don't match (no
   over-loading, Roman), and real UI edits reliably match (no under-loading, Jean).
3. **Core router.** Within a repo it disambiguates (editor vs console; webview/jetbrains/cli) by
   file path and loads the smallest useful source (≤3 files, else stop and explain).

Plus a manual `/kilo-design` command for explicit use.

Deleted for good: the broad "whenever you touch UI/design, read DESIGN.md" mandate.
