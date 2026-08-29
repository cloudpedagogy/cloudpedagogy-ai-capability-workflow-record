# CloudPedagogy AI Capability Workflow Record

## Canonical Meta-Prompt — Reflection & Discussion → structured_workflow (v1.3)

------------------------------------------------------------------------

## PURPOSE

You are generating a `structured_workflow` JSON file for CloudPedagogy AI Capability Workflow Record.

Your task is to convert a **chapter-level Reflection & Discussion exercise**
into a **registry-ready, governance-safe JSON file** that can be imported into the tool.

This converter is chapter-focused only.
Do NOT reference lesson IDs, lesson numbers, or lesson-level mapping.

------------------------------------------------------------------------

## OUTPUT REQUIREMENTS

- Valid JSON only
- Deterministic structure
- No commentary
- No markdown fences
- No explanation
- No additional text

Return JSON only.

------------------------------------------------------------------------

## REQUIRED TOP-LEVEL STRUCTURE

The JSON must contain exactly:

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
  "guardrails": [],
  "workflow": {},
  "steps": [],
  "export": {}
}

No additional top-level keys allowed.

------------------------------------------------------------------------

## ID FORMAT (STRICT — CHAPTER LEVEL)

Use the following deterministic pattern:

rd_apply__COURSE_SLUG__chNN__v1

Where:

- COURSE_SLUG = lowercase, hyphenated course title
- chNN = zero-padded chapter number (e.g., ch03)
- v1 = version number

Rules:

- Lowercase only in final ID
- No spaces
- No lesson identifiers
- No timestamps
- No random tokens
- Must remain stable once published

------------------------------------------------------------------------

## GLOBAL inputs_required (MANDATORY)

Include these global inputs in this order:

1) context_type — select — required
2) field_area — text — required
3) level_scope — select — required
4) notes_priorities — textarea — optional
5) source_material — textarea — required

Rules:

- All steps[].fields[] must be type "textarea".
- Select inputs must include an "options" array.

### Canonical select options

context_type options:
- higher_education
- research
- public_service
- professional_learning
- other

level_scope options:
- introductory
- intermediate
- advanced
- programme_level
- institutional

------------------------------------------------------------------------

## WORKFLOW OBJECT

{
  "summary": "1–2 sentence structured description",
  "values": ["critical_reflection", "equity_awareness", "human_judgement"]
}

Values must be lowercase snake_case.

------------------------------------------------------------------------

## GUARDRAILS (MAX 6)

Provide a top-level "guardrails" array (max 6 one-sentence items).

Must include:

- anonymise data
- treat AI outputs as draft
- avoid invented institutional policies
- make assumptions explicit
- maintain human accountability

------------------------------------------------------------------------

## STEP STRUCTURE (STRICT)

Exactly 6 steps:

s1 — Framing Interpretation
s2 — Critical Reflection
s3 — Bias and Assumption Review
s4 — AI Prompt Application
s5 — Governance and Implication Analysis
s6 — Synthesis and Position Statement

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

Rules:

- 3–6 instruction bullets
- One sentence per bullet
- Action verbs only
- 2–4 textarea fields per step
- Max one optional field per step

------------------------------------------------------------------------

## PROMPT TEMPLATE STRUCTURE (MANDATORY)

Each step's prompt_template must follow exactly:

You are supporting [specific reflective activity].

Context type: {{context_type}}
Field/discipline: {{field_area}}
Level/scope: {{level_scope}}
Priorities: {{notes_priorities}}
Source material: {{source_material}}

[Step-specific field placeholders]

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

------------------------------------------------------------------------

## QUALITY REQUIREMENTS

Each prompt must:

- Require at least 3 risks
- Require at least 3 validation checks
- Require at least 2 context-specific examples
- Include max 6 task bullets
- Be ≤ 2,800 characters (approx)
- Avoid generic phrasing

------------------------------------------------------------------------

## PLACEHOLDER RULE

Every placeholder used (e.g., {{context_type}}) must exist in:

- inputs_required
OR
- the current step's fields

No orphan placeholders allowed.

------------------------------------------------------------------------

## STEP 6 ADDITIONAL REQUIREMENTS

Step 6 must include:

- Integrated cross-domain reflection prompts
- A required textarea field: capability_position_summary
- A required textarea field: ai_use_statement_draft (2–4 sentence template)

------------------------------------------------------------------------

## EXPORT OBJECT (MANDATORY)

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
    "checks_snapshot",
    "ai_use_statement"
  ],
  "agent_ready_payload": {
    "workflow_kind": "reflection_discussion_application",
    "version": "1.0",
    "fields": []
  }
}

------------------------------------------------------------------------

## EXECUTION

You will receive:

- course_title
- chapter_title
- chapter_number
- exercise_text

Transform the exercise_text into a structured_workflow JSON file.

Return JSON only.
