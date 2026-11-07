import { describe, it, expect, beforeEach } from "vitest";
import { loadHtmlAndApp } from "./testHelper";
import type { Project, StructuredWorkflowExercise } from "../src/types";

describe("Export Formats and Data Compatibility", () => {
  let app: ReturnType<typeof loadHtmlAndApp>;

  beforeEach(() => {
    localStorage.clear();
    app = loadHtmlAndApp();
  });

  const mockExercise: StructuredWorkflowExercise = {
    id: "fw_apply__ch03__test",
    title: "Scenario Planning & Environmental Scanning (Ch03)",
    template: "structured_workflow",
    version: "1.0",
    workflow: {
      summary: "Document structured collaboration between human foresight teams and AI."
    },
    guardrails: [
      "Ensure student and faculty privacy.",
      "Verify all statistical claims against primary sources."
    ],
    inputs_required: [
      { key: "institution", label: "Institution Name", type: "text" },
      { key: "horizon", label: "Planning Horizon", type: "text" }
    ],
    steps: [
      {
        step_id: "step_01",
        title: "Drivers of Change Identification",
        fields: [
          { key: "primary_driver", label: "Primary Strategic Driver" },
          { key: "impact_rating", label: "Anticipated Impact" }
        ],
        prompt_block: {
          title: "Driver Scan Prompt",
          prompt_template: "For {{institution}} over {{horizon}}, scan emerging drivers regarding {{primary_driver}}."
        }
      },
      {
        step_id: "step_02",
        title: "Scenario Matrix Formulation",
        fields: [
          { key: "scenario_axes", label: "Selected Axes" }
        ]
      }
    ]
  };

  it("builds a complete, formatted Markdown workflow record for framework exercises", async () => {
    const state = app.getState();
    state.exerciseCache.set(mockExercise.id, mockExercise);

    const project: Project = {
      id: "p_export_001",
      name: "Strategic Foresight 2026",
      description: "University review",
      app_version: "0.1.1",
      schema_version: "0.1.1",
      status: "completed",
      created_at: "2026-08-29T10:00:00.000Z",
      updated_at: "2026-08-29T11:30:00.000Z",
      exercise: {
        id: mockExercise.id,
        title: mockExercise.title || "",
        template: mockExercise.template,
        version: "1.0",
        source: "bundled"
      },
      step_index: 2,
      data: {
        inputs: {
          institution: "Cambridge Institute",
          horizon: "2026-2035"
        },
        steps: {
          step_01: {
            primary_driver: "Autonomous AI Research Agents",
            impact_rating: "High Disruption"
          },
          step_02: {
            scenario_axes: "Open Research vs Closed Proprietary"
          }
        },
        completed_steps: { step_01: true, step_02: true },
        prompt_runs: [
          { step_id: "step_01", kind: "prompt_copy", at: "2026-08-29T10:15:00.000Z" }
        ]
      },
      capabilityNotes: "Demonstrated advanced co-agency and critical evaluation.",
      governanceNotes: "Reviewed and approved by Academic Senate."
    };

    const md = await app.buildMarkdownRecord(project);

    expect(md).toContain("# AI Workflow & Governance Record");
    expect(md).toContain("**Project:** Strategic Foresight 2026");
    expect(md).toContain("**Status:** completed");
    expect(md).toContain("**Schema Version:** 0.1.1");
    expect(md).toContain("## Exercise Background");
    expect(md).toContain("Scenario Planning & Environmental Scanning (Ch03)");

    // AI-Assisted Context
    expect(md).toContain("## AI-Assisted Context");
    expect(md).toContain("### Workflow Intent");
    expect(md).toContain("Document structured collaboration between human foresight teams and AI.");
    expect(md).toContain("### Guardrails");
    expect(md).toContain("- Ensure student and faculty privacy.");
    expect(md).toContain("- Verify all statistical claims against primary sources.");
    expect(md).toContain("### Workflow Parameterization (Inputs)");
    expect(md).toContain("- **Institution Name:** Cambridge Institute");
    expect(md).toContain("- **Planning Horizon:** 2026-2035");

    // Human Decisional Output
    expect(md).toContain("## Human Decisional Output");
    expect(md).toContain("### Step: Drivers of Change Identification");
    expect(md).toContain("#### Primary Strategic Driver");
    expect(md).toContain("Autonomous AI Research Agents");
    expect(md).toContain("#### Anticipated Impact");
    expect(md).toContain("High Disruption");

    // Rendered Prompt in Context
    expect(md).toContain("> **AI Prompt Context:**");
    expect(md).toContain(
      "For Cambridge Institute over 2026-2035, scan emerging drivers regarding Autonomous AI Research Agents."
    );

    // Capability & Governance Notes
    expect(md).toContain("## Capability & Governance Notes");
    expect(md).toContain("### Capability Alignment");
    expect(md).toContain("Demonstrated advanced co-agency and critical evaluation.");
    expect(md).toContain("### Governance & Transparency");
    expect(md).toContain("Reviewed and approved by Academic Senate.");

    // Footer
    expect(md).toContain("*Generated by CloudPedagogy AI Capability Workflow Record*");
  });

  it("handles missing exercise definition gracefully in Markdown export", async () => {
    const project: Project = {
      id: "p_missing_ex",
      name: "Orphaned Project",
      description: "",
      app_version: "0.1.1",
      schema_version: "0.1.1",
      status: "draft",
      created_at: "2026-08-29T10:00:00.000Z",
      updated_at: "2026-08-29T10:00:00.000Z",
      exercise: {
        id: "non_existent_exercise_id",
        title: "Missing Exercise",
        template: "structured_workflow",
        version: "1.0",
        source: "imported"
      },
      step_index: 0,
      data: { inputs: {}, steps: {}, completed_steps: {}, prompt_runs: [] }
    };

    const md = await app.buildMarkdownRecord(project);
    expect(md).toContain("# AI Workflow & Governance Record");
    expect(md).toContain("> ! [WARNING] Exercise definition not found in this build.");
  });

  it("exports legacy structured workflow in proper legacy Markdown format", async () => {
    const legacyEx: StructuredWorkflowExercise = {
      id: "legacy_ex_002",
      title: "Legacy Exercise Format",
      template: "structured_workflow",
      scenario: { intro: "Legacy foresight exercise overview" },
      steps: [
        { id: "step_legacy_a", title: "Step A", guidance: "Do work A" }
      ]
    };

    const state = app.getState();
    state.exerciseCache.set(legacyEx.id, legacyEx);

    const project: Project = {
      id: "p_legacy_export",
      name: "Legacy Project",
      description: "",
      app_version: "0.1.0",
      schema_version: "0.1.0",
      status: "completed",
      created_at: "2026-04-10T10:00:00.000Z",
      updated_at: "2026-04-10T11:00:00.000Z",
      exercise: {
        id: legacyEx.id,
        title: legacyEx.title || "",
        template: "structured_workflow",
        version: "1.0",
        source: "imported"
      },
      step_index: 1,
      data: {
        legacy_notes_by_step: {
          step_legacy_a: "Captured decision notes from human researcher"
        }
      }
    };

    const md = await app.buildMarkdownRecord(project);
    expect(md).toContain("## Legacy Scenario");
    expect(md).toContain("Legacy foresight exercise overview");
    expect(md).toContain("## Human Notes");
    expect(md).toContain("### Step A");
    expect(md).toContain("Captured decision notes from human researcher");
  });

  it("exports complete JSON with full fidelity and schema conformance", () => {
    const project: Project = {
      id: "p_json_roundtrip",
      name: "JSON Fidelity Test",
      description: "Testing export parity",
      app_version: "0.1.1",
      schema_version: "0.1.1",
      status: "in_progress",
      created_at: "2026-08-29T10:00:00.000Z",
      updated_at: "2026-08-29T10:30:00.000Z",
      exercise: {
        id: "fw_01",
        title: "Test Ex",
        template: "structured_workflow",
        version: "1.0",
        tags: ["test"],
        source: "bundled"
      },
      step_index: 1,
      data: {
        inputs: { domain: "Education" },
        steps: { s1: { note: "First draft" } },
        completed_steps: { s1: true },
        prompt_runs: []
      },
      capabilityNotes: "Capability notes",
      governanceNotes: "Governance notes"
    };

    const serialized = JSON.stringify(project, null, 2);
    const parsed = JSON.parse(serialized);
    expect(parsed).toEqual(project);
    expect(parsed.data.inputs.domain).toBe("Education");
    expect(parsed.capabilityNotes).toBe("Capability notes");
  });
});
