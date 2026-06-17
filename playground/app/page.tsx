import { promises as fs } from "node:fs";
import path from "node:path";
import { Tokens } from "@/lib/tokens";
import { PlaygroundClient } from "./PlaygroundClient";

// Always read the canonical source fresh (no static caching of the file).
export const dynamic = "force-dynamic";

async function readTokens(): Promise<Tokens> {
  const tokensPath = path.resolve(process.cwd(), "..", "tokens.json");
  const raw = await fs.readFile(tokensPath, "utf8");
  return JSON.parse(raw) as Tokens;
}

export default async function Page() {
  const tokens = await readTokens();
  return <PlaygroundClient initialTokens={tokens} />;
}
