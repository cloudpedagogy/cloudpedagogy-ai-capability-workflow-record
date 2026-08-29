/* CloudPedagogy AI Capability Workflow Record
   Static, vanilla JS, offline-first (localStorage), no build step.

   Exercise sources (merged):
   - Bundled (default): /exercises/index.json + exercise files (fetch, cache)
   - Imported: via file upload, stored in localStorage
   - Built-in fallback: (disabled for your current minimal build)
*/

const APP_VERSION = "0.1.1";
const STORAGE_KEY = "ai_capability_studio_v011_projects";
const IMPORTED_EXERCISES_KEY = "ai_capability_studio_v011_imported_exercises";
const BUNDLED_INDEX_URL = "./exercises/index.json";

/** ---------------------------
 *  Built-in fallback exercises
 *  (MINIMAL BUILD: none)
 *  --------------------------*/
const BUILTIN_EXERCISES = [];

/** Minimal build labels kept (UI may still show these if imported later) */
const TEMPLATE_LABELS = {
  structured_workflow: "Structured Workflow",
  reflection_deck: "Reflection Deck",
  prompt_library: "Prompt Library"
};

/** ---------------------------
 *  Exercise Runtime State
 *  --------------------------*/
let BUNDLED_INDEX = []; // [{id,title,template,version,tags,file}]
let EXERCISE_CACHE = new Map(); // id -> full exercise object (bundled/imported/builtin)
let IMPORTED_EXERCISES = []; // full objects

let EXERCISE_SOURCE_STATUS = {
  bundledLoaded: false,
  bundledError: "",
  importedCount: 0,
  builtinCount: BUILTIN_EXERCISES.length
};

/** ---------------------------
 *  Store (projects)
 *  --------------------------*/
function loadProjectStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { app_version: APP_VERSION, projects: [] };
    const parsed = JSON.parse(raw);
    if (!parsed.projects) return { app_version: APP_VERSION, projects: [] };
    return parsed;
  } catch {
    return { app_version: APP_VERSION, projects: [] };
  }
}
function saveProjectStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
function nowISO() {
  return new Date().toISOString();
}
function uid() {
  return "p_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

/** ---------------------------
 *  Imported Exercises persistence
 *  --------------------------*/
function loadImportedExercises() {
  try {
    const raw = localStorage.getItem(IMPORTED_EXERCISES_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch {
    return [];
  }
}
function saveImportedExercises(arr) {
  localStorage.setItem(IMPORTED_EXERCISES_KEY, JSON.stringify(arr));
}

/** ---------------------------
 *  Fetch Bundled Exercises
 *  --------------------------*/
async function fetchExercisesIndex() {
  const res = await fetch(BUNDLED_INDEX_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load index.json (${res.status})`);
  const data = await res.json();
  if (!data || !Array.isArray(data.exercises)) throw new Error("Invalid index.json: missing exercises[]");
  return data.exercises;
}

async function fetchExerciseById(id) {
  // 1) cache
  if (EXERCISE_CACHE.has(id)) return EXERCISE_CACHE.get(id);

  // 2) imported
  const imp = IMPORTED_EXERCISES.find(x => x?.id === id);
  if (imp) {
    EXERCISE_CACHE.set(id, imp);
    return imp;
  }

  // 3) bundled via index
  const meta = BUNDLED_INDEX.find(x => x.id === id);
  if (meta?.file) {
    const res = await fetch(meta.file, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load exercise file (${res.status})`);
    const ex = await res.json();
    validateExerciseMinimal(ex);

    // Merge meta essentials if missing
    ex.title = ex.title || meta.title;
    ex.template = ex.template || meta.template;
    ex.version = ex.version || meta.version || "1.0";
    ex.tags = ex.tags || meta.tags || [];

    EXERCISE_CACHE.set(id, ex);
    return ex;
  }

  // 4) built-in fallback (disabled)
  const builtin = BUILTIN_EXERCISES.find(x => x.id === id);
  if (builtin) {
    EXERCISE_CACHE.set(id, builtin);
    return builtin;
  }

  throw new Error("Exercise not found");
}

/** ---------------------------
 *  Minimal validator (runtime)
 *  Supports:
 *   - structured_workflow (framework-style OR legacy demo-style)
 *  --------------------------*/
function validateExerciseMinimal(ex) {
  if (!ex || typeof ex !== "object") throw new Error("Exercise is not an object");
  if (!ex.id || typeof ex.id !== "string") throw new Error("Exercise missing id");
  if (!ex.template || typeof ex.template !== "string") throw new Error("Exercise missing template");

  const t = ex.template;
  if (!["structured_workflow", "reflection_deck", "prompt_library"].includes(t)) {
    throw new Error(`Unsupported template: ${t}`);
  }

  if (t === "structured_workflow") {
    if (!Array.isArray(ex.steps)) throw new Error("structured_workflow missing steps[]");

    // Framework-style: steps have step_id
    const isFramework = ex.steps.some(s => s && typeof s === "object" && typeof s.step_id === "string");
    // Legacy-style: steps have id
    const isLegacy = ex.steps.some(s => s && typeof s === "object" && typeof s.id === "string");

    if (!isFramework && !isLegacy) {
      throw new Error("structured_workflow steps must include either step_id (framework) or id (legacy)");
    }

    // v1.0 schema expectation: guardrails is top-level array (allow missing for legacy imports)
    if (ex.guardrails !== undefined && !Array.isArray(ex.guardrails)) {
      throw new Error("structured_workflow guardrails must be an array if provided");
    }
  }

  // Minimal build: we don't need these, but keep permissive
  if (t === "reflection_deck") {
    if (!Array.isArray(ex.cards)) throw new Error("reflection_deck missing cards[]");
  }
  if (t === "prompt_library") {
    if (!Array.isArray(ex.items)) throw new Error("prompt_library missing items[]");
  }
}

/** ---------------------------
 *  Exercise Registry for picker
 *  --------------------------*/
function buildExerciseRegistryList() {
  const seen = new Set();
  const out = [];

  // Bundled meta
  for (const m of BUNDLED_INDEX) {
    if (!m?.id || seen.has(m.id)) continue;
    out.push({
      id: m.id,
      title: m.title || m.id,
      template: m.template || "structured_workflow",
      version: m.version || "1.0",
      tags: m.tags || [],
      source: "bundled"
    });
    seen.add(m.id);
  }

  // Imported (full)
  for (const ex of IMPORTED_EXERCISES) {
    if (!ex?.id || seen.has(ex.id)) continue;
    out.push({
      id: ex.id,
      title: ex.title || ex.id,
      template: ex.template,
      version: ex.version || "1.0",
      tags: ex.tags || [],
      source: "imported"
    });
    seen.add(ex.id);
  }

  // Built-in fallback (disabled)
  for (const ex of BUILTIN_EXERCISES) {
    if (!ex?.id || seen.has(ex.id)) continue;
    out.push({
      id: ex.id,
      title: ex.title || ex.id,
      template: ex.template,
      version: ex.version || "1.0",
      tags: ex.tags || [],
      source: "builtin"
    });
    seen.add(ex.id);
  }

  return out;
}

/** ---------------------------
 *  App State
 *  --------------------------*/
let STORE = loadProjectStore();
let ACTIVE_PROJECT_ID = null;

/** ---------------------------
 *  DOM
 *  --------------------------*/
const el = (id) => document.getElementById(id);

const viewDashboard = el("viewDashboard");
const viewRunner = el("viewRunner");
const projectGrid = el("projectGrid");
const emptyState = el("emptyState");
const projectSearch = el("projectSearch");
const exerciseSourceStatus = el("exerciseSourceStatus");

const btnNewProject = el("btnNewProject");
const btnNewProjectEmpty = el("btnNewProjectEmpty");

const btnImportExercise = el("btnImportExercise");
const fileExerciseImport = el("fileExerciseImport");

const modalBackdrop = el("modalBackdrop");
const modalNewProject = el("modalNewProject");
const btnCloseModal = el("btnCloseModal");
const btnCancelModal = el("btnCancelModal");
const btnCreateProject = el("btnCreateProject");
const newProjectName = el("newProjectName");
const newProjectTemplate = el("newProjectTemplate");
const newProjectExercise = el("newProjectExercise");

const modalRenameBackdrop = el("modalRenameBackdrop");
const modalRenameProject = el("modalRenameProject");
const btnCloseRenameModal = el("btnCloseRenameModal");
const btnCancelRenameModal = el("btnCancelRenameModal");
const btnSaveRename = el("btnSaveRename");
const renameProjectName = el("renameProjectName");

const btnBackToDashboard = el("btnBackToDashboard");
const runnerProjectTitle = el("runnerProjectTitle");
const runnerProjectSub = el("runnerProjectSub");
const runnerBody = el("runnerBody");
const btnExportMD = el("btnExportMD");
const btnExportJSON = el("btnExportJSON");

/** ---------------------------
 *  Init
 *  --------------------------*/
async function init() {
  wireEvents();

  // Load imported exercises
  IMPORTED_EXERCISES = loadImportedExercises();
  EXERCISE_SOURCE_STATUS.importedCount = IMPORTED_EXERCISES.length;

  // Pre-seed cache
  for (const ex of IMPORTED_EXERCISES) EXERCISE_CACHE.set(ex.id, ex);

  // Attempt to load bundled index (may fail on file://)
  try {
    BUNDLED_INDEX = await fetchExercisesIndex();
    EXERCISE_SOURCE_STATUS.bundledLoaded = true;
  } catch (err) {
    EXERCISE_SOURCE_STATUS.bundledLoaded = false;
    EXERCISE_SOURCE_STATUS.bundledError = String(err?.message || err);
  }

  populateExercisePickers();
  renderDashboard();
}

function wireEvents() {
  btnNewProject.addEventListener("click", openNewProjectModal);
  btnNewProjectEmpty.addEventListener("click", openNewProjectModal);

  btnCloseModal.addEventListener("click", closeNewProjectModal);
  btnCancelModal.addEventListener("click", closeNewProjectModal);
  modalBackdrop.addEventListener("click", closeNewProjectModal);

  newProjectTemplate.addEventListener("change", () => {
    populateExercisePickerForTemplate(newProjectTemplate.value);
  });

  // Rename Modal
  btnCloseRenameModal.addEventListener("click", closeRenameProjectModal);
  btnCancelRenameModal.addEventListener("click", closeRenameProjectModal);
  modalRenameBackdrop.addEventListener("click", closeRenameProjectModal);
  btnSaveRename.addEventListener("click", saveRenameProject);
  renameProjectName.addEventListener("keyup", (e) => {
    if (e.key === "Enter") saveRenameProject();
  });

  btnCreateProject.addEventListener("click", async () => {
    const name = newProjectName.value.trim();
    if (!name) return alert("Please enter a project name.");

    const exerciseId = newProjectExercise.value;
    const exMeta = findExerciseMeta(exerciseId);
    if (!exMeta) return alert("Please choose an exercise.");

    const project = createProjectFromExerciseMeta(name, exMeta);

    STORE.projects.unshift(project);
    STORE.app_version = APP_VERSION;
    saveProjectStore(STORE);

    closeNewProjectModal();
    await openProject(project.id);
  });

  projectSearch.addEventListener("input", renderDashboard);

  btnBackToDashboard.addEventListener("click", () => {
    ACTIVE_PROJECT_ID = null;
    showDashboard();
  });

  btnExportMD.addEventListener("click", async () => {
    const p = getActiveProject();
    if (!p) return;
    const md = await buildMarkdownRecord(p);
    downloadTextFile(`${safeFilename(p.name)}.md`, md, "text/markdown");
  });

  btnExportJSON.addEventListener("click", () => {
    const p = getActiveProject();
    if (!p) return;
    downloadTextFile(`${safeFilename(p.name)}.json`, JSON.stringify(p, null, 2), "application/json");
  });

  // Import Exercise JSON
  btnImportExercise.addEventListener("click", () => {
    fileExerciseImport.value = "";
    fileExerciseImport.click();
  });

  fileExerciseImport.addEventListener("change", async () => {
    const file = fileExerciseImport.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const ex = JSON.parse(text);
      validateExerciseMinimal(ex);

      // replace existing imported with same id
      IMPORTED_EXERCISES = IMPORTED_EXERCISES.filter(x => x?.id !== ex.id);
      IMPORTED_EXERCISES.unshift(ex);
      saveImportedExercises(IMPORTED_EXERCISES);

      EXERCISE_SOURCE_STATUS.importedCount = IMPORTED_EXERCISES.length;
      EXERCISE_CACHE.set(ex.id, ex);

      populateExercisePickers();
      renderDashboard();
      alert(`Imported exercise: ${ex.title || ex.id}`);
    } catch (err) {
      alert(`Import failed: ${String(err?.message || err)}`);
    }
  });
}

/** ---------------------------
 *  Picker population
 *  --------------------------*/
function populateExercisePickers() {
  const registry = buildExerciseRegistryList();
  const templates = [...new Set(registry.map(e => e.template))];

  newProjectTemplate.innerHTML = templates
    .map(t => `<option value="${t}">${TEMPLATE_LABELS[t] || t}</option>`)
    .join("");

  const firstTemplate = newProjectTemplate.value || templates[0] || "structured_workflow";
  newProjectTemplate.value = firstTemplate;
  populateExercisePickerForTemplate(firstTemplate);

  renderExerciseSourceStatus(registry);
}

function renderExerciseSourceStatus(registry) {
  const bundledTxt = EXERCISE_SOURCE_STATUS.bundledLoaded
    ? "Bundled: Available"
    : `Bundled: Unavailable (${EXERCISE_SOURCE_STATUS.bundledError || "local mode"})`;

  const importedTxt = `Imported: ${EXERCISE_SOURCE_STATUS.importedCount}`;
  const builtinTxt = `Built-in: ${EXERCISE_SOURCE_STATUS.builtinCount}`;
  const totalTxt = `Total: ${registry.length}`;

  exerciseSourceStatus.innerHTML = `<div class="marker">${bundledTxt} <span class="dot-separator">${importedTxt}</span> <span class="dot-separator">${builtinTxt}</span> <span class="dot-separator">${totalTxt}</span></div>`;
}

function populateExercisePickerForTemplate(template) {
  const registry = buildExerciseRegistryList().filter(e => e.template === template);

  newProjectExercise.innerHTML = registry
    .map(e => {
      const label = `${e.title} — ${sourceLabel(e.source)}`;
      return `<option value="${e.id}">${escapeHTML(label)}</option>`;
    })
    .join("");

  if (registry.length === 0) {
    newProjectExercise.innerHTML = `<option value="">No exercises available</option>`;
  }
}

function sourceLabel(source) {
  if (source === "bundled") return "Bundled";
  if (source === "imported") return "Imported";
  if (source === "builtin") return "Built-in";
  return source;
}

function findExerciseMeta(exerciseId) {
  const registry = buildExerciseRegistryList();
  return registry.find(x => x.id === exerciseId) || null;
}

/** ---------------------------
 *  Modal
 *  --------------------------*/
function openNewProjectModal() {
  newProjectName.value = "";
  const registry = buildExerciseRegistryList();
  if (registry.length === 0) {
    alert("No exercises available. If you opened via file://, use Import Exercise JSON.");
    return;
  }

  const templates = [...new Set(registry.map(e => e.template))];
  newProjectTemplate.value = templates.includes("structured_workflow") ? "structured_workflow" : templates[0];
  populateExercisePickerForTemplate(newProjectTemplate.value);

  modalBackdrop.classList.remove("hidden");
  modalNewProject.classList.remove("hidden");
  setTimeout(() => newProjectName.focus(), 50);
}
function closeNewProjectModal() {
  modalBackdrop.classList.add("hidden");
  modalNewProject.classList.add("hidden");
}

/** ---------------------------
 *  Project lifecycle
 *  --------------------------*/
function createProjectFromExerciseMeta(name, meta) {
  const t = nowISO();

  return {
    id: uid(),
    name,
    description: "",
    app_version: APP_VERSION,
    schema_version: "0.1.1",
    status: "draft",
    created_at: t,
    updated_at: t,

    exercise: {
      id: meta.id,
      title: meta.title,
      template: meta.template,
      version: meta.version || "1.0",
      tags: meta.tags || [],
      source: meta.source || "bundled"
    },

    step_index: 0,
    data: initProjectDataForTemplate(meta.template),
    capabilityNotes: "",
    governanceNotes: ""
  };
}

function initProjectDataForTemplate(template) {
  if (template === "structured_workflow") {
    return {
      inputs: {},       // global inputs_required values
      steps: {},        // step_id -> { field_key: value }
      completed_steps: {},
      prompt_runs: []   // lightweight history
    };
  }
  // Minimal build: not used now
  if (template === "reflection_deck") return { responses: {}, prompt_runs: {} };
  if (template === "prompt_library") return { runs: [] };
  return {};
}

function getProjectById(id) {
  return STORE.projects.find(p => p.id === id) || null;
}
function getActiveProject() {
  return ACTIVE_PROJECT_ID ? getProjectById(ACTIVE_PROJECT_ID) : null;
}
function touchProject(project) {
  project.updated_at = nowISO();
  saveProjectStore(STORE);
}

/** ---------------------------
 *  Views
 *  --------------------------*/
function showDashboard() {
  viewRunner.classList.add("hidden");
  viewDashboard.classList.remove("hidden");
  renderDashboard();
}
function showRunner() {
  viewDashboard.classList.add("hidden");
  viewRunner.classList.remove("hidden");
}
async function openProject(projectId) {
  ACTIVE_PROJECT_ID = projectId;
  showRunner();
  await renderRunner();
}

/** ---------------------------
 *  Dashboard UI
 *  --------------------------*/
function renderDashboard() {
  const q = (projectSearch.value || "").trim().toLowerCase();
  const projects = STORE.projects.filter(p => {
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.exercise?.title || "").toLowerCase().includes(q) ||
      (p.exercise?.template || "").toLowerCase().includes(q)
    );
  });

  projectGrid.innerHTML = projects.map(p => projectCardHTML(p)).join("");
  emptyState.classList.toggle("hidden", STORE.projects.length > 0);

  for (const p of projects) {
    el(`open_${p.id}`).addEventListener("click", async () => openProject(p.id));
    el(`rename_${p.id}`).addEventListener("click", () => renameProject(p.id));
    el(`delete_${p.id}`).addEventListener("click", () => deleteProject(p.id));
    el(`dup_${p.id}`).addEventListener("click", () => duplicateProject(p.id));
    el(`md_${p.id}`).addEventListener("click", async () => {
      const md = await buildMarkdownRecord(p);
      downloadTextFile(`${safeFilename(p.name)}.md`, md, "text/markdown");
    });
    el(`json_${p.id}`).addEventListener("click", () => {
      downloadTextFile(`${safeFilename(p.name)}.json`, JSON.stringify(p, null, 2), "application/json");
    });
  }
}

function projectCardHTML(p) {
  const templateLabel = TEMPLATE_LABELS[p.exercise?.template] || p.exercise?.template || "—";
  const status = p.status || "draft";
  const updated = p.updated_at ? new Date(p.updated_at).toLocaleString() : "—";
  const exTitle = p.exercise?.title || "—";
  const src = p.exercise?.source ? ` · ${sourceLabel(p.exercise.source)}` : "";

  return `
    <div class="card">
      <div class="card__title">${escapeHTML(p.name)}</div>
      <div class="card__meta">
        <div class="marker">
          ${escapeHTML(templateLabel)} <span class="dot-separator">${escapeHTML(status)}</span>
        </div>
        <div>Exercise: ${escapeHTML(exTitle)}${escapeHTML(src)}</div>
        <div>Last updated: ${escapeHTML(updated)}</div>
      </div>
      <div class="card__actions">
        <button id="open_${p.id}" class="btn btn--primary">Open</button>
        <button id="dup_${p.id}" class="btn">Duplicate</button>
        <button id="rename_${p.id}" class="btn">Rename</button>
        <button id="md_${p.id}" class="btn">Export MD</button>
        <button id="json_${p.id}" class="btn">Export JSON</button>
        <button id="delete_${p.id}" class="btn btn--danger">Delete</button>
      </div>
    </div>
  `;
}

let RENAME_PROJECT_ID = null;
function renameProject(projectId) {
  const p = getProjectById(projectId);
  if (!p) return;
  RENAME_PROJECT_ID = projectId;
  renameProjectName.value = p.name;
  
  modalRenameBackdrop.classList.remove("hidden");
  modalRenameProject.classList.remove("hidden");
  setTimeout(() => renameProjectName.focus(), 50);
}

function closeRenameProjectModal() {
  modalRenameBackdrop.classList.add("hidden");
  modalRenameProject.classList.add("hidden");
  RENAME_PROJECT_ID = null;
}

function saveRenameProject() {
  const next = renameProjectName.value.trim();
  if (!next) return alert("Please enter a project name.");
  
  const p = getProjectById(RENAME_PROJECT_ID);
  if (p) {
    p.name = next;
    touchProject(p);
    renderDashboard();
  }
  closeRenameProjectModal();
}

function deleteProject(projectId) {
  const p = getProjectById(projectId);
  if (!p) return;
  const ok = confirm(`Delete "${p.name}"? This cannot be undone.`);
  if (!ok) return;
  STORE.projects = STORE.projects.filter(x => x.id !== projectId);
  saveProjectStore(STORE);
  renderDashboard();
}

function duplicateProject(projectId) {
  const p = getProjectById(projectId);
  if (!p) return;
  const clone = JSON.parse(JSON.stringify(p));
  clone.id = uid();
  clone.name = `${p.name} (Copy)`;
  clone.created_at = nowISO();
  clone.updated_at = clone.created_at;
  STORE.projects.unshift(clone);
  saveProjectStore(STORE);
  renderDashboard();
}

/** ---------------------------
 *  Runner UI
 *  --------------------------*/
async function renderRunner() {
  const project = getActiveProject();
  if (!project) return showDashboard();

  runnerProjectTitle.textContent = project.name;
  runnerProjectSub.textContent = `${project.exercise.title} · ${TEMPLATE_LABELS[project.exercise.template] || project.exercise.template}`;

  runnerBody.innerHTML = `<div class="empty"><div class="empty__title">Loading exercise…</div><div class="empty__desc">Fetching definition (bundled/imported).</div></div>`;

  try {
    const exercise = await fetchExerciseById(project.exercise.id);

    if (exercise.template !== project.exercise.template) {
      runnerBody.innerHTML = `<div class="empty">
        <div class="empty__title">Template mismatch</div>
        <div class="empty__desc">Project expects ${escapeHTML(project.exercise.template)} but exercise is ${escapeHTML(exercise.template)}.</div>
      </div>`;
      return;
    }

    if (exercise.template === "structured_workflow") {
      const isFramework = (exercise.steps || []).some(s => s && typeof s.step_id === "string");
      
      const totalSteps = (exercise.steps || []).length;
      const stepIndex = project.step_index || 0;
      
      // If we are at the final index + 1, it's the summary view
      if (stepIndex === totalSteps) {
        runnerBody.innerHTML = renderDecisionSummary(project, exercise);
        wireDecisionSummary(project, exercise);
      } else {
        runnerBody.innerHTML = isFramework
          ? renderStructuredWorkflowFramework(project, exercise)
          : renderStructuredWorkflowLegacy(project, exercise);

        isFramework
          ? wireStructuredWorkflowFramework(project, exercise)
          : wireStructuredWorkflowLegacy(project, exercise);
      }

      return;
    }

    runnerBody.innerHTML = `<div class="empty"><div class="empty__title">Unsupported template in minimal build</div></div>`;
  } catch (err) {
    runnerBody.innerHTML = `<div class="empty">
      <div class="empty__title">Exercise could not be loaded</div>
      <div class="empty__desc">${escapeHTML(String(err?.message || err))}</div>
      <div class="empty__desc">If you opened via file://, use Import Exercise JSON.</div>
    </div>`;
  }
}

/** ---------------------------
 *  Template: Structured Workflow (FRAMEWORK STYLE)
 *  --------------------------*/
function renderStructuredWorkflowFramework(project, exercise) {
  const steps = exercise.steps || [];
  const stepIndex = clamp(project.step_index || 0, 0, steps.length - 1);
  const step = steps[stepIndex];

  const totalSteps = steps.length;
  // Step bubbles (1 to N) + Summary
  const stepperHTML = `
    <div class="stepper">
      ${steps.map((s, i) => `
        <div class="step-bubble ${i === stepIndex ? 'active' : ''} ${project.data.completed_steps?.[s.step_id] ? 'completed' : ''}" data-goto="${i}">
          ${i + 1}
        </div>
      `).join("")}
      <div class="step-bubble summary ${stepIndex === totalSteps ? 'active' : ''}" data-goto="${totalSteps}">
        Summary
      </div>
    </div>
  `;

  const inputs = exercise.inputs_required || [];
  const stepId = step.step_id;
  const stepData = project.data.steps?.[stepId] || {};

  const promptTemplate =
    step?.prompt_block?.prompt_template ||
    step?.prompt_block?.body ||
    "";

  const renderedPrompt = renderPromptTemplate(
    promptTemplate,
    project.data.inputs || {},
    stepData
  );

  return `
    <div>
      ${stepperHTML}

      <div class="section">
        <h2>Workflow Context</h2>
        <div class="muted">${escapeHTML(exercise.workflow?.summary || exercise.summary || "")}</div>
      </div>

      <div class="section">
        <div class="ai-zone">
          <span class="zone-label">AI Context / Inputs Required</span>
          <div class="muted" style="margin-bottom: var(--spacing-md);">These inputs drive the AI prompts for this workflow.</div>
          ${inputs.map(inp => renderGlobalInputControl(inp, project.data.inputs?.[inp.key] ?? "")).join("")}
        </div>
      </div>

      <div class="section">
        <h2>Step ${stepIndex + 1}: ${escapeHTML(step.title || stepId)}</h2>

        <div class="human-zone">
          <span class="zone-label">Human Decision / Capture Zone</span>
          ${Array.isArray(step.instructions) && step.instructions.length ? `
            <div class="muted" style="margin-bottom: var(--spacing-md);">
              <ul>
                ${step.instructions.map(b => `<li>${escapeHTML(b)}</li>`).join("")}
              </ul>
            </div>
          ` : ""}
          
          <label class="label">Step Fields</label>
          ${(step.fields || []).map(f => renderStepFieldControl(stepId, f, stepData[f.key] ?? "")).join("")}
        </div>
      </div>

      <div class="section">
        <div class="ai-zone">
          <span class="zone-label">AI-Assisted Guidance / Prompt</span>
          <h2 style="font-size: 16px;">${escapeHTML(step?.prompt_block?.title || "Prompt Booster")}</h2>
          <div class="muted">Copy this prompt, run it in your preferred AI, and capture the human decision above.</div>

          <div class="card" style="margin-top: var(--spacing-sm); background: white;">
            <textarea id="fw_prompt_preview" readonly style="border:none; background:transparent;">${escapeHTML(renderedPrompt)}</textarea>
            <div class="card__actions" style="margin-top: var(--spacing-sm);">
              <button id="fw_copy_prompt" class="btn btn--primary">Copy Prompt</button>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="card__actions">
          <button id="fw_prev" class="btn" ${stepIndex === 0 ? 'disabled' : ''}>Back</button>
          <button id="fw_next" class="btn btn--primary">${stepIndex === steps.length - 1 ? 'Go to Summary' : 'Next'}</button>
        </div>
      </div>

      ${renderCapabilityGovernanceLayer(project)}
    </div>
  `;
}

function renderDecisionSummary(project, exercise) {
  const steps = exercise.steps || [];
  const totalSteps = steps.length;
  
  const stepperHTML = `
    <div class="stepper">
      ${steps.map((s, i) => `
        <div class="step-bubble completed" data-goto="${i}">
          ${i + 1}
        </div>
      `).join("")}
      <div class="step-bubble summary active" data-goto="${totalSteps}">
        Summary
      </div>
    </div>
  `;

  return `
    <div>
      ${stepperHTML}
      <div class="section">
        <h2>Workflow Decision Summary</h2>
        <p class="muted">Review all human decisions before finalising the record.</p>
        
        <div class="card" style="margin-top: var(--spacing-md);">
          <table class="summary-table">
            <thead>
              <tr>
                <th style="width: 30%;">Step / Field</th>
                <th>Human Decision / Content</th>
              </tr>
            </thead>
            <tbody>
              ${steps.map(s => {
                const stepData = project.data.steps?.[s.step_id] || {};
                const fields = s.fields || [];
                return fields.map((f, fi) => `
                  <tr>
                    <td>
                      <div style="font-weight: 700;">${fi === 0 ? escapeHTML(s.title || s.step_id) : ""}</div>
                      <div class="muted">${escapeHTML(f.label || f.key)}</div>
                    </td>
                    <td>
                      <div style="white-space: pre-wrap;">${escapeHTML(stepData[f.key] || "—")}</div>
                    </td>
                  </tr>
                `).join("");
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="card__actions">
          <button id="sum_prev" class="btn">Return to Steps</button>
          <button id="sum_mark_completed" class="btn btn--primary" ${project.status === 'completed' ? 'disabled' : ''}>
            ${project.status === 'completed' ? 'Project Completed' : 'Finalise & Mark Completed'}
          </button>
        </div>
      </div>

      ${renderCapabilityGovernanceLayer(project)}
    </div>
  `;
}

function wireDecisionSummary(project, exercise) {
  wireStepper(project);
  
  el("sum_prev")?.addEventListener("click", () => {
    project.step_index = exercise.steps.length - 1;
    touchProject(project);
    renderRunner();
  });

  wireCapabilityGovernanceLayer(project);
  
  el("sum_mark_completed")?.addEventListener("click", () => {
    project.status = "completed";
    touchProject(project);
    alert("Record finalized and metadata locked.");
    renderRunner();
  });
}

function wireStepper(project) {
  document.querySelectorAll("[data-goto]").forEach(el => {
    el.addEventListener("click", () => {
      project.step_index = parseInt(el.getAttribute("data-goto"));
      touchProject(project);
      renderRunner();
    });
  });
}

function wireStructuredWorkflowFramework(project, exercise) {
  wireStepper(project);

  const steps = exercise.steps || [];
  const stepIndex = clamp(project.step_index || 0, 0, steps.length - 1);
  const step = steps[stepIndex];
  const stepId = step.step_id;

  // global inputs
  (exercise.inputs_required || []).forEach(inp => {
    const ctl = document.getElementById(`fw_inp_${inp.key}`);
    if (!ctl) return;

    const handler = () => {
      if (!project.data.inputs) project.data.inputs = {};
      project.data.inputs[inp.key] = ctl.value;
      touchProject(project);
      renderRunner(); // re-render so prompt preview updates everywhere consistently
    };

    ctl.addEventListener("input", handler);
    ctl.addEventListener("change", handler);
  });

  // step fields
  (step.fields || []).forEach(f => {
    const ctl = document.getElementById(`fw_step_${stepId}_${f.key}`);
    if (!ctl) return;

    ctl.addEventListener("input", () => {
      if (!project.data.steps) project.data.steps = {};
      if (!project.data.steps[stepId]) project.data.steps[stepId] = {};
      project.data.steps[stepId][f.key] = ctl.value;
      touchProject(project);

      // update preview live (without full rerender)
      const preview = document.getElementById("fw_prompt_preview");
      if (preview) {
        const tmpl =
          step?.prompt_block?.prompt_template ||
          step?.prompt_block?.body ||
          "";
        preview.value = renderPromptTemplate(tmpl, project.data.inputs || {}, project.data.steps[stepId] || {});
      }
    });
  });

  // copy prompt
  const btnCopy = document.getElementById("fw_copy_prompt");
  if (btnCopy) {
    btnCopy.addEventListener("click", async () => {
      const text = document.getElementById("fw_prompt_preview")?.value || "";
      await navigator.clipboard.writeText(text);
      btnCopy.textContent = "Copied";
      setTimeout(() => (btnCopy.textContent = "Copy Prompt"), 900);

      if (!project.data.prompt_runs) project.data.prompt_runs = [];
      project.data.prompt_runs.push({ step_id: stepId, kind: "prompt_copy", at: nowISO() });
      touchProject(project);
    });
  }

  document.getElementById("fw_prev")?.addEventListener("click", async () => {
    project.step_index = Math.max(0, (project.step_index || 0) - 1);
    touchProject(project);
    await renderRunner();
  });

  document.getElementById("fw_next")?.addEventListener("click", async () => {
    // If it's the last step, go to summary (index = steps.length)
    project.step_index = (project.step_index || 0) + 1;
    touchProject(project);
    await renderRunner();
  });

  wireCapabilityGovernanceLayer(project);
}

/** ---------------------------
 *  Template: Structured Workflow (LEGACY DEMO STYLE)
 *  Kept for compatibility if you import older JSON.
 *  --------------------------*/
function renderStructuredWorkflowLegacy(project, exercise) {
  const steps = exercise.steps || [];
  const stepIndex = clamp(project.step_index || 0, 0, steps.length - 1);
  const step = steps[stepIndex];

  const progress = steps.length ? Math.round(((stepIndex + 1) / steps.length) * 100) : 0;
  const notes = project.data?.legacy_notes_by_step?.[step.id] || "";

  return `
    <div>
      <div class="marker" style="margin-bottom: var(--spacing-lg);">
        Progress: ${progress}% <span class="dot-separator">Step ${stepIndex + 1} of ${steps.length}</span>
      </div>

      <div class="section">
        <h2>Scenario</h2>
        <div class="muted">${escapeHTML(exercise.scenario?.intro || "")}</div>
      </div>

      <div class="section">
        <h2>Step: ${escapeHTML(step.title || step.id)}</h2>
        <div class="muted">${escapeHTML(step.guidance || "")}</div>

        <hr/>

        <label class="label">Your work (this step)</label>
        <textarea id="sw_step_work" placeholder="Capture notes, drafts, decisions, outputs for this step…">${escapeHTML(notes)}</textarea>
      </div>

      <div class="section">
        <h2>Prompt starters</h2>
        <div class="card" style="margin-top:10px;">
          ${(exercise.prompt_starters || []).map((p, i) => `
            <div style="display:grid; gap: var(--spacing-sm);">
              <div class="muted">${i + 1}. ${escapeHTML(p)}</div>
              <button class="btn" data-copy="${escapeAttr(p)}">Copy</button>
            </div>
            ${i < (exercise.prompt_starters || []).length - 1 ? "<hr/>" : ""}
          `).join("")}
        </div>
      </div>

      <div class="section">
        <h2>Navigation</h2>
        <div class="card__actions">
          <button id="sw_prev" class="btn">Back</button>
          <button id="sw_next" class="btn btn--primary">Next</button>
          <button id="sw_mark_completed" class="btn">Mark Completed</button>
        </div>
      </div>

      ${renderCapabilityGovernanceLayer(project)}
    </div>
  `;
}

function wireStructuredWorkflowLegacy(project, exercise) {
  runnerBody.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = "Copy"), 900);
    });
  });

  const steps = exercise.steps || [];
  const stepIndex = clamp(project.step_index || 0, 0, steps.length - 1);
  const step = steps[stepIndex];

  const textarea = el("sw_step_work");
  textarea.addEventListener("input", () => {
    if (!project.data.legacy_notes_by_step) project.data.legacy_notes_by_step = {};
    project.data.legacy_notes_by_step[step.id] = textarea.value;
    touchProject(project);
  });

  el("sw_prev")?.addEventListener("click", async () => {
    project.step_index = Math.max(0, (project.step_index || 0) - 1);
    touchProject(project);
    await renderRunner();
  });
  el("sw_next")?.addEventListener("click", async () => {
    const max = (steps.length || 1) - 1;
    project.step_index = Math.min(max, (project.step_index || 0) + 1);
    touchProject(project);
    await renderRunner();
  });
  el("sw_mark_completed")?.addEventListener("click", async () => {
    project.status = "completed";
    touchProject(project);
    alert("Marked completed.");
    await renderRunner();
  });

  wireCapabilityGovernanceLayer(project);
}

/** ---------------------------
 *  Export builders (framework-aware)
 *  --------------------------*/
async function buildMarkdownRecord(project) {
  let exercise = null;
  try {
    exercise = await fetchExerciseById(project.exercise.id);
  } catch {
    exercise = null;
  }

  const lines = [];
  lines.push(`# AI Workflow & Governance Record`);
  lines.push(``);
  lines.push(`**Project:** ${project.name}`);
  lines.push(`**Status:** ${project.status}`);
  lines.push(`**Updated:** ${project.updated_at}`);
  lines.push(`**Schema Version:** ${project.schema_version}`);
  lines.push(`**App version:** ${project.app_version}`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Exercise Background`);
  lines.push(`- **Title:** ${project.exercise.title}`);
  lines.push(`- **Template:** ${project.exercise.template}`);
  lines.push(`- **Version:** ${project.exercise.version}`);
  lines.push(`- **Source:** ${sourceLabel(project.exercise.source || "bundled")}`);
  lines.push(``);

  if (!exercise) {
    lines.push(`> ! [WARNING] Exercise definition not found in this build.`);
    return lines.join("\n");
  }

  if (exercise.template === "structured_workflow") {
    const isFramework = (exercise.steps || []).some(s => s && typeof s.step_id === "string");

    if (isFramework) {
      lines.push(`## AI-Assisted Context`);
      lines.push(`### Workflow Intent`);
      lines.push(exercise.workflow?.summary || exercise.summary || "—");
      lines.push(``);

      if (Array.isArray(exercise.guardrails) && exercise.guardrails.length) {
        lines.push(`### Guardrails`);
        for (const g of exercise.guardrails) lines.push(`- ${g}`);
        lines.push(``);
      }

      lines.push(`### Workflow Parameterization (Inputs)`);
      const inputs = exercise.inputs_required || [];
      if (!inputs.length) {
        lines.push(`*No global inputs defined for this exercise.*`);
      } else {
        for (const inp of inputs) {
          const v = project.data.inputs?.[inp.key];
          lines.push(`- **${inp.label || inp.key}:** ${v ? String(v) : "—"}`);
        }
      }
      lines.push(``);

      lines.push(`## Human Decisional Output`);
      for (const s of exercise.steps || []) {
        const sid = s.step_id || s.id;
        const stepData = project.data.steps?.[sid] || {};

        lines.push(`### Step: ${s.title || sid}`);
        lines.push(``);

        const fields = s.fields || [];
        if (fields.length) {
          for (const f of fields) {
            const val = stepData[f.key];
            lines.push(`#### ${f.label || f.key}`);
            lines.push(val ? String(val) : "*No decision captured.*");
            lines.push(``);
          }
        }
        
        const tmpl = s?.prompt_block?.prompt_template || s?.prompt_block?.body || "";
        if (tmpl) {
          const rendered = renderPromptTemplate(tmpl, project.data.inputs || {}, stepData);
          lines.push(`> **AI Prompt Context:**  `);
          lines.push(`> ${rendered.replaceAll("\n", "\n> ")}`);
          lines.push(``);
        }
      }

      if (project.capabilityNotes || project.governanceNotes) {
        lines.push(`## Capability & Governance Notes`);
        if (project.capabilityNotes) {
          lines.push(`### Capability Alignment`);
          lines.push(project.capabilityNotes);
          lines.push(``);
        }
        if (project.governanceNotes) {
          lines.push(`### Governance & Transparency`);
          lines.push(project.governanceNotes);
          lines.push(``);
        }
      }

      lines.push(`---`);
      lines.push(`*Generated by CloudPedagogy AI Capability Workflow Record*`);
      return lines.join("\n");
    }

    // Legacy fallback export
    lines.push(`## Legacy Scenario`);
    lines.push(exercise.scenario?.intro || "—");
    lines.push(``);
    lines.push(`## Human Notes`);
    for (const s of exercise.steps || []) {
      const note = project.data.legacy_notes_by_step?.[s.id] || "";
      lines.push(`### ${s.title || s.id}`);
      lines.push(note || "—");
      lines.push(``);
    }
    return lines.join("\n");
  }

  if (project.capabilityNotes || project.governanceNotes) {
    lines.push(`## Capability & Governance Notes`);
    if (project.capabilityNotes) {
      lines.push(`### Capability Alignment`);
      lines.push(project.capabilityNotes);
      lines.push(``);
    }
    if (project.governanceNotes) {
      lines.push(`### Governance & Transparency`);
      lines.push(project.governanceNotes);
      lines.push(``);
    }
  }

  lines.push(`> Template not supported in this build.`);
  return lines.join("\n");
}

/** ---------------------------
 *  Rendering helpers
 *  --------------------------*/
function renderGlobalInputControl(inp, value) {
  const key = inp.key;
  const label = inp.label || key;
  const requiredMark = inp.required ? " *" : "";
  const v = value ?? "";

  if (inp.type === "select") {
    const opts = (inp.options || []).map(o => {
      const selected = String(o) === String(v) ? "selected" : "";
      return `<option value="${escapeAttr(o)}" ${selected}>${escapeHTML(o)}</option>`;
    }).join("");

    return `
      <div style="margin-bottom: var(--spacing-md);">
        <label class="label">${escapeHTML(label)}${requiredMark}</label>
        <select id="fw_inp_${escapeAttr(key)}" class="select">
          <option value="" ${v ? "" : "selected"}>—</option>
          ${opts}
        </select>
      </div>
    `;
  }

  if (inp.type === "text") {
    return `
      <div style="margin-bottom: var(--spacing-md);">
        <label class="label">${escapeHTML(label)}${requiredMark}</label>
        <input id="fw_inp_${escapeAttr(key)}" class="input" value="${escapeAttr(v)}" />
      </div>
    `;
  }

  // textarea default
  return `
    <div style="margin-bottom: var(--spacing-md);">
      <label class="label">${escapeHTML(label)}${requiredMark}</label>
      <textarea id="fw_inp_${escapeAttr(key)}">${escapeHTML(v)}</textarea>
    </div>
  `;
}

function renderStepFieldControl(stepId, f, value) {
  const label = f.label || f.key;
  const requiredMark = f.required ? " *" : "";
  const placeholder = f.placeholder || "";
  const v = value ?? "";

  return `
    <div style="margin-bottom: var(--spacing-md);">
      <label class="label">${escapeHTML(label)}${requiredMark}</label>
      <textarea id="fw_step_${escapeAttr(stepId)}_${escapeAttr(f.key)}" placeholder="${escapeAttr(placeholder)}">${escapeHTML(v)}</textarea>
    </div>
  `;
}

function renderPromptTemplate(template, globalInputs, stepFields) {
  const dict = { ...(globalInputs || {}), ...(stepFields || {}) };
  return String(template || "").replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const v = dict[key];
    return v === undefined || v === null ? "" : String(v);
  });
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/** ---------------------------
 *  Utils
 *  --------------------------*/
function downloadTextFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime || "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function safeFilename(name) {
  return (name || "ai_workflow_record")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80) || "ai_workflow_record";
}
function escapeHTML(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(str) {
  return escapeHTML(str).replaceAll("\n", " ");
}

/** ---------------------------
 *  Boot
 *  --------------------------*/
init();

/** ---------------------------
 *  Standard Capability & Governance Layer
 *  --------------------------*/
function renderCapabilityGovernanceLayer(project) {
  return `
    <div class="section" style="margin-top: var(--spacing-xl); border-top: 1px solid var(--color-border); padding-top: var(--spacing-lg);">
      <details class="governance-details">
        <summary style="cursor: pointer; font-size: 0.85rem; color: var(--color-muted); list-style: none;">
          <span style="border-bottom: 1px dashed currentColor;">Capability & Governance Notes (Optional)</span>
        </summary>
        <div style="margin-top: var(--spacing-md); display: grid; gap: var(--spacing-md);">
          <!-- Lightweight capability and governance layer -->
          <!-- Optional, non-blocking, and does not alter core workflow -->
          <div>
            <label class="label" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">Capability Alignment</label>
            <textarea id="capabilityNotes" style="font-size: 0.85rem; min-height: 60px; background: transparent; border-color: var(--color-border);" placeholder="What capability does this support? Suggested AI use pattern? Human judgement checkpoint?">${escapeHTML(project.capabilityNotes || "")}</textarea>
          </div>
          <div>
            <label class="label" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">Governance & Transparency</label>
            <textarea id="governanceNotes" style="font-size: 0.85rem; min-height: 60px; background: transparent; border-color: var(--color-border);" placeholder="AI involvement? Assumptions? Risks or concerns? Rationale? Human review notes?">${escapeHTML(project.governanceNotes || "")}</textarea>
          </div>
        </div>
      </details>
    </div>
  `;
}

function wireCapabilityGovernanceLayer(project) {
  const cap = el("capabilityNotes");
  const gov = el("governanceNotes");

  if (cap) {
    cap.addEventListener("input", () => {
      project.capabilityNotes = cap.value;
      touchProject(project);
    });
  }
  if (gov) {
    gov.addEventListener("input", () => {
      project.governanceNotes = gov.value;
      touchProject(project);
    });
  }
}
