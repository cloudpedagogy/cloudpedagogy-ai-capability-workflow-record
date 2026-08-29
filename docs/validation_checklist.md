# Structured Workflow JSON — Validation Checklist (v1.3)

Use this checklist to verify that a generated JSON file is **compatible, registry-safe, and governance-ready**
before importing it into CloudPedagogy AI Capability Workflow Record.

This checklist applies to **exercise definition files only** (structured_workflow JSON).
It does NOT apply to exported project records.

Aligned to:

- Chapter-level exercise architecture (no lesson identifiers)
- Exercise ID Convention v1.1
- structured_workflow schema_version 1.0 (locked)
- Canonical Meta-Prompt Pack v1.3
- Workflow Record v0.1.x runtime (static, offline-first)

---

## 1. File & JSON Integrity

- [ ] File is valid JSON (passes jsonlint or equivalent)
- [ ] UTF-8 encoded
- [ ] No trailing commas
- [ ] No comments or markdown artifacts
- [ ] Root object is a single JSON object

---

## 2. Top-Level Structure

Confirm the file contains **exactly** the following top-level keys:

- [ ] schema_version
- [ ] id
- [ ] title
- [ ] template
- [ ] version
- [ ] status
- [ ] source
- [ ] tags
- [ ] summary
- [ ] estimated_time_minutes
- [ ] recommended_ai_tools
- [ ] difficulty_level
- [ ] audience
- [ ] design_intent
- [ ] pedagogical_focus
- [ ] inputs_required
- [ ] workflow
- [ ] steps
- [ ] export

❌ No additional top-level keys permitted.  
❌ guardrails must NOT appear as a top-level key (they belong inside workflow).

---

## 3. ID Validation (Chapter-Level Only)

Check the ID matches the correct prefix and format.

### Framework Application
- fw_apply__course-slug__chNN__vN

### Prompt Templates
- pt_apply__course-slug__chNN__vN

### Reflection & Discussion
- rd_apply__course-slug__chNN__vN

Rules:

- [ ] lowercase only
- [ ] hyphenated course slug
- [ ] zero-padded chapter number (ch02)
- [ ] no lesson identifiers (lsNN must not appear)
- [ ] no timestamps
- [ ] no random tokens
- [ ] version suffix present (__v1, __v2, etc.)
- [ ] stable once published

---

## 4. inputs_required

- [ ] inputs_required is an array
- [ ] Each item contains: key, type, required
- [ ] Allowed types only: text, textarea, select
- [ ] All select types include an options array
- [ ] Keys are snake_case
- [ ] All placeholders used in prompts exist here or in step fields

---

## 5. Workflow Object

The workflow object must contain:

- [ ] workflow.summary (1–2 sentences)
- [ ] workflow.values (array)
- [ ] workflow.guardrails (array, max 6)

Rules:

- [ ] values are lowercase snake_case
- [ ] Max 5 values
- [ ] guardrails are one sentence each
- [ ] guardrails clearly cover:
  - anonymise data
  - treat AI outputs as draft
  - no invented policies or fabricated sources
  - explicit uncertainty acknowledgement
  - human accountability retained

---

## 6. Steps Integrity

- [ ] Exactly 6 steps
- [ ] step_id values are exactly: s1, s2, s3, s4, s5, s6

Each step must contain:

- [ ] step_id
- [ ] title
- [ ] domain
- [ ] instructions (array)
- [ ] values_in_play (array)
- [ ] reflection_prompts (array)
- [ ] fields (array)
- [ ] prompt_block

---

## 7. Step Instructions

For each step:

- [ ] 3–6 instruction bullets
- [ ] One sentence per bullet
- [ ] Action verbs only
- [ ] No narrative paragraphs
- [ ] Instructions align with the declared domain

---

## 8. Fields

For each step:

- [ ] 2–4 fields
- [ ] type is always textarea
- [ ] At most one optional field
- [ ] Clear placeholder guidance
- [ ] Field keys are snake_case
- [ ] No duplicate field keys across the same step

---

## 9. Prompt Template Contract

Each prompt_block.prompt_template must:

- [ ] Follow the canonical structure
- [ ] Include:
  - Context type
  - Field/discipline
  - Level/scope
  - Priorities
  - Source material
- [ ] Include a numbered Task list
- [ ] Require:
  - at least 3 risks
  - at least 3 validation checks
  - at least 2 context-specific examples
- [ ] End with required headings exactly as:

  A) Draft Output  
  B) Assumptions  
  C) Risks / Uncertainties  
  D) Validation Checks  
  E) Questions for Human Review

---

## 10. Placeholder Validation

- [ ] No orphan {{placeholders}}
- [ ] Every placeholder maps to:
  - inputs_required.key OR
  - step.fields.key
- [ ] No unused declared inputs

---

## 11. Export Object

Confirm export contains:

- [ ] record_title
- [ ] record_subtitle
- [ ] recommended_filename_slug
- [ ] sections (array)
- [ ] agent_ready_payload

And:

- [ ] agent_ready_payload.workflow_kind matches exercise family:
  - framework_application
  - prompt_templates
  - reflection_discussion

---

## 12. Governance Readiness

- [ ] AI outputs treated as draft/advisory
- [ ] Human accountability explicit
- [ ] Risks documented
- [ ] Validation checks required
- [ ] Equity / impact considerations included where relevant
- [ ] No automated decision-making language
- [ ] No claims of predictive certainty

---

## Final Decision

- [ ] Ready to import into the tool
- [ ] Requires revision

If any section fails, revise using the appropriate Canonical Meta-Prompt before import.
