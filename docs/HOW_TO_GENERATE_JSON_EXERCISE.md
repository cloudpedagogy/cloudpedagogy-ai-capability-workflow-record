
# How to Generate a Structured Workflow JSON for CloudPedagogy AI Capability Workflow Record (v2.1)

This guide explains how to convert CloudPedagogy **chapter-level exercises**
into compatible `structured_workflow` JSON files
using the Canonical Meta‑Prompt Pack.

This document applies to the **chapter-level architecture (Exercise ID Convention v1.1)**
and Meta‑Prompt Pack v1.3.

-----------------------------------------------------------------------

## Important Distinction: Exercise Files vs Projects

CloudPedagogy AI Capability Workflow Record works with two completely different artefact types:

**1. Exercise Definition Files (JSON)**
- Generated using canonical meta-prompts
- Define workflow structure (6-step model)
- Imported into the tool
- Stored in `/exercises/`
- May be bundled via `/exercises/index.json`

**2. Projects (Local Work Records)**
- Created inside the browser UI
- Stored in browser `localStorage`
- Contain user inputs and structured judgement
- Exported as Markdown (.md) or JSON (.json)

Meta-prompts generate *exercise definition files only*.
They do **not** generate projects.

-----------------------------------------------------------------------

## Tool Characteristics

The tool is:

- Offline-first
- Static (HTML + Vanilla JS)
- No API calls
- JSON-driven
- LocalStorage-based for projects
- Vendor-neutral

All exercises must be generated externally using the appropriate
canonical meta‑prompt.

-----------------------------------------------------------------------

# Overview of Exercise Types

CloudPedagogy AI Capability Workflow Record supports three structured exercise types:

1. Framework Application  
   ID prefix: `fw_apply__`  
   Meta-prompt folder: `/prompts/framework_application/`

2. Prompt Templates  
   ID prefix: `pt_apply__`  
   Meta-prompt folder: `/prompts/prompt_templates/`

3. Reflection & Discussion  
   ID prefix: `rd_apply__`  
   Meta-prompt folder: `/prompts/reflection_discussion/`

All exercise types are **chapter-level only**.

ID format:

    <prefix>__course-slug__chNN__vN

No lesson identifiers (`lsNN`) are permitted.

-----------------------------------------------------------------------

# What You Need

1. The full exercise text from a CloudPedagogy chapter.
2. The correct canonical meta‑prompt file.
3. Access to a capable large language model (e.g., ChatGPT, Claude, Gemini).

The tool does not require any specific AI vendor.

-----------------------------------------------------------------------

# Step 1 — Locate the Exercise Text

Open the chapter.

Copy only the exercise block (for example):

- "GenAI Capability Exercise: Applying the Framework in Practice"
- "Prompt Templates"
- "Reflection & Discussion"

Do NOT include:

- Learning objectives
- Surrounding narrative
- Commentary outside the exercise block

-----------------------------------------------------------------------

# Step 2 — Select the Correct Meta‑Prompt

Choose based on exercise type:

Framework Application → use `fw_apply` meta-prompt  
Prompt Templates → use `pt_apply` meta-prompt  
Reflection & Discussion → use `rd_apply` meta-prompt  

Each canonical meta‑prompt enforces:

- Deterministic JSON structure
- Six-step `structured_workflow` schema (s1–s6)
- Governance safeguards
- Placeholder validation rules
- Export object integrity
- Required risk + validation sections

-----------------------------------------------------------------------

# Step 3 — Provide Required Inputs

Paste the full canonical meta‑prompt into your AI tool.

Then provide the required input block:

course_title:  
chapter_title:  
chapter_number:  
exercise_text:  

Example:

course_title: GenAI in Strategic Decision-Making  
chapter_title: Scenario Planning and Environmental Scanning  
chapter_number: 3  
exercise_text:  
[paste full exercise text here]

Do NOT include `lesson_title` (the tool is chapter-level only).

-----------------------------------------------------------------------

# Step 4 — Generate JSON

The model must return:

- Valid JSON only
- No markdown
- No commentary
- No code fences
- No explanatory prose

If extra text appears, respond:

Re-output valid JSON only. No commentary.

-----------------------------------------------------------------------

# Step 5 — Validate Before Importing

Recommended validation checks:

- JSON parses without error
- Exactly 6 steps
- step_id values: s1–s6
- No orphan {{placeholders}}
- ID follows canonical format
- No lesson identifiers (lsNN must not appear)
- No extra top-level keys
- workflow.guardrails present
- export object present

Use:

    docs/validation_checklist.md

For the full validation checklist (v1.3).

-----------------------------------------------------------------------

# Step 6 — Save the File

Save using the ID as filename:

    fw_apply__course-slug__ch02__v1.json
    pt_apply__course-slug__ch03__v1.json
    rd_apply__course-slug__ch03__v1.json

Files should be placed in:

    /exercises/

If bundling exercises for hosted deployment,
also register them in:

    /exercises/index.json

Do not modify the ID after publication.

The ID acts as a registry key and must remain stable.

-----------------------------------------------------------------------

# Step 7 — Import into the Tool

Option A — Bundled (recommended for hosted versions):

1. Add file to `/exercises/`
2. Update `/exercises/index.json`
3. Reload the application

Option B — Manual Import:

1. Open CloudPedagogy AI Capability Workflow Record
2. Click "Import Exercise JSON"
3. Upload the file
4. Confirm it appears in the dropdown
5. Create a new project using the imported exercise

-----------------------------------------------------------------------

# Governance & Design Notes

Generated JSON files are:

- UI-neutral
- Registry-stable
- Vendor-agnostic
- Deterministic
- Governance-ready
- Compatible with Markdown export via project records

The Canonical Meta‑Prompt Pack ensures long-term structural consistency
across exercise types under the chapter-level architecture.

-----------------------------------------------------------------------

## Version Alignment

This document aligns with:

- Exercise ID Convention v1.1
- structured_workflow schema_version 1.0
- Runtime v0.1.1
- Canonical Meta‑Prompt Pack v1.3
