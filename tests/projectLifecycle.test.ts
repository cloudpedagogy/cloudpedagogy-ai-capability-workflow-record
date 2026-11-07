import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadHtmlAndApp } from "./testHelper";
import type { ExerciseMeta } from "../src/types";

describe("Project Lifecycle and State Integrity", () => {
  let app: ReturnType<typeof loadHtmlAndApp>;

  beforeEach(() => {
    localStorage.clear();
    app = loadHtmlAndApp();
  });

  it("creates a new project with correct initial state, unique UID, and timestamps", () => {
    const meta: ExerciseMeta = {
      id: "fw_ch03_v1",
      title: "Ch03 Strategic Decision Making",
      template: "structured_workflow",
      version: "1.0",
      tags: ["ch03", "strategy"],
      source: "bundled"
    };

    const p1 = app.createProjectFromExerciseMeta("Project Alpha", meta);
    const p2 = app.createProjectFromExerciseMeta("Project Beta", meta);

    expect(p1.id).toMatch(/^p_[0-9a-f]+_[0-9a-f]+$/);
    expect(p2.id).toMatch(/^p_[0-9a-f]+_[0-9a-f]+$/);
    expect(p1.id).not.toBe(p2.id);

    expect(p1.name).toBe("Project Alpha");
    expect(p1.status).toBe("draft");
    expect(p1.app_version).toBe(app.APP_VERSION);
    expect(p1.schema_version).toBe("0.1.1");
    expect(p1.step_index).toBe(0);
    expect(p1.capabilityNotes).toBe("");
    expect(p1.governanceNotes).toBe("");

    expect(p1.data).toEqual({
      inputs: {},
      steps: {},
      completed_steps: {},
      prompt_runs: []
    });

    expect(p1.created_at).toBe(p1.updated_at);
  });

  it("updates updated_at timestamp when touchProject is called", async () => {
    const meta: ExerciseMeta = {
      id: "fw_ch03_v1",
      title: "Ch03 Strategic Decision Making",
      template: "structured_workflow",
      version: "1.0",
      source: "bundled"
    };

    const project = app.createProjectFromExerciseMeta("Timestamp Test", meta);
    const originalUpdated = project.updated_at;

    // Small delay to ensure timestamp changes
    await new Promise(r => setTimeout(r, 10));

    app.touchProject(project);
    expect(new Date(project.updated_at).getTime()).toBeGreaterThanOrEqual(
      new Date(originalUpdated).getTime()
    );
  });

  it("duplicates a project creating a deep copy with (Copy) name and fresh timestamps", () => {
    const state = app.getState();
    const meta: ExerciseMeta = {
      id: "fw_ch03_v1",
      title: "Original Exercise",
      template: "structured_workflow",
      version: "1.0",
      source: "bundled"
    };

    const original = app.createProjectFromExerciseMeta("Original Plan", meta);
    original.data.inputs = { topic: "AI Safety" };
    original.data.steps = { s1: { notes: "Crucial finding" } };
    original.capabilityNotes = "Pre-existing capability";
    original.governanceNotes = "Pre-existing governance";

    state.store.projects = [original];
    app.saveProjectStore(state.store);

    app.duplicateProject(original.id);

    const reloaded = app.loadProjectStore();
    expect(reloaded.projects).toHaveLength(2);

    const duplicated = reloaded.projects[0];
    expect(duplicated.name).toBe("Original Plan (Copy)");
    expect(duplicated.id).not.toBe(original.id);
    expect(duplicated.data.inputs?.topic).toBe("AI Safety");
    expect(duplicated.data.steps?.s1.notes).toBe("Crucial finding");
    expect(duplicated.capabilityNotes).toBe("Pre-existing capability");
    expect(duplicated.governanceNotes).toBe("Pre-existing governance");

    // Mutating duplicate data must not mutate original
    duplicated.data.inputs!.topic = "Modified in Copy";
    expect(original.data.inputs?.topic).toBe("AI Safety");
  });

  it("deletes a project with confirmation and clears active project if open", () => {
    const state = app.getState();
    const meta: ExerciseMeta = {
      id: "fw_ch03_v1",
      title: "Deletable Exercise",
      template: "structured_workflow",
      version: "1.0",
      source: "bundled"
    };

    const p1 = app.createProjectFromExerciseMeta("Project 1", meta);
    const p2 = app.createProjectFromExerciseMeta("Project 2", meta);
    state.store.projects = [p1, p2];
    app.saveProjectStore(state.store);

    state.activeProjectId = p1.id;

    // User cancels delete confirm
    vi.spyOn(window, "confirm").mockReturnValueOnce(false);
    app.deleteProject(p1.id);
    expect(state.store.projects).toHaveLength(2);
    expect(state.activeProjectId).toBe(p1.id);

    // User accepts delete confirm
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);
    app.deleteProject(p1.id);
    expect(state.store.projects).toHaveLength(1);
    expect(state.store.projects[0].id).toBe(p2.id);
    expect(state.activeProjectId).toBeNull();
  });

  it("generates safe filenames for diverse inputs and boundary cases", () => {
    expect(app.safeFilename("MSc Global Health — Foresight Review")).toBe(
      "msc_global_health_foresight_review"
    );
    expect(app.safeFilename("   Leading & Trailing Spaces   ")).toBe(
      "leading_trailing_spaces"
    );
    expect(app.safeFilename("!@#$%^&*()_+ special chars")).toBe("special_chars");
    expect(app.safeFilename("")).toBe("ai_workflow_record");
    expect(app.safeFilename("a".repeat(120))).toHaveLength(80);
  });

  it("escapes HTML and attributes to prevent XSS", () => {
    expect(app.escapeHTML('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
    expect(app.escapeHTML("Tom & Jerry's \"Adventures\"")).toBe(
      "Tom &amp; Jerry&#039;s &quot;Adventures&quot;"
    );
    expect(app.escapeAttr("Multi\nLine\nText")).toBe("Multi Line Text");
  });

  it("clamps numerical values properly within boundaries", () => {
    expect(app.clamp(5, 0, 10)).toBe(5);
    expect(app.clamp(-3, 0, 10)).toBe(0);
    expect(app.clamp(15, 0, 10)).toBe(10);
    expect(app.clamp(0, 0, 0)).toBe(0);
  });
});
