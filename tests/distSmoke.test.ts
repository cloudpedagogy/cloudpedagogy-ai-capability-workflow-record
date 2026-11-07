import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import type { Project, ProjectStore, StructuredWorkflowExercise } from "../src/types";
import type { AIWorkflowAppType } from "./typesForTest";

describe("Production dist/ Smoke Test", () => {
  beforeEach(() => {
    localStorage.clear();

    // Verify all production dist files exist
    const distPath = path.resolve(__dirname, "../dist");
    expect(fs.existsSync(path.join(distPath, "index.html"))).toBe(true);
    expect(fs.existsSync(path.join(distPath, "app.js"))).toBe(true);
    expect(fs.existsSync(path.join(distPath, "styles.css"))).toBe(true);
    expect(fs.existsSync(path.join(distPath, "assets"))).toBe(true);
    expect(fs.existsSync(path.join(distPath, "exercises/index.json"))).toBe(true);

    // Load dist/index.html into JSDOM document
    const htmlContent = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    document.body.innerHTML = bodyMatch ? bodyMatch[1] : htmlContent;

    // Load dist/app.js into execution context
    const appCode = fs.readFileSync(path.join(distPath, "app.js"), "utf-8");
    const fn = new Function(appCode);
    fn();
  });

  it("verifies full standalone functionality against built dist files", async () => {
    const app = (window as unknown as { AIWorkflowApp: AIWorkflowAppType }).AIWorkflowApp;
    expect(app).toBeDefined();

    // 1. Initial State: Empty Dashboard
    app.renderDashboard();
    const emptyState = document.getElementById("emptyState");
    expect(emptyState?.classList.contains("hidden")).toBe(false);

    // 2. Load bundled exercise directly from dist/exercises/
    const bundledExPath = path.resolve(
      __dirname,
      "../dist/exercises/fw_apply__genai-in-strategic-decision-making-and-institutional-intelligence__ch03__v1.json"
    );
    const bundledEx = JSON.parse(fs.readFileSync(bundledExPath, "utf-8")) as StructuredWorkflowExercise;

    const state = app.getState();
    state.bundledIndex = [
      {
        id: bundledEx.id,
        title: bundledEx.title || "",
        template: bundledEx.template,
        version: bundledEx.version || "1.0",
        source: "bundled"
      }
    ];
    state.exerciseCache.set(bundledEx.id, bundledEx);
    app.populateExercisePickers();

    // 3. Create Project via UI Modal
    app.openNewProjectModal();
    const modal = document.getElementById("modalNewProject");
    expect(modal?.classList.contains("hidden")).toBe(false);

    const nameInput = document.getElementById("newProjectName") as HTMLInputElement;
    const exerciseSelect = document.getElementById("newProjectExercise") as HTMLSelectElement;
    nameInput.value = "Dist Smoke Test Project";
    exerciseSelect.value = bundledEx.id;

    const btnCreate = document.getElementById("btnCreateProject");
    btnCreate?.click();

    const createdProject = app.getState().store.projects[0];
    expect(createdProject.name).toBe("Dist Smoke Test Project");
    await app.openProject(createdProject.id);

    // 4. Verify Runner UI Loaded
    const runner = document.getElementById("viewRunner");
    expect(runner?.classList.contains("hidden")).toBe(false);
    expect(document.getElementById("runnerProjectTitle")?.textContent).toBe("Dist Smoke Test Project");

    // 5. Verify Global Input and Live Prompt Update
    const globalInput = document.getElementById("fw_inp_field_area") as HTMLInputElement;
    expect(globalInput).not.toBeNull();
    globalInput.value = "Higher Education Strategic Foresight";
    globalInput.dispatchEvent(new Event("input"));

    // Verify DOM was NOT torn down during typing (globalInput is still in DOM and active)
    expect(document.getElementById("fw_inp_field_area")).toBe(globalInput);

    // Verify Prompt Preview updated live
    const promptPreview = document.getElementById("fw_prompt_preview") as HTMLTextAreaElement;
    expect(promptPreview.value).toContain("Higher Education Strategic Foresight");

    // 6. Test Step Navigation and Decision Summary
    const stepBubbles = document.querySelectorAll(".step-bubble");
    expect(stepBubbles.length).toBe(7); // 6 steps + Summary

    // Navigate to step 6 (index 5)
    createdProject.step_index = 5;
    app.touchProject(createdProject);
    await app.renderRunner();

    // Advance to Summary View (index 6 == totalSteps)
    const btnNext = document.getElementById("fw_next");
    btnNext?.click();
    await app.renderRunner();

    expect(createdProject.step_index).toBe(6);
    expect(document.querySelector(".summary-table")).not.toBeNull();

    // 7. Capability & Governance Notes
    const capNotes = document.getElementById("capabilityNotes") as HTMLTextAreaElement;
    const govNotes = document.getElementById("governanceNotes") as HTMLTextAreaElement;
    capNotes.value = "Strategic foresight institutional capability";
    capNotes.dispatchEvent(new Event("input"));
    govNotes.value = "Review complete and risk-mitigated";
    govNotes.dispatchEvent(new Event("input"));

    expect(createdProject.capabilityNotes).toBe("Strategic foresight institutional capability");
    expect(createdProject.governanceNotes).toBe("Review complete and risk-mitigated");

    // 8. Mark Completed
    vi.spyOn(window, "alert").mockImplementation(() => {});
    const btnFinalise = document.getElementById("sum_mark_completed");
    btnFinalise?.click();
    expect(createdProject.status).toBe("completed");

    // 9. Markdown and JSON Export Verification
    const md = await app.buildMarkdownRecord(createdProject);
    expect(md).toContain("# AI Workflow & Governance Record");
    expect(md).toContain("Higher Education Strategic Foresight");
    expect(md).toContain("Strategic foresight institutional capability");
    expect(md).toContain("Review complete and risk-mitigated");

    const json = JSON.stringify(createdProject, null, 2);
    const parsed = JSON.parse(json) as Project;
    expect(parsed.name).toBe("Dist Smoke Test Project");
    expect(parsed.status).toBe("completed");

    // 10. Persistence Check: Reload store from localStorage
    const reloadedStore = app.loadProjectStore() as ProjectStore;
    expect(reloadedStore.projects).toHaveLength(1);
    expect(reloadedStore.projects[0].name).toBe("Dist Smoke Test Project");
    expect(reloadedStore.projects[0].status).toBe("completed");
  });
});
