// Read / write the CANONICAL tokens.json at the repo root.
// LOCAL DEV ONLY — refuses to run in production so this tool can never be a
// write surface on a deployed app.

import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const REPO_ROOT = path.resolve(process.cwd(), "..");
const TOKENS_PATH = path.join(REPO_ROOT, "tokens.json");
const BUILD_PATH = path.join(REPO_ROOT, "build");
const GENERATED_ARTIFACTS = ["src/tokens.web.css", "src/tokens.ts", "src/tokens.host-map.md"];

function guard() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "tokens.json write-back is disabled outside local development." },
      { status: 403 },
    );
  }
  return null;
}

export async function GET() {
  const blocked = guard();
  if (blocked) return blocked;
  try {
    const raw = await fs.readFile(TOKENS_PATH, "utf8");
    return NextResponse.json({ tokens: JSON.parse(raw), path: TOKENS_PATH });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not read tokens.json at ${TOKENS_PATH}: ${(err as Error).message}` },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const blocked = guard();
  if (blocked) return blocked;
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || !("tokens" in body)) {
      return NextResponse.json({ error: "Expected { tokens } in body." }, { status: 400 });
    }
    const json = JSON.stringify((body as { tokens: unknown }).tokens, null, 2) + "\n";
    await fs.writeFile(TOKENS_PATH, json, "utf8");
    return NextResponse.json({ ok: true, path: TOKENS_PATH, bytes: json.length });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not write tokens.json: ${(err as Error).message}` },
      { status: 500 },
    );
  }
}

export async function POST() {
  const blocked = guard();
  if (blocked) return blocked;

  try {
    await execFileAsync(process.execPath, [BUILD_PATH], { cwd: REPO_ROOT, maxBuffer: 1024 * 1024 });
    return NextResponse.json({
      ok: true,
      generated: GENERATED_ARTIFACTS,
    });
  } catch (err) {
    const error = err as Error & { stderr?: string; stdout?: string };
    const details = [error.stderr, error.stdout, error.message].filter(Boolean).join("\n").trim();
    return NextResponse.json(
      { error: `Could not generate token artifacts: ${details}` },
      { status: 500 },
    );
  }
}
