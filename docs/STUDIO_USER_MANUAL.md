
# CloudPedagogy AI Capability Workflow Record — User Manual (v2.3)

CloudPedagogy AI Capability Workflow Record is an offline‑first structured workflow tool
for documenting human–AI collaboration in curriculum, foresight, and strategic design work.

The tool does NOT generate AI content.
It structures your workflow, records decisions, and produces governance‑ready documentation.

All exercises are chapter‑level `structured_workflow` JSON files generated
using the Canonical Meta‑Prompt Pack.

---

# Important Hosting & Data Clarification

CloudPedagogy AI Capability Workflow Record may be accessed:

- Locally (via localhost)
- Via static hosting (e.g., AWS S3, GitHub Pages)
- Via any static web server

Regardless of hosting location:

- No project data is transmitted to CloudPedagogy.
- No project data is stored on any server.
- All projects are stored in your browser's localStorage only.
- Clearing browser data may permanently delete projects.
- CloudPedagogy does not provide data recovery services.

Users are strongly advised to export their work regularly.

---

# How the Workflow Record Tool Works (Read This First)

CloudPedagogy AI Capability Workflow Record separates three things:

## 1️⃣ Exercises (Templates)
- JSON files that define a 6‑step structured workflow.
- Loaded from `/exercises/index.json` (bundled) or imported manually.
- Generated externally using canonical meta‑prompts.
- Stable by ID (e.g. `fw_apply__course-slug__ch02__v1`).

Exercises define structure.  
They are not user work.

---

## 2️⃣ Projects (Your Work)

- Created when you click **New Project**
- Stored automatically in your browser using `localStorage`
- Private to:
  - This device
  - This browser
  - This site URL (origin)

Projects do NOT sync.
Projects do NOT upload.
Projects are NOT visible to other users.
Projects are NOT recoverable by CloudPedagogy.

Export regularly if you need backup or sharing.

---

## 3️⃣ AI Outputs

The tool does not call AI APIs.

Instead:

1. You fill in structured fields.
2. You click **Copy Prompt**.
3. You run the prompt in an external AI tool (ChatGPT, Claude, Gemini, etc.).
4. You treat the output as a draft artefact for review.
5. You paste relevant structured conclusions back into the tool fields (optional but recommended).

The tool records your structured judgement — not raw AI content by default.

---

# Part 1 — Importing an Exercise

## 1. Open the Tool

Open `index.html` using:

- A local development server (recommended)
- AWS S3 static hosting
- GitHub Pages
- Any static hosting provider

The tool runs entirely in the browser.

---

## 2. Import an Exercise JSON

Click:

**Import Exercise JSON**

Select a JSON file generated using one of the Canonical Meta‑Prompt converters:

- `fw_apply__` → Framework Application
- `pt_apply__` → Prompt Template
- `rd_apply__` → Reflection & Discussion

All exercises must:

- Follow the canonical ID convention
- Be chapter‑level (no lesson identifiers)
- Contain exactly 6 workflow steps (s1–s6)
- Match the `structured_workflow` schema (v1.0)

If successful:

- The exercise appears in the dropdown menu.
- It becomes available for new projects.

The tool does not modify imported files.

---

# Part 2 — Creating a Project

## 1. Click “New Project”

Provide:

- Project Name
- Select Exercise

Click **Create**.

A new project instance is created locally in your browser.

---

## 2. Global Inputs

Complete:

- Context type
- Field / discipline
- Level / scope
- Priorities (optional)
- Source material

These inputs:

- Populate prompt templates dynamically
- Persist across all steps
- Provide governance traceability

---

# Part 3 — Using Each Step

All exercises use a 6‑step structured workflow aligned to the AI Capability Framework domains.

s1 — Awareness & Orientation  
s2 — Human–AI Co‑Agency  
s3 — Generative Practice & Innovation  
s4 — Ethics, Equity & Impact  
s5 — Decision‑Making & Governance  
s6 — Reflection, Learning & Renewal  

Each step contains:

1. Instructions  
2. Reflection prompts  
3. Structured input fields  
4. A prompt template block  

---

## Using the Prompt Block

The prompt is a structured thinking accelerator.

1. Complete fields first.
2. Click **Copy Prompt**.
3. Run externally in an AI system.
4. Critically evaluate outputs.
5. Update fields with structured human judgement.

AI outputs are advisory drafts only.

---

# Part 4 — Navigation & Storage

All entries are stored automatically in browser `localStorage`.

The tool:

- Does not transmit data
- Does not store data remotely
- Does not require login
- Does not use analytics

If you close and reopen in the same browser and URL, projects remain.

If you change device, browser, or clear storage, projects disappear.

Export to protect your work.

---

# Part 5 — Exporting Your Record

You may export:

- **Export MD**
- **Export JSON**

Markdown export includes:

- Project metadata
- Inputs
- Step responses
- Prompt snapshots
- Governance reflections
- AI use statement (Step 6)

Export frequently for backup.

---

# Governance Positioning & Disclaimer

CloudPedagogy AI Capability Workflow Record is an open-source support tool provided for structured documentation and reflective practice.

It:

- Does not provide guarantees of suitability
- Does not replace institutional governance processes
- Does not provide technical support obligations unless separately contracted
- Does not guarantee compatibility with all browsers or configurations

Users are responsible for:

- Validating outputs
- Ensuring compliance with institutional policy
- Maintaining their own backups

---

# Version Alignment

Manual v2.3 aligns with:

- Canonical Meta‑Prompt Pack v1.3
- structured_workflow schema_version 1.0
- Exercise ID Convention v1.1
- Workflow Record runtime v0.1.x

Future versions may introduce additional template families or validation features.

---

CloudPedagogy AI Capability Workflow Record remains a structured thinking environment, not an automation engine.

Human judgement is final authority.
