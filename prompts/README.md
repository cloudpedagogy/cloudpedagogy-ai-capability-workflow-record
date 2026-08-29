# CloudPedagogy AI Capability Workflow Record

## Meta‑Prompt Pack (v1.3 --- Chapter-Level Architecture)

This folder contains the canonical meta‑prompts used to generate
compatible `structured_workflow` JSON exercise files.

These meta‑prompts convert CloudPedagogy **chapter-level exercises**
into governance‑ready, registry‑safe JSON files that can be imported
into CloudPedagogy AI Capability Workflow Record.

All exercise generation follows the **Chapter-Level ID Convention
(v1.1)**. Lesson identifiers (lsNN) are not used anywhere in the system.

------------------------------------------------------------------------

## 🎯 Purpose

CloudPedagogy AI Capability Workflow Record does **not** generate exercises internally.

Instead, exercises are:

1.  Generated externally using a canonical meta‑prompt\
2.  Validated against the `structured_workflow` schema (v1.0)\
3.  Saved as JSON\
4.  Placed inside the `/exercises/` folder (for bundling) **or imported
    manually**\
5.  Loaded by the application runtime\
6.  Used to create local projects\
7.  Exported as governance-ready AI Workflow Records

This separation keeps the tool:

-   Lightweight\
-   Offline‑first\
-   Vendor‑neutral\
-   Schema‑stable\
-   Deterministic\
-   Scalable across courses and bundles

Exercises are content.\
The tool is runtime.

------------------------------------------------------------------------

## 📦 Meta‑Prompt Families

Each folder corresponds to a structured exercise type.

All exercise types are **chapter-level only**.

All types use the same `structured_workflow` template in the tool UI.
The difference lies in **intent and ID prefix**, not in runtime template
type.

------------------------------------------------------------------------

### 1️⃣ Framework Application

Folder:\
`framework_application/`

ID Prefix:\
`fw_apply__`

Use for:

-   Applying the AI Capability Framework across six domains\
-   Governance‑heavy structured analysis\
-   Institutional strategy exercises\
-   Capability-based curriculum design\
-   Decision‑making simulations

Format:

    fw_apply__course-slug__chNN__vN

Example:

    fw_apply__genai-in-strategic-decision-making__ch03__v1

------------------------------------------------------------------------

### 2️⃣ Prompt Templates

Folder:\
`prompt_templates/`

ID Prefix:\
`pt_apply__`

Use for:

-   Structured prompt design labs\
-   Scenario generation workflows\
-   Trend mapping exercises\
-   Drafting pattern libraries\
-   Comparative output exercises

Format:

    pt_apply__course-slug__chNN__vN

------------------------------------------------------------------------

### 3️⃣ Reflection & Discussion

Folder:\
`reflection_discussion/`

ID Prefix:\
`rd_apply__`

Use for:

-   Ethical analysis\
-   Committee deliberation structures\
-   Equity‑anchored reflections\
-   Structured governance debates\
-   Position‑statement exercises

Format:

    rd_apply__course-slug__chNN__vN

------------------------------------------------------------------------

## 🧠 How to Use a Meta‑Prompt

1.  Open the relevant meta‑prompt file.

2.  Copy its full contents.

3.  Paste into a capable LLM (ChatGPT, Claude, Gemini, etc.).

4.  Provide required inputs:

    -   course_title\
    -   chapter_title\
    -   chapter_number\
    -   exercise_text

5.  Generate the JSON output.

6.  Validate the JSON against the checklist.

7.  Save using the canonical filename.

8.  Place in `/exercises/` (for bundled hosting) **or import via the
    tool UI**.

Do NOT provide:

-   lesson_title\
-   lesson identifiers\
-   custom ID formats

The tool is chapter-level only.

------------------------------------------------------------------------

## 📁 Operational Note: The `/exercises/` Folder

The `/exercises/` folder is operationally required **only if you are
bundling exercises with the hosted tool instance**.

If you:

-   Are hosting the tool on S3 / GitHub Pages / CDN\
-   Want bundled exercises to auto-load

Then:

1.  Place generated JSON files inside `/exercises/`\
2.  Register them in `/exercises/index.json`\
3.  Upload the updated folder to hosting

If you do not wish to bundle exercises:

-   Users can import JSON files manually using **Import Exercise JSON**\
-   No modification to `/exercises/index.json` is required

Bundling is optional. Import is always supported.

------------------------------------------------------------------------

## 🔍 Validation Requirements

Before importing or bundling, validate against:

-   Exercise ID Convention v1.1\
-   `structured_workflow` schema_version 1.0\
-   Structured Workflow Validation Checklist (v1.1)

Key checks:

-   Exactly 6 steps (s1--s6)\
-   No lesson identifiers (lsNN must not appear)\
-   Correct ID prefix\
-   Deterministic top-level structure\
-   No orphan {{placeholders}}\
-   Valid JSON syntax\
-   Guardrails present\
-   Export object present and correctly structured

------------------------------------------------------------------------

## 🔐 Stability Rules

Once an exercise is published:

-   Do NOT change exercise IDs\
-   Increment version numbers if structure changes\
-   Maintain chapter-level ID format\
-   Preserve prefix consistency\
-   Avoid breaking registry compatibility

Studio projects reference exercise IDs via localStorage.

ID stability ensures long‑term portability and audit traceability.

------------------------------------------------------------------------

## 🌐 Hosting & Deployment Compatibility

The Meta‑Prompt Pack is independent of deployment.

Whether the tool is:

-   Run locally (`localhost`)\
-   Hosted on S3\
-   Served via GitHub Pages\
-   Deployed on any static CDN

The JSON generation process remains identical.

Deployment affects **where projects are stored (browser localStorage)**
--- not how exercises are generated.

------------------------------------------------------------------------

## 📌 Meta‑Prompt Pack Specification

See:

    meta-prompt-pack_v1_spec.md

This defines:

-   Deterministic structural contract\
-   Required top-level keys\
-   Placeholder validation rules\
-   Step architecture (s1--s6)\
-   Export object requirements\
-   Governance safeguards

------------------------------------------------------------------------

## 🚀 Design Philosophy

The Meta‑Prompt Pack enables:

-   Infinite course scalability\
-   Clean separation of content and runtime\
-   Governance‑grade AI documentation\
-   Vendor‑agnostic structured workflows\
-   Deterministic schema alignment\
-   Long-term registry stability

The tool remains small and static.\
Exercises scale externally.\
Projects remain local.\
Exports become portable artefacts.

------------------------------------------------------------------------

CloudPedagogy AI Capability Workflow Record\
Meta‑Prompt Pack v1.3

Aligned to:

-   Chapter-Level Architecture (locked)\
-   Exercise ID Convention v1.1\
-   `structured_workflow` schema 1.0\
-   Workflow Record v0.1.x runtime
