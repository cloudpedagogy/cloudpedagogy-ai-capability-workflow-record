
# 📘 Meta‑Prompt Pack v1.3 Specification
CloudPedagogy AI Capability Workflow Record

---

## PURPOSE

Meta‑Prompt Pack v1.3 defines the deterministic conversion layer for
transforming structured CloudPedagogy chapter exercises into:

- `structured_workflow` JSON files
- Governance‑ready artefacts
- AI Workflow Records
- Registry‑safe imports for CloudPedagogy AI Capability Workflow Record

This specification aligns with:

- Chapter-Level Architecture (locked)
- Exercise ID Convention v1.1
- structured_workflow schema v1.0
- Workflow Record runtime v0.1.x

---

## SUPPORTED EXERCISE TYPES

| Prefix        | Exercise Type            | Status |
|---------------|--------------------------|--------|
| fw_apply__    | Framework Application    | Stable |
| pt_apply__    | Prompt Templates         | Stable |
| rd_apply__    | Reflection & Discussion  | Stable |

All IDs must follow:

    <prefix>__<course-slug>__chNN__vN

Rules:

- Lowercase only
- Hyphenated course slug
- Zero‑padded chapter number (ch03)
- Version number required (v1, v2, etc.)
- No lesson identifiers (lsNN not permitted)
- No timestamps
- No random tokens
- ID must remain stable once published

---

## SCHEMA CONTRACT

All meta-prompts must generate JSON containing exactly the required
top-level keys defined by structured_workflow schema v1.0:

- schema_version
- id
- title
- template
- version
- status
- source
- tags
- summary
- estimated_time_minutes
- recommended_ai_tools
- difficulty_level
- audience
- design_intent
- pedagogical_focus
- inputs_required
- workflow
- guardrails
- steps
- export

No additional top-level keys permitted.

---

## STEP MODEL

All structured_workflow files must:

- Contain exactly 6 steps
- Use deterministic step IDs: s1, s2, s3, s4, s5, s6
- Include structured instruction arrays
- Include textarea fields
- Include reflection prompts
- Include values_in_play arrays
- Include a prompt_block object
- Enforce risk and validation checks
- Treat AI outputs explicitly as draft/advisory

The six-step architecture is locked.

---

## DESIGN REQUIREMENTS

Meta-prompts must:

- Output valid JSON only
- Avoid commentary
- Avoid markdown fences
- Avoid narrative duplication
- Enforce placeholder integrity
- Include guardrails array
- Include export object
- Be UI-neutral
- Be analytics-extractable
- Remain vendor-agnostic

---

## EXPORT OBJECT CONTRACT

Each workflow must include:

- record_title
- record_subtitle
- recommended_filename_slug
- sections
- agent_ready_payload

This ensures compatibility with:

- Markdown export
- Governance documentation
- Capability logging
- Audit traceability
- Future agent orchestration

---

## ARCHITECTURAL POSITIONING

Meta‑Prompt Pack v1.3 forms the deterministic conversion layer between:

Course Intellectual Property  
→ Structured Workflow JSON  
→ Workflow Record Runtime Execution  
→ AI Workflow Records  
→ Institutional Governance Artefacts  

It is:

- Tool-agnostic
- Offline-first compatible
- Registry-stable
- Deployment-neutral (local or hosted)
- Deterministic by design

---

## VERSIONING POLICY

v1 = Stable schema alignment  
v1.x = Minor refinements without structural change  
v2 = Structural schema changes  

Backward compatibility should be preserved where possible.

---

© CloudPedagogy
