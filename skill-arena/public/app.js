const state = {
  conditions: [],
  rounds: [],
  running: false,
  activeRoundId: "",
  draftPrompt: "Design a Kilo Cloud login page."
};

const el = (id) => document.getElementById(id);
let pollTimer = 0;
let pollInFlight = false;

async function api(path, options) {
  const response = await fetch(path, options);
  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    throw new Error(details.error || `${response.status} ${response.statusText}`);
  }
  return response;
}

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

function conditionState(round, conditionId) {
  return round.conditions?.[conditionId] || { status: "missing" };
}

function statusLabel(status) {
  if (status === "done") return "done";
  if (status === "running") return "running";
  if (status === "failed") return "failed";
  if (status === "queued") return "queued";
  if (status === "stopping") return "stopping";
  if (status === "stopped") return "stopped";
  return "missing";
}

function setComposerStatus(text) {
  el("composerStatus").textContent = text;
}

function isRoundActive(round) {
  return state.conditions.some((condition) => {
    const status = conditionState(round, condition.id).status;
    return status === "queued" || status === "running" || status === "stopping";
  });
}

function setGenerationControls() {
  el("regenerate").disabled = state.running;
  el("stopGeneration").disabled = !state.activeRoundId;
}

function syncActiveRoundFromState() {
  const activeRound = state.rounds.find((round) => isRoundActive(round));
  state.activeRoundId = activeRound?.id || "";
  state.running = Boolean(activeRound);
  setGenerationControls();
  if (activeRound && !el("composerStatus").textContent) setComposerStatus("running");
}

function stopStatePolling() {
  if (!pollTimer) return;
  window.clearInterval(pollTimer);
  pollTimer = 0;
}

function startStatePolling() {
  if (pollTimer) return;
  pollTimer = window.setInterval(async () => {
    if (!state.running && !state.activeRoundId) {
      stopStatePolling();
      return;
    }
    if (pollInFlight) return;

    pollInFlight = true;
    try {
      await loadState();
      if (!state.activeRoundId) {
        setComposerStatus("done");
        stopStatePolling();
      }
    } catch {
      // Keep the stream path authoritative; polling is only a recovery path.
    } finally {
      pollInFlight = false;
    }
  }, 5000);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function outputCard(round, condition) {
  const result = conditionState(round, condition.id);
  const hasOutput = Boolean(result.outputUrl);
  const emptyText = result.status === "missing" ? "" : statusLabel(result.status);
  const cacheKey = encodeURIComponent(round.updatedAt || round.createdAt || round.id);
  const frameUrl = hasOutput ? `${result.outputUrl}?v=${cacheKey}` : "";
  const frame = hasOutput
    ? `<iframe src="${escapeHtml(frameUrl)}" loading="lazy"></iframe>`
    : `<div class="empty-output">${escapeHtml(emptyText)}</div>`;
  const previewButton = hasOutput
    ? `<button class="output-preview" type="button" data-preview-url="${escapeHtml(frameUrl)}" data-preview-title="${escapeHtml(condition.label)}" data-preview-status="${escapeHtml(statusLabel(result.status))}">Preview</button>`
    : "";
  const logLink = result.logUrl ? `<a href="${escapeHtml(result.logUrl)}" target="_blank">log</a>` : "";

  return `
    <article class="output-card ${escapeHtml(result.status)}">
      <div class="output-head">
        <div class="output-title">
          <strong>${escapeHtml(condition.label)}</strong>
          <span>${escapeHtml(statusLabel(result.status))}</span>
        </div>
        <div class="output-actions">
          ${previewButton}
          ${logLink}
        </div>
      </div>
      <div class="frame-wrap">${frame}</div>
    </article>
  `;
}

function renderRounds() {
  const list = el("roundList");

  if (!state.rounds.length) {
    list.innerHTML = `<section class="empty-round">No rounds yet.</section>`;
    return;
  }

  list.innerHTML = state.rounds
    .map((round) => {
      const active = isRoundActive(round);
      return `
      <section class="round" data-round="${escapeHtml(round.id)}">
        <div class="round-head">
          <div class="round-meta">
            <time>${formatTime(round.createdAt)}</time>
            <span>${escapeHtml(round.id)}</span>
          </div>
          <button class="round-delete" type="button" data-delete-round="${escapeHtml(round.id)}" ${active ? "disabled" : ""}>Delete</button>
        </div>
        <p class="round-prompt">${escapeHtml(round.prompt)}</p>
        <div class="outputs">
          ${state.conditions.map((condition) => outputCard(round, condition)).join("")}
        </div>
      </section>
    `;
    })
    .join("");
}

function openPreview({ url, title, status }) {
  el("previewTitle").textContent = title;
  el("previewStatus").textContent = status;
  el("previewFrame").src = url;
  el("previewPage").href = url;
  el("preview").hidden = false;
  document.body.classList.add("preview-open");
}

function closePreview() {
  el("preview").hidden = true;
  el("previewFrame").src = "about:blank";
  document.body.classList.remove("preview-open");
}

async function loadState() {
  const response = await api("/api/state");
  const data = await response.json();
  state.conditions = data.conditions;
  state.rounds = data.rounds;
  renderRounds();
  syncActiveRoundFromState();
}

function upsertRound(round) {
  const index = state.rounds.findIndex((item) => item.id === round.id);
  if (index >= 0) {
    state.rounds[index] = round;
  } else {
    state.rounds.unshift(round);
  }
  state.rounds.sort((a, b) => String(b.createdAt || b.updatedAt).localeCompare(String(a.createdAt || a.updatedAt)));
}

function handleRoundEvent(event) {
  if (event.round) {
    upsertRound(event.round);
    renderRounds();
  }
  if (event.type === "round-start") {
    state.activeRoundId = event.round.id;
    state.running = true;
    setGenerationControls();
    startStatePolling();
  }
  if (event.type === "condition-start") {
    const condition = state.conditions.find((item) => item.id === event.conditionId);
    setComposerStatus(condition ? condition.label : "running");
  }
  if (event.type === "round-done") {
    state.activeRoundId = "";
    state.running = false;
    setGenerationControls();
    stopStatePolling();
  }
}

function processEventLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return;
  handleRoundEvent(JSON.parse(trimmed));
}

async function createRound(prompt) {
  const response = await api("/api/rounds", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      processEventLine(line);
    }
  }

  buffer += decoder.decode();
  processEventLine(buffer);
  await loadState();
}

el("promptInput").value = state.draftPrompt;

el("composer").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (state.running) return;

  const prompt = el("promptInput").value.trim();
  if (!prompt) {
    setComposerStatus("prompt required");
    return;
  }

  state.running = true;
  state.activeRoundId = "";
  setGenerationControls();
  setComposerStatus("running");

  try {
    await createRound(prompt);
    setComposerStatus("done");
  } catch (error) {
    setComposerStatus(error.message);
  } finally {
    await loadState().catch(() => {
      state.running = false;
      state.activeRoundId = "";
      setGenerationControls();
      stopStatePolling();
    });
    if (!state.activeRoundId) {
      state.running = false;
      setGenerationControls();
      stopStatePolling();
    }
  }
});

el("stopGeneration").addEventListener("click", async () => {
  const roundId = state.activeRoundId;
  if (!roundId) return;

  el("stopGeneration").disabled = true;
  setComposerStatus("stopping");

  try {
    const response = await api(`/api/rounds/${encodeURIComponent(roundId)}/stop`, { method: "POST" });
    const data = await response.json();
    if (data.round) {
      upsertRound(data.round);
      renderRounds();
    }
  } catch (error) {
    setComposerStatus(error.message);
    syncActiveRoundFromState();
  }
});

el("roundList").addEventListener("click", async (event) => {
  const deleteButton = event.target.closest("[data-delete-round]");
  if (deleteButton) {
    const roundId = deleteButton.dataset.deleteRound;
    const round = state.rounds.find((item) => item.id === roundId);
    if (!round || isRoundActive(round)) return;
    if (!window.confirm("Delete this round stack?")) return;

    deleteButton.disabled = true;
    try {
      const response = await api(`/api/rounds/${encodeURIComponent(roundId)}`, { method: "DELETE" });
      const data = await response.json();
      const deletedRoundIds = new Set(data.deletedRoundIds || [roundId]);
      state.rounds = state.rounds.filter((item) => !deletedRoundIds.has(item.id));
      if (deletedRoundIds.has(state.activeRoundId)) state.activeRoundId = "";
      renderRounds();
      setGenerationControls();
      if (!el("preview").hidden) closePreview();
    } catch (error) {
      deleteButton.disabled = false;
      setComposerStatus(error.message);
    }
    return;
  }

  const button = event.target.closest("[data-preview-url]");
  if (!button) return;
  openPreview({
    url: button.dataset.previewUrl,
    title: button.dataset.previewTitle,
    status: button.dataset.previewStatus
  });
});

el("previewClose").addEventListener("click", closePreview);

el("preview").addEventListener("click", (event) => {
  if (event.target === el("preview")) closePreview();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !el("preview").hidden) closePreview();
});

loadState().catch((error) => {
  setComposerStatus(error.message);
});
