# Skill Arena

Local mini app for rerunning one UI prompt across several generation conditions.

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
4. The round runs the same prompt through every enabled condition in parallel.
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
skill-arena/runs/round-20260702T011500z/no-skill/output.html
```

## Conditions

- `no-skill`: baseline prompt from an empty temp cwd, with extra isolation flags and explicit no-skill instructions.
- `frontend-design`: generic frontend design skill.
- `kilo-design`: switched off. The Cloud pilot skill it ran was removed, and a new skill will be written once the design language is settled. The condition and its post-run audit are still in `server.mjs` behind `disabled: true`; older rounds keep their `kilo-design` output on disk, but the app does not show that column while the condition is off.
