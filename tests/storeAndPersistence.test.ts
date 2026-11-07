import { describe, it, expect, beforeEach } from "vitest";
import { loadHtmlAndApp } from "./testHelper";
import type { Project, ProjectStore } from "../src/types";

describe("Storage and Persistence Compatibility", () => {
  let app: ReturnType<typeof loadHtmlAndApp>;

  beforeEach(() => {
    localStorage.clear();
    app = loadHtmlAndApp();
  });

  it("verifies the exact canonical localStorage keys", () => {
    expect(app.STORAGE_KEY).toBe("ai_capability_studio_v011_projects");
    expect(app.IMPORTED_EXERCISES_KEY).toBe("ai_capability_studio_v011_imported_exercises");
  });

  it("initialises with empty store if localStorage is empty", () => {
    const store = app.loadProjectStore();
    expect(store).toEqual({
      app_version: "0.1.1",
      projects: []
    });
  });

  it("safely recovers from malformed or corrupted localStorage", () => {
    localStorage.setItem(app.STORAGE_KEY, "{ broken json }");
    expect(app.loadProjectStore()).toEqual({
      app_version: "0.1.1",
      projects: []
    });

    localStorage.setItem(app.STORAGE_KEY, "null");
    expect(app.loadProjectStore()).toEqual({
      app_version: "0.1.1",
      projects: []
    });

    localStorage.setItem(app.STORAGE_KEY, JSON.stringify({ invalid: "data" }));
    expect(app.loadProjectStore()).toEqual({
      app_version: "0.1.1",
      projects: []
    });

    localStorage.setItem(app.STORAGE_KEY, JSON.stringify({ projects: "not-an-array" }));
    expect(app.loadProjectStore()).toEqual({
      app_version: "0.1.1",
      projects: []
    });
  });

  it("persists and restores valid project records intact", () => {
    const sampleProject: Project = {
      id: "p_test_123",
      name: "Strategic Intelligence Review",
      description: "Governance foresight test",
      app_version: "0.1.1",
      schema_version: "0.1.1",
      status: "draft",
      created_at: "2026-08-29T12:00:00.000Z",
      updated_at: "2026-08-29T12:30:00.000Z",
      exercise: {
        id: "fw_apply__genai-in-strategic-decision-making-and-institutional-intelligence__ch03__v1",
        title: "Apply the AI Capability Framework — Ch03",
        template: "structured_workflow",
        version: "1.0",
        tags: ["foresight", "strategy"],
        source: "bundled"
      },
      step_index: 2,
      data: {
        inputs: {
          institution_type: "Research University",
          risk_tolerance: "Medium"
        },
        steps: {
          step_01: { field_context: "Institutional strategy scan completed." }
        },
        completed_steps: { step_01: true },
        prompt_runs: [
          { step_id: "step_01", kind: "prompt_copy", at: "2026-08-29T12:15:00.000Z" }
        ]
      },
      capabilityNotes: "Strengthens institutional AI readiness.",
      governanceNotes: "Evaluated by Senior Leadership Team."
    };

    const store: ProjectStore = {
      app_version: "0.1.1",
      projects: [sampleProject]
    };

    app.saveProjectStore(store);

    const reloaded = app.loadProjectStore();
    expect(reloaded.projects).toHaveLength(1);
    expect(reloaded.projects[0]).toEqual(sampleProject);
    expect(reloaded.projects[0].name).toBe("Strategic Intelligence Review");
    expect(reloaded.projects[0].data.inputs?.institution_type).toBe("Research University");
    expect(reloaded.projects[0].capabilityNotes).toBe("Strengthens institutional AI readiness.");
    expect(reloaded.projects[0].governanceNotes).toBe("Evaluated by Senior Leadership Team.");
  });

  it("preserves historical data compatibility with older and legacy record shapes", () => {
    const historicalRecord = {
      id: "p_legacy_001",
      name: "Historical Strategic Practice Log",
      description: "Pre-standardisation session",
      app_version: "0.1.0",
      schema_version: "0.1.0",
      status: "completed",
      created_at: "2026-04-10T10:00:00.000Z",
      updated_at: "2026-04-10T11:00:00.000Z",
      exercise: {
        id: "legacy_ex_001",
        title: "Legacy Workflow Practice",
        template: "structured_workflow",
        version: "0.9",
        source: "imported"
      },
      step_index: 5,
      data: {
        legacy_notes_by_step: {
          step1: "Human captured guidance notes from 2026 Q1",
          step2: "Second step historical decision"
        }
      }
    };

    const legacyStore = {
      app_version: "0.1.0",
      projects: [historicalRecord]
    };

    localStorage.setItem(app.STORAGE_KEY, JSON.stringify(legacyStore));

    const reloaded = app.loadProjectStore();
    expect(reloaded.projects).toHaveLength(1);
    expect(reloaded.projects[0].id).toBe("p_legacy_001");
    expect(reloaded.projects[0].data.legacy_notes_by_step?.step1).toBe(
      "Human captured guidance notes from 2026 Q1"
    );
  });

  it("manages imported exercises persistence and handles corruption gracefully", () => {
    expect(app.loadImportedExercises()).toEqual([]);

    localStorage.setItem(app.IMPORTED_EXERCISES_KEY, "invalid json");
    expect(app.loadImportedExercises()).toEqual([]);

    localStorage.setItem(app.IMPORTED_EXERCISES_KEY, JSON.stringify("not-array"));
    expect(app.loadImportedExercises()).toEqual([]);

    const sampleExercises = [
      {
        id: "custom_ex_1",
        title: "Custom Scenario Planning",
        template: "structured_workflow" as const,
        version: "1.0",
        steps: [{ step_id: "s1", title: "Step 1" }]
      }
    ];

    app.saveImportedExercises(sampleExercises);
    const loaded = app.loadImportedExercises();
    expect(loaded).toEqual(sampleExercises);
  });
});
