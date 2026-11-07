import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadHtmlAndApp } from "./testHelper";
import type { StructuredWorkflowExercise } from "../src/types";

describe("Representative Complete User Journey Integration", () => {
  let app: ReturnType<typeof loadHtmlAndApp>;

  const testExercise: StructuredWorkflowExercise = {
    id: "fw_apply__genai-in-strategic-decision-making-and-institutional-intelligence__ch03__v1",
    title: "Apply the AI Capability Framework — Scenario Planning and Environmental Scanning (Ch03)",
    template: "structured_workflow",
    version: "1.0",
    workflow: {
      summary: "This exercise guides strategy teams through a 6-step foresight workflow."
    },
    guardrails: ["Ensure complete privacy; offline local storage only."],
    inputs_required: [
      { key: "institution_context", label: "Institution Context", type: "text" }
    ],
    steps: [
      {
        step_id: "step_01",
        title: "Scan Emerging Drivers",
        instructions: ["Identify 3 external signals of technological or regulatory change."],
        fields: [
          { key: "drivers_list", label: "Identified Drivers", placeholder: "List signals..." }
        ],
        prompt_block: {
          title: "Driver Identification Prompt",
          prompt_template: "As a strategic foresight planner for {{institution_context}}, analyze: {{drivers_list}}."
        }
      },
      {
        step_id: "step_02",
        title: "Critical Assessment & Decision",
        instructions: ["Assess impact and document human refined judgment."],
        fields: [
          { key: "final_decision", label: "Strategic Decision" }
        ],
        prompt_block: {
          title: "Decision Review Prompt",
          prompt_template: "Critique the decision: {{final_decision}}."
        }
      }
    ]
  };

  beforeEach(() => {
    localStorage.clear();
    app = loadHtmlAndApp();
    const state = app.getState();
    state.bundledIndex = [
      {
        id: testExercise.id,
        title: testExercise.title || "",
        template: testExercise.template,
        version: testExercise.version || "1.0",
        source: "bundled"
      }
    ];
    state.exerciseCache.set(testExercise.id, testExercise);
    app.populateExercisePickers();
  });

  it("completes full lifecycle: project creation, editing, prompt run, summary, completion, and deletion", async () => {
    // 1. Initial State: Dashboard with Empty State
    app.renderDashboard();
    const emptyState = document.getElementById("emptyState");
    const projectGrid = document.getElementById("projectGrid");
    expect(emptyState?.classList.contains("hidden")).toBe(false);
    expect(projectGrid?.children.length).toBe(0);

    // 2. Open Create Project Modal
    const btnNew = document.getElementById("btnNewProject");
    btnNew?.click();

    const modal = document.getElementById("modalNewProject");
    expect(modal?.classList.contains("hidden")).toBe(false);

    const nameInput = document.getElementById("newProjectName") as HTMLInputElement;
    const exerciseSelect = document.getElementById("newProjectExercise") as HTMLSelectElement;

    nameInput.value = "Foresight 2026 Strategy Project";
    exerciseSelect.value = testExercise.id;

    // 3. Click Create Project
    const btnCreate = document.getElementById("btnCreateProject");
    btnCreate?.click();

    // Await async openProject to finish loading exercise
    const createdProject = app.getState().store.projects[0];
    await app.openProject(createdProject.id);

    // 4. Verify Runner View
    const runner = document.getElementById("viewRunner");
    const dashboard = document.getElementById("viewDashboard");
    expect(runner?.classList.contains("hidden")).toBe(false);
    expect(dashboard?.classList.contains("hidden")).toBe(true);

    const titleEl = document.getElementById("runnerProjectTitle");
    expect(titleEl?.textContent).toBe("Foresight 2026 Strategy Project");

    // Stepper should show Step 1, Step 2, and Summary
    const stepBubbles = document.querySelectorAll(".step-bubble");
    expect(stepBubbles.length).toBe(3);

    // 5. Fill Global Input and Step Field
    const globalInput = document.getElementById("fw_inp_institution_context") as HTMLInputElement;
    expect(globalInput).not.toBeNull();
    globalInput.value = "National Research University";
    globalInput.dispatchEvent(new Event("input"));

    const stepField = document.getElementById("fw_step_step_01_drivers_list") as HTMLTextAreaElement;
    expect(stepField).not.toBeNull();
    stepField.value = "Agentic LLMs, Open-source Frontier Models";
    stepField.dispatchEvent(new Event("input"));

    // Verify Prompt Preview Live Update
    const promptPreview = document.getElementById("fw_prompt_preview") as HTMLTextAreaElement;
    expect(promptPreview.value).toBe(
      "As a strategic foresight planner for National Research University, analyze: Agentic LLMs, Open-source Frontier Models."
    );

    // 6. Test Copy Prompt Button and Prompt Run Audit Trail
    const btnCopy = document.getElementById("fw_copy_prompt");
    btnCopy?.click();

    const currentProject = app.getActiveProject();
    expect(currentProject?.data.prompt_runs).toHaveLength(1);
    expect(currentProject?.data.prompt_runs?.[0].step_id).toBe("step_01");
    expect(currentProject?.data.prompt_runs?.[0].kind).toBe("prompt_copy");

    // 7. Advance to Next Step (Step 2)
    const btnNext = document.getElementById("fw_next");
    btnNext?.click();
    await app.renderRunner();

    expect(app.getActiveProject()?.step_index).toBe(1);

    const step2Field = document.getElementById("fw_step_step_02_final_decision") as HTMLTextAreaElement;
    expect(step2Field).not.toBeNull();
    step2Field.value = "Establish sovereign institutional computing hub.";
    step2Field.dispatchEvent(new Event("input"));

    // 8. Advance to Summary View (Step Index 2 == totalSteps)
    const btnGoSummary = document.getElementById("fw_next");
    btnGoSummary?.click();
    await app.renderRunner();

    expect(app.getActiveProject()?.step_index).toBe(2);

    // Verify Decision Summary Table
    const summaryTable = document.querySelector(".summary-table");
    expect(summaryTable?.textContent).toContain("Scan Emerging Drivers");
    expect(summaryTable?.textContent).toContain("Agentic LLMs, Open-source Frontier Models");
    expect(summaryTable?.textContent).toContain("Critical Assessment & Decision");
    expect(summaryTable?.textContent).toContain("Establish sovereign institutional computing hub.");

    // 9. Fill Capability & Governance Layer
    const capNotes = document.getElementById("capabilityNotes") as HTMLTextAreaElement;
    const govNotes = document.getElementById("governanceNotes") as HTMLTextAreaElement;
    capNotes.value = "Co-agency capability demonstrated in scenario synthesis.";
    capNotes.dispatchEvent(new Event("input"));
    govNotes.value = "Full human audit complete; approved for institutional implementation.";
    govNotes.dispatchEvent(new Event("input"));

    // 10. Finalise and Mark Project Completed
    vi.spyOn(window, "alert").mockImplementation(() => {});
    const btnFinalise = document.getElementById("sum_mark_completed");
    btnFinalise?.click();

    expect(app.getActiveProject()?.status).toBe("completed");

    // 11. Return to Dashboard
    const btnBack = document.getElementById("btnBackToDashboard");
    btnBack?.click();

    expect(runner?.classList.contains("hidden")).toBe(true);
    expect(dashboard?.classList.contains("hidden")).toBe(false);
    expect(emptyState?.classList.contains("hidden")).toBe(true);

    const cards = document.querySelectorAll(".card");
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0].textContent).toContain("Foresight 2026 Strategy Project");
    expect(cards[0].textContent).toContain("completed");

    // 12. Duplicate Project
    const pId = app.getActiveProject()?.id || app.getState().store.projects[0].id;
    const btnDup = document.getElementById(`dup_${pId}`);
    btnDup?.click();

    expect(app.getState().store.projects).toHaveLength(2);
    expect(app.getState().store.projects[0].name).toBe("Foresight 2026 Strategy Project (Copy)");

    // 13. Search Project Filter
    const searchInput = document.getElementById("projectSearch") as HTMLInputElement;
    searchInput.value = "nonexistent";
    searchInput.dispatchEvent(new Event("input"));

    const filteredCards = projectGrid?.querySelectorAll(".card");
    expect(filteredCards?.length).toBe(0);

    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));

    // 14. Delete Projects Cleanly
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const p1Id = app.getState().store.projects[0].id;
    const p2Id = app.getState().store.projects[1].id;

    app.deleteProject(p1Id);
    expect(app.getState().store.projects).toHaveLength(1);

    app.deleteProject(p2Id);
    expect(app.getState().store.projects).toHaveLength(0);
    expect(emptyState?.classList.contains("hidden")).toBe(false);
  });
});
