# Skill Arena

Local mini app for rerunning one UI prompt across three generation conditions.

Run:

```bash
node skill-arena/server.mjs
```

Then open:

```text
http://127.0.0.1:8791
```

There is also a root script:

```bash
pnpm run skill-arena
```

On this machine, `pnpm` currently stops on the existing `sharp` build approval guard before running workspace scripts. Use the direct `node skill-arena/server.mjs` command above, or run `pnpm approve-builds` before using the script.

## Workflow

1. Write or edit the bottom prompt.
2. Click `Regenerate`.
3. The app creates one new round.
4. The round runs the same prompt through no skill, the generic frontend skill, and the Kilo Cloud skill in parallel.
5. Use `Stop` to terminate the active round when a pass is going in the wrong direction.
6. Each condition writes its output and log under `runs/`.

Rounds are stacked newest first. Partial, stopped, or failed conditions stay visible in the round. `Delete` removes the whole round stack and its generated files.

Generated rounds are committed as evaluation history. Pulling the repo and running the app will show the committed rounds that still exist under `runs/`.

## Output Convention

The app writes this shape:

```text
skill-arena/runs/<round-id>/<condition>/output.html
skill-arena/runs/<round-id>/<condition>/log.txt
```

Example:

```text
skill-arena/runs/round-20260702T011500z/kilo-design-cloud/output.html
```

## Conditions

- `no-skill`: baseline prompt from an empty temp cwd, with extra isolation flags and explicit no-skill instructions.
- `frontend-design`: generic frontend design skill.
- `kilo-design-cloud`: Cloud pilot skill source at `skills/kilo-design-cloud/SKILL.md`, using the skill's standalone generation mode because arena outputs are self-contained HTML rather than edits to real Cloud source files.

The `kilo-design-cloud` condition has a post-run audit. It must show reads for the Cloud skill, required references, and `src/tokens.cloud.ts`; its output must define and use the expected semantic token aliases. If the audit fails, the condition is marked failed while keeping the generated HTML and log visible for inspection.
