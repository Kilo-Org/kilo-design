import { spawn } from "node:child_process";
import { createReadStream, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const publicDir = path.join(__dirname, "public");
const runsDir = path.join(__dirname, "runs");
const port = Number(process.env.PORT || 8791);
const activeRounds = new Map();
const openStatuses = new Set(["queued", "running", "stopping"]);
const kiloRequiredRefs = [
  "skills/kilo-design-cloud/SKILL.md",
  "skills/kilo-design-cloud/overlay.md",
  "skills/kilo-design-cloud/reference/brand.md",
  "skills/kilo-design-cloud/reference/voice.md",
  "skills/kilo-design-cloud/reference/token-architecture.md",
  "src/tokens.cloud.ts"
];
const kiloRequiredUsageRoles = ["--background", "--foreground", "--card", "--primary", "--primary-foreground", "--border", "--ring"];
const kiloSemanticTokenMap = [
  ["--background", "--surface-background"],
  ["--foreground", "--foreground-default"],
  ["--card", "--surface-raised"],
  ["--popover", "--surface-overlay"],
  ["--muted", "--surface-inset"],
  ["--muted-foreground", "--foreground-muted"],
  ["--primary", "--brand-primary"],
  ["--primary-foreground", "--brand-foreground"],
  ["--border", "--border-default"],
  ["--input", "--border-inputBg"],
  ["--ring", "--brand-primaryRing"]
];
let cachedKiloSemanticTokens = null;

const conditions = [
  {
    id: "no-skill",
    label: "No skill",
    seedDir: "01-no-skill",
    isolated: true,
    execArgs: ["--ignore-user-config", "--ignore-rules"],
    instruction:
      "Baseline condition. Do not load, read, invoke, or follow any agent skill, repository skill source, token reference, design-system reference, or prior generated output. Use only the user's prompt and general UI judgment."
  },
  {
    id: "frontend-design",
    label: "frontend-design",
    seedDir: "02-frontend-design",
    execArgs: [],
    instruction:
      "Use the frontend-design skill only. Do not load the repository Kilo Cloud skill source or its references."
  },
  {
    id: "kilo-design-cloud",
    label: "kilo-design-cloud",
    seedDir: "03-kilo-design-cloud",
    execArgs: [],
    instruction:
      "Use the local Kilo Cloud skill source at skills/kilo-design-cloud/SKILL.md. This arena pass is standalone generated HTML with no target Cloud source file, so follow the skill's Standalone Generation Mode before designing. Load the overlay, brand, voice, token architecture, src/tokens.cloud.ts, and any matching interaction reference or pattern recipe. The output should read as Kilo Cloud product UI through semantic Cloud roles, exact Cloud token values, Kilo primary action color, compact dark-first infrastructure-console structure, and real Cloud product nouns; do not make a generic SaaS screen with only Kilo labels."
  }
];

function sendJson(res, status, data) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function ndjson(res, data) {
  res.write(`${JSON.stringify(data)}\n`);
}

function safeSegment(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createRoundId() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "z");
  return `round-${stamp.toLowerCase()}`;
}

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

function kiloSemanticTokens() {
  if (cachedKiloSemanticTokens) return cachedKiloSemanticTokens;

  const tokenArtifact = readFileSync(path.join(repoRoot, "src/tokens.cloud.ts"), "utf8");
  cachedKiloSemanticTokens = kiloSemanticTokenMap.map(([role, tokenVar]) => {
    const match = tokenArtifact.match(new RegExp(`"${escapeRegExp(tokenVar)}"\\s*:\\s*"([^"]+)"`));
    if (!match) throw new Error(`Missing ${tokenVar} in src/tokens.cloud.ts`);
    return { role, tokenVar, value: match[1] };
  });

  return cachedKiloSemanticTokens;
}

function kiloTokenPromptBlock() {
  return [
    "Required Kilo Cloud token aliases from src/tokens.cloud.ts:",
    "```css",
    ":root {",
    ...kiloSemanticTokens().map(({ role, tokenVar, value }) => `  ${role}: ${value}; /* ${tokenVar} */`),
    "}",
    "```"
  ].join("\n");
}

function auditKiloRun({ logText, outputText }) {
  const missingRefs = kiloRequiredRefs.filter((ref) => !logText.includes(ref));
  const tokens = kiloSemanticTokens();
  const missingDefinitions = tokens.filter(({ role, value }) => {
    const pattern = new RegExp(`${escapeRegExp(role)}\\s*:\\s*${escapeRegExp(value)}(?:\\s|;|$)`, "i");
    return !pattern.test(outputText);
  });
  const missingUsage = kiloRequiredUsageRoles.filter((role) => {
    const pattern = new RegExp(`var\\(\\s*${escapeRegExp(role)}\\s*\\)`, "i");
    return !pattern.test(outputText);
  });
  const ok = missingRefs.length === 0 && missingDefinitions.length === 0 && missingUsage.length === 0;

  return {
    ok,
    summary: {
      loadedRefs: kiloRequiredRefs.filter((ref) => !missingRefs.includes(ref)),
      missingRefs,
      missingDefinitions: missingDefinitions.map(({ role, tokenVar, value }) => `${role}=${value} (${tokenVar})`),
      missingUsage
    },
    logText: [
      "",
      "---",
      `Arena Kilo audit: ${ok ? "PASS" : "FAIL"}`,
      `Loaded required refs: ${kiloRequiredRefs.filter((ref) => !missingRefs.includes(ref)).join(", ") || "none"}`,
      `Missing required refs: ${missingRefs.join(", ") || "none"}`,
      `Missing token definitions: ${missingDefinitions.map(({ role, tokenVar, value }) => `${role}=${value} (${tokenVar})`).join(", ") || "none"}`,
      `Missing required var() usage: ${missingUsage.join(", ") || "none"}`
    ].join("\n")
  };
}

function runAudit(condition, logText, outputText) {
  if (condition.id !== "kilo-design-cloud") return { ok: true, summary: null, logText: "" };
  return auditKiloRun({ logText, outputText });
}

async function writeRound(round) {
  const roundDir = path.join(runsDir, safeSegment(round.storageId || round.id));
  const manifest = { ...round };
  delete manifest.storageId;
  await mkdir(roundDir, { recursive: true });
  round.updatedAt = new Date().toISOString();
  manifest.updatedAt = round.updatedAt;
  await writeFile(path.join(roundDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

function createRoundWriter(round) {
  let queue = Promise.resolve();

  return async (update) => {
    queue = queue.then(async () => {
      update();
      await writeRound(round);
    });
    return queue;
  };
}

function normalizeLegacyManifest(manifest) {
  if (manifest.prompt || manifest.conditions) return [{ ...manifest, storageId: manifest.id }];

  const prompts = manifest.prompts || {};
  return Object.entries(prompts).map(([scenarioId, prompt]) => {
    const roundConditions = {};
    const outputs = manifest.outputs?.[scenarioId] || {};

    for (const condition of conditions) {
      if (!outputs[condition.id]) continue;
      roundConditions[condition.id] = {
        status: "done",
        outputUrl: outputs[condition.id],
        logUrl: "",
        exitCode: 0
      };
    }

    return {
      id: `${manifest.id}-${scenarioId}`,
      label: `${manifest.label || manifest.id} / ${scenarioId}`,
      createdAt: manifest.createdAt,
      updatedAt: manifest.updatedAt || manifest.createdAt,
      source: manifest.source || "legacy",
      legacy: true,
      storageId: manifest.id,
      prompt,
      conditions: roundConditions
    };
  });
}

async function listRounds() {
  await mkdir(runsDir, { recursive: true });
  const entries = await readdir(runsDir, { withFileTypes: true });
  const rounds = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      rounds.push(...normalizeLegacyManifest(await readJson(path.join(runsDir, entry.name, "manifest.json"))));
    } catch {
      // Ignore incomplete run folders.
    }
  }

  return rounds.sort((a, b) => {
    const dateOrder = String(b.createdAt || b.updatedAt).localeCompare(String(a.createdAt || a.updatedAt));
    if (dateOrder !== 0) return dateOrder;

    const aComplete = conditions.filter((condition) => a.conditions?.[condition.id]?.status === "done").length;
    const bComplete = conditions.filter((condition) => b.conditions?.[condition.id]?.status === "done").length;
    return bComplete - aComplete;
  });
}

function publicConditions() {
  return conditions.map(({ id, label }) => ({ id, label }));
}

function hasOpenConditions(round) {
  return conditions.some((condition) => openStatuses.has(round.conditions?.[condition.id]?.status));
}

function markOpenConditionsStopped(round) {
  let changed = false;

  for (const condition of conditions) {
    const result = round.conditions?.[condition.id];
    if (!result || !openStatuses.has(result.status)) continue;
    round.conditions[condition.id] = {
      ...result,
      status: "stopped",
      outputUrl: "",
      finishedAt: new Date().toISOString(),
      message: "Generation stopped."
    };
    changed = true;
  }

  return changed;
}

async function reconcileStaleRunningRounds() {
  await mkdir(runsDir, { recursive: true });
  const entries = await readdir(runsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const manifestPath = path.join(runsDir, entry.name, "manifest.json");
    try {
      const manifest = await readJson(manifestPath);
      if (!manifest.conditions || !markOpenConditionsStopped(manifest)) continue;
      manifest.updatedAt = new Date().toISOString();
      await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    } catch {
      // Ignore incomplete or legacy folders that cannot be reconciled.
    }
  }
}

function buildCodexPrompt({ condition, prompt, outputFile }) {
  return [
    "Generate one self-contained static HTML file for the UI requested by the user.",
    "",
    `Condition: ${condition.label}`,
    condition.instruction,
    ...(condition.id === "kilo-design-cloud"
      ? [
          "",
          "Arena audit requirements for this Kilo condition:",
          `- Before writing output, read these exact files: ${kiloRequiredRefs.join(", ")}.`,
          "- The final run is audited. If those reads are missing from the log, the condition fails.",
          "- Define the semantic CSS aliases below exactly, using the values from src/tokens.cloud.ts.",
          "- Use var(...) references for the semantic aliases in the CSS. Do not only define them.",
          "",
          kiloTokenPromptBlock()
        ]
      : []),
    "",
    `Write exactly one file at this absolute path: ${outputFile}`,
    "Do not edit, create, delete, or inspect any other files except the skill/reference files and product token artifacts explicitly required by this condition.",
    "The HTML must be self-contained: include CSS in a <style> tag and avoid external assets.",
    "",
    "Hard output rules:",
    "- The rendered page must contain only the UI asked for in the user's prompt.",
    "- Do not include comparison UI, arena UI, condition labels, skill names, prompt text, rubrics, plan summaries, evaluation notes, progress notes, or generated-by text.",
    "- Do not add panels such as plan summary, evolution, rationale, checklist, notes, or next steps unless the user's prompt explicitly asks for that product UI.",
    "- Do not imitate or inspect outputs from other conditions in this round.",
    "- Do not ask questions.",
    "",
    "User prompt:",
    prompt
  ].join("\n");
}

function codexArgsFor(condition, cwd) {
  return [
    "exec",
    "--cd",
    cwd,
    ...(condition.isolated ? ["--skip-git-repo-check"] : []),
    "--sandbox",
    "workspace-write",
    "--color",
    "never",
    "--ephemeral",
    ...condition.execArgs,
    "-"
  ];
}

async function runCondition({ round, condition, prompt, res, updateRound }) {
  const outputDir = path.join(runsDir, round.id, condition.id);
  const outputFile = path.join(outputDir, "output.html");
  const logFile = path.join(outputDir, "log.txt");
  const outputUrl = `/runs/${round.id}/${condition.id}/output.html`;
  const logUrl = `/runs/${round.id}/${condition.id}/log.txt`;
  let childCwd = repoRoot;
  let promptOutputFile = outputFile;
  let isolatedRoot = "";
  let logText = "";
  const activeRound = activeRounds.get(round.id);

  await mkdir(outputDir, { recursive: true });

  if (condition.isolated) {
    isolatedRoot = await mkdtemp(path.join(tmpdir(), "arena-baseline-"));
    childCwd = isolatedRoot;
    promptOutputFile = path.join(isolatedRoot, "output.html");
  }

  if (activeRound?.stopped) {
    await writeFile(logFile, "Generation stopped before starting.\n", "utf8");
    if (condition.isolated) await rm(isolatedRoot, { recursive: true, force: true });
    await updateRound(() => {
      round.conditions[condition.id] = {
        ...round.conditions[condition.id],
        status: "stopped",
        outputUrl: "",
        logUrl,
        finishedAt: new Date().toISOString(),
        message: "Generation stopped."
      };
    });
    ndjson(res, { type: "condition-done", round, conditionId: condition.id });
    return;
  }

  await updateRound(() => {
    round.conditions[condition.id] = {
      status: "running",
      outputUrl,
      logUrl,
      startedAt: new Date().toISOString()
    };
  });
  ndjson(res, { type: "condition-start", round, conditionId: condition.id });

  const child = spawn("codex", codexArgsFor(condition, childCwd), {
    cwd: childCwd,
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env, FORCE_COLOR: "0" }
  });
  activeRound?.children.add(child);

  child.stdin.write(buildCodexPrompt({ condition, prompt, outputFile: promptOutputFile }));
  child.stdin.end();

  child.stdout.on("data", (chunk) => {
    logText += chunk.toString();
  });

  child.stderr.on("data", (chunk) => {
    logText += chunk.toString();
  });

  const code = await new Promise((resolve) => {
    child.on("error", (error) => {
      logText += `\n${error.message}\n`;
      resolve(1);
    });
    child.on("close", (exitCode) => {
      activeRound?.children.delete(child);
      resolve(exitCode);
    });
  });

  if (condition.isolated) {
    try {
      await copyFile(promptOutputFile, outputFile);
    } catch {
      // Missing output is handled by the existence check below.
    }
    await rm(isolatedRoot, { recursive: true, force: true });
  }

  let exists = false;
  try {
    exists = (await stat(outputFile)).isFile();
  } catch {
    exists = false;
  }

  const outputText = exists ? await readFile(outputFile, "utf8").catch(() => "") : "";
  const audit = runAudit(condition, logText, outputText);
  if (audit.logText) logText += `${audit.logText}\n`;
  await writeFile(logFile, logText, "utf8");

  await updateRound(() => {
    const stopped = activeRound?.stopped;
    const success = !stopped && code === 0 && exists && audit.ok;
    round.conditions[condition.id] = {
      ...round.conditions[condition.id],
      status: stopped ? "stopped" : success ? "done" : "failed",
      exitCode: code,
      outputUrl: stopped ? "" : exists ? outputUrl : "",
      logUrl,
      finishedAt: new Date().toISOString(),
      audit: audit.summary,
      message: stopped
        ? "Generation stopped."
        : !exists
          ? "Expected output file was not created."
          : !audit.ok
            ? "Kilo skill/token audit failed. Open log."
            : "Output file is ready."
    };
  });
  ndjson(res, { type: "condition-done", round, conditionId: condition.id });
}

async function parseJsonBody(req) {
  let body = "";
  for await (const chunk of req) body += chunk;
  return JSON.parse(body || "{}");
}

async function handleCreateRound(req, res) {
  let payload;
  try {
    payload = await parseJsonBody(req);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const prompt = String(payload.prompt || "").trim();
  if (!prompt) {
    sendJson(res, 400, { error: "Prompt is required." });
    return;
  }

  const round = {
    id: safeSegment(payload.roundId) || createRoundId(),
    label: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: "codex",
    prompt,
    conditions: Object.fromEntries(conditions.map((condition) => [condition.id, { status: "queued" }]))
  };
  round.label = round.id;
  await writeRound(round);

  res.writeHead(200, {
    "content-type": "application/x-ndjson; charset=utf-8",
    "cache-control": "no-store",
    "x-accel-buffering": "no"
  });

  ndjson(res, { type: "round-start", round });
  const updateRound = createRoundWriter(round);
  activeRounds.set(round.id, { children: new Set(), round, stopped: false, updateRound });

  try {
    await Promise.all(conditions.map((condition) => runCondition({ round, condition, prompt, res, updateRound })));
  } finally {
    activeRounds.delete(round.id);
  }

  ndjson(res, { type: "round-done", round });
  res.end();
}

async function handleStopRound(roundId, res) {
  const activeRound = activeRounds.get(roundId);
  if (!activeRound) {
    const staleRound = (await listRounds()).find((round) => round.id === roundId);
    if (!staleRound || !hasOpenConditions(staleRound)) {
      sendJson(res, 404, { error: "Round is not running." });
      return;
    }

    markOpenConditionsStopped(staleRound);
    await writeRound(staleRound);
    sendJson(res, 200, { round: staleRound });
    return;
  }

  activeRound.stopped = true;
  await activeRound.updateRound(() => {
    for (const condition of conditions) {
      const result = activeRound.round.conditions[condition.id];
      if (!result || result.status === "queued" || result.status === "running") {
        activeRound.round.conditions[condition.id] = {
          ...result,
          status: "stopping",
          message: "Stopping generation."
        };
      }
    }
  });

  for (const child of Array.from(activeRound.children)) {
    if (!child.killed) child.kill("SIGTERM");
    setTimeout(() => {
      if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    }, 2500).unref();
  }

  sendJson(res, 200, { round: activeRound.round });
}

async function handleDeleteRound(roundId, res) {
  if (activeRounds.has(roundId)) {
    sendJson(res, 409, { error: "Stop this round before deleting it." });
    return;
  }

  const rounds = await listRounds();
  const round = rounds.find((item) => item.id === roundId);
  if (!round) {
    sendJson(res, 404, { error: "Round not found." });
    return;
  }

  const storageId = safeSegment(round.storageId || round.id);
  if (!storageId) {
    sendJson(res, 400, { error: "Invalid round id." });
    return;
  }

  const deletedRoundIds = rounds
    .filter((item) => safeSegment(item.storageId || item.id) === storageId)
    .map((item) => item.id);
  await rm(path.join(runsDir, storageId), { recursive: true, force: true });
  sendJson(res, 200, { deletedRoundIds });
}

function contentType(filePath) {
  const ext = path.extname(filePath);
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".md") return "text/markdown; charset=utf-8";
  if (ext === ".txt") return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

async function serveFile(req, res, root, urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const relative = decoded.replace(/^\/+/, "");
  const target = path.resolve(root, relative || "index.html");
  const pathFromRoot = path.relative(root, target);

  if (pathFromRoot.startsWith("..") || path.isAbsolute(pathFromRoot)) {
    sendJson(res, 403, { error: "Forbidden." });
    return;
  }

  let filePath = target;
  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, "index.html");
  } catch {
    sendJson(res, 404, { error: "Not found." });
    return;
  }

  res.writeHead(200, { "content-type": contentType(filePath), "cache-control": "no-store" });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  createReadStream(filePath).pipe(res);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/api/state") {
    sendJson(res, 200, { conditions: publicConditions(), rounds: await listRounds() });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/rounds") {
    await handleCreateRound(req, res);
    return;
  }

  const stopRoundMatch = url.pathname.match(/^\/api\/rounds\/([^/]+)\/stop$/);
  if (req.method === "POST" && stopRoundMatch) {
    await handleStopRound(decodeURIComponent(stopRoundMatch[1]), res);
    return;
  }

  const deleteRoundMatch = url.pathname.match(/^\/api\/rounds\/([^/]+)$/);
  if (req.method === "DELETE" && deleteRoundMatch) {
    await handleDeleteRound(decodeURIComponent(deleteRoundMatch[1]), res);
    return;
  }

  if ((req.method === "GET" || req.method === "HEAD") && url.pathname.startsWith("/skill-comparison/")) {
    await serveFile(req, res, path.join(repoRoot, "skill-comparison"), url.pathname.replace("/skill-comparison/", ""));
    return;
  }

  if ((req.method === "GET" || req.method === "HEAD") && url.pathname.startsWith("/runs/")) {
    await serveFile(req, res, runsDir, url.pathname.replace("/runs/", ""));
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    await serveFile(req, res, publicDir, url.pathname);
    return;
  }

  sendJson(res, 405, { error: "Method not allowed." });
});

await reconcileStaleRunningRounds();

server.listen(port, "127.0.0.1", () => {
  console.log(`Skill Arena running at http://127.0.0.1:${port}`);
});
