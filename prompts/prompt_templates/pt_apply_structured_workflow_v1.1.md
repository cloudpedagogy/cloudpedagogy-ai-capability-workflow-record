
# 🔒 CloudPedagogy AI Capability Workflow Record  
## Canonical Meta-Prompt — Prompt Templates → structured_workflow (v1.1)

---

## PURPOSE

You are generating a structured_workflow JSON file for CloudPedagogy AI Capability Workflow Record.

Your task is to convert a lesson-level Prompt Templates exercise
(e.g., Scenario Planning, Trend Mapping, Scenario Matrix, Alignment Mapper)
into a registry-ready, governance-safe JSON file that can be imported into the tool.

Output must be:

- Valid JSON only
- Deterministic structure
- No commentary
- No markdown fences
- No explanation
- No extra text

Return JSON only.

---

## 1️⃣ REQUIRED TOP-LEVEL STRUCTURE

The JSON MUST contain exactly:

{
  "schema_version": "1.0",
  "id": "",
  "title": "",
  "template": "structured_workflow",
  "version": "1.0",
  "status": "active",
  "source": "imported",
  "tags": [],
  "summary": "",
  "estimated_time_minutes": 0,
  "difficulty_level": "",
  "audience": "",
  "design_intent": "",
  "inputs_required": [],
  "workflow": {},
  "steps": [],
  "export": {}
}

No additional top-level keys allowed.

---

## 2️⃣ ID FORMAT (STRICT)

`pt_apply__<course-slug>__ch<NN>__ls<NN>__v1`

Rules:

- lowercase only
- hyphenated slug
- zero-padded numbers (ch03, ls01)
- no timestamps
- no random tokens
- must remain stable once published

---

## 3️⃣ GLOBAL INPUTS_REQUIRED (MANDATORY)

Include these fields:

- context_type (select, required)
- field_area (text, required)
- level_scope (select, required)
- notes_priorities (textarea, optional)
- source_material (textarea, required)

All step fields must be type "textarea".

---

## 4️⃣ WORKFLOW OBJECT

{
  "summary": "1–2 sentence structured description",
  "values": ["clarity","specificity","accountability"]
}

Values must be lowercase snake_case.

---

## 5️⃣ GUARDRAILS (MAX 6)

Must include:

- anonymise data
- treat AI outputs as draft
- avoid invented policies
- make assumptions explicit
- maintain human accountability

One sentence per bullet.

---

## 6️⃣ STEP STRUCTURE (STRICT)

Exactly 6 steps:

s1 – Prompt Analysis  
s2 – Context Enrichment  
s3 – Structured Prompt Construction  
s4 – Risk and Bias Review  
s5 – Format and Output Structuring  
s6 – Reflection and Refinement  

Each step must include:

{
  "step_id": "s1",
  "title": "",
  "domain": "",
  "instructions": [],
  "values_in_play": [],
  "reflection_prompts": [],
  "fields": [],
  "prompt_block": {
      "title": "",
      "prompt_template": ""
  }
}

### DOMAIN RULE

The "domain" field must align conceptually with the AI Capability Framework domains:

- Awareness & Orientation  
- Human–AI Co-Agency  
- Generative Practice & Innovation  
- Ethics, Equity & Impact  
- Decision-Making & Governance  
- Reflection, Learning & Renewal  

Each step should map meaningfully to one of these domains without duplication.

Instructions:

- 3–6 bullets
- One sentence each
- Action verbs only

Each step must contain 2–4 textarea fields.

---

## 7️⃣ PROMPT TEMPLATE STRUCTURE (MANDATORY)

Each step's prompt_template must follow EXACTLY:

You are supporting [specific activity].

Context type: {{context_type}}
Field/discipline: {{field_area}}
Level/scope: {{level_scope}}
Priorities: {{notes_priorities}}
Source material: {{source_material}}

Task:
1) ...
2) ...
3) ...

Treat outputs as draft options for human review.

Return using headings:
A) Draft Output
B) Assumptions
C) Risks / Uncertainties
D) Validation Checks
E) Questions for Human Review

---

## 8️⃣ QUALITY REQUIREMENTS

Each prompt must:

- Require at least 3 risks
- Require at least 3 validation checks
- Require at least 2 context-specific examples
- Stay under 450 words
- Avoid generic phrasing
- Avoid narrative quotations

---

## 9️⃣ PLACEHOLDER RULE

Every {{placeholder}} used must exist in:

- inputs_required
OR
- the current step’s fields

No orphan placeholders permitted.

---

## 🔟 EXPORT OBJECT (MANDATORY)

{
  "record_title": "AI Workflow Record",
  "record_subtitle": "Structured AI Practice Log",
  "recommended_filename_slug": "",
  "sections": [
    "metadata",
    "inputs",
    "step_responses",
    "generated_prompts",
    "ai_outputs_raw",
    "human_revisions",
    "checks_snapshot"
  ],
  "agent_ready_payload": {
    "workflow_kind": "prompt_template_application",
    "version": "1.0",
    "fields": []
  }
}

---

## EXECUTION

You will receive:

- course_title
- chapter_title
- lesson_title
- exercise_text

Transform the exercise_text into a structured_workflow JSON file.

Return JSON only.
