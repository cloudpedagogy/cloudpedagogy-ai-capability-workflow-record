import { describe, it, expect, beforeEach } from "vitest";
import { loadHtmlAndApp } from "./testHelper";

describe("Workflow Logic and Prompt Template Rendering", () => {
  let app: ReturnType<typeof loadHtmlAndApp>;

  beforeEach(() => {
    localStorage.clear();
    app = loadHtmlAndApp();
  });

  describe("renderPromptTemplate", () => {
    it("interpolates global inputs and step fields into prompt templates", () => {
      const template = "You are an institutional foresight expert for {{institution_name}}. Evaluate {{strategic_goal}} in light of {{external_driver}}.";
      const globalInputs = {
        institution_name: "Metropolitan University",
        strategic_goal: "2030 Digital Campus Strategy"
      };
      const stepFields = {
        external_driver: "Emerging GenAI Automation"
      };

      const rendered = app.renderPromptTemplate(template, globalInputs, stepFields);
      expect(rendered).toBe(
        "You are an institutional foresight expert for Metropolitan University. Evaluate 2030 Digital Campus Strategy in light of Emerging GenAI Automation."
      );
    });

    it("handles whitespace variations inside placeholders", () => {
      const template = "Analyze {{  topic  }} with rigor: {{method}}.";
      const result = app.renderPromptTemplate(template, { topic: "AI Safety" }, { method: "Scenario Analysis" });
      expect(result).toBe("Analyze AI Safety with rigor: Scenario Analysis.");
    });

    it("replaces missing or null placeholders with empty strings", () => {
      const template = "Action: {{action}} | Target: {{missing_target}} | Notes: {{null_notes}}";
      const result = app.renderPromptTemplate(
        template,
        { action: "Scan Environment" },
        { null_notes: (null as unknown as string) }
      );
      expect(result).toBe("Action: Scan Environment | Target:  | Notes: ");
    });

    it("handles null or undefined template string gracefully", () => {
      expect(app.renderPromptTemplate("", {}, {})).toBe("");
      expect(app.renderPromptTemplate(null as unknown as string, {}, {})).toBe("");
      expect(app.renderPromptTemplate(undefined as unknown as string, {}, {})).toBe("");
    });
  });

  describe("Workflow Template Initialization", () => {
    it("initialises structured_workflow template with correct data structure", () => {
      const data = app.initProjectDataForTemplate("structured_workflow");
      expect(data).toEqual({
        inputs: {},
        steps: {},
        completed_steps: {},
        prompt_runs: []
      });
    });

    it("initialises reflection_deck template data structure", () => {
      const data = app.initProjectDataForTemplate("reflection_deck");
      expect(data).toEqual({
        responses: {},
        prompt_runs: {}
      });
    });

    it("initialises prompt_library template data structure", () => {
      const data = app.initProjectDataForTemplate("prompt_library");
      expect(data).toEqual({
        runs: []
      });
    });

    it("returns empty object for unknown template types", () => {
      expect(app.initProjectDataForTemplate("unknown")).toEqual({});
    });
  });

  describe("Capability and Governance Layer Rendering", () => {
    it("renders capability and governance layer with pre-filled notes", () => {
      const project = app.createProjectFromExerciseMeta("Test Project", {
        id: "ex_1",
        title: "Test Ex",
        template: "structured_workflow",
        version: "1.0",
        source: "bundled"
      });
      project.capabilityNotes = "AI Co-Agency Checkpoint";
      project.governanceNotes = "Risk analysis reviewed by Dean";

      const html = app.renderCapabilityGovernanceLayer(project);
      expect(html).toContain("Capability & Governance Notes (Optional)");
      expect(html).toContain("AI Co-Agency Checkpoint");
      expect(html).toContain("Risk analysis reviewed by Dean");
    });
  });
});
