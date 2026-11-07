import { describe, it, expect, beforeEach } from "vitest";
import { loadHtmlAndApp } from "./testHelper";

describe("Exercise Validation and Import Handling", () => {
  let app: ReturnType<typeof loadHtmlAndApp>;

  beforeEach(() => {
    localStorage.clear();
    app = loadHtmlAndApp();
  });

  describe("validateExerciseMinimal", () => {
    it("accepts valid framework-style structured_workflow exercise", () => {
      const valid = {
        id: "fw_test_valid",
        title: "Test Framework Workflow",
        template: "structured_workflow",
        version: "1.0",
        workflow: { summary: "Foresight review" },
        guardrails: ["Follow ethical guidelines"],
        inputs_required: [{ key: "domain", label: "Domain", type: "text" }],
        steps: [
          {
            step_id: "step_01",
            title: "Context Setting",
            fields: [{ key: "scope", label: "Scope" }]
          }
        ]
      };

      expect(() => app.validateExerciseMinimal(valid)).not.toThrow();
    });

    it("accepts valid legacy-style structured_workflow exercise", () => {
      const legacy = {
        id: "legacy_test_valid",
        title: "Legacy Workflow",
        template: "structured_workflow",
        version: "0.9",
        scenario: { intro: "Legacy scenario" },
        steps: [
          {
            id: "step_legacy_1",
            title: "Initial Step",
            guidance: "Do this first"
          }
        ]
      };

      expect(() => app.validateExerciseMinimal(legacy)).not.toThrow();
    });

    it("accepts valid reflection_deck and prompt_library templates", () => {
      const deck = {
        id: "deck_01",
        title: "Reflection Deck",
        template: "reflection_deck",
        cards: [{ card_id: "c1", prompt: "Reflect on AI governance" }]
      };
      expect(() => app.validateExerciseMinimal(deck)).not.toThrow();

      const lib = {
        id: "lib_01",
        title: "Prompt Library",
        template: "prompt_library",
        items: [{ item_id: "i1", prompt: "Generate syllabus" }]
      };
      expect(() => app.validateExerciseMinimal(lib)).not.toThrow();
    });

    it("rejects non-object or null input", () => {
      expect(() => app.validateExerciseMinimal(null)).toThrow("Exercise is not an object");
      expect(() => app.validateExerciseMinimal(undefined)).toThrow("Exercise is not an object");
      expect(() => app.validateExerciseMinimal("string")).toThrow("Exercise is not an object");
      expect(() => app.validateExerciseMinimal(123)).toThrow("Exercise is not an object");
    });

    it("rejects missing or invalid id", () => {
      expect(() => app.validateExerciseMinimal({ template: "structured_workflow" })).toThrow(
        "Exercise missing id"
      );
      expect(() => app.validateExerciseMinimal({ id: 123, template: "structured_workflow" })).toThrow(
        "Exercise missing id"
      );
    });

    it("rejects missing or invalid template", () => {
      expect(() => app.validateExerciseMinimal({ id: "ex_1" })).toThrow("Exercise missing template");
      expect(() => app.validateExerciseMinimal({ id: "ex_1", template: "unknown_template" })).toThrow(
        "Unsupported template: unknown_template"
      );
    });

    it("rejects structured_workflow without steps or invalid steps array", () => {
      expect(() =>
        app.validateExerciseMinimal({ id: "ex_1", template: "structured_workflow" })
      ).toThrow("structured_workflow missing steps[]");

      expect(() =>
        app.validateExerciseMinimal({ id: "ex_1", template: "structured_workflow", steps: "not-array" })
      ).toThrow("structured_workflow missing steps[]");

      expect(() =>
        app.validateExerciseMinimal({
          id: "ex_1",
          template: "structured_workflow",
          steps: [{ invalid: "no step_id and no id" }]
        })
      ).toThrow("structured_workflow steps must include either step_id (framework) or id (legacy)");
    });

    it("rejects non-array guardrails if provided", () => {
      expect(() =>
        app.validateExerciseMinimal({
          id: "ex_1",
          template: "structured_workflow",
          steps: [{ step_id: "s1" }],
          guardrails: "not-an-array"
        })
      ).toThrow("structured_workflow guardrails must be an array if provided");
    });

    it("rejects reflection_deck without cards array and prompt_library without items array", () => {
      expect(() =>
        app.validateExerciseMinimal({ id: "ex_1", template: "reflection_deck" })
      ).toThrow("reflection_deck missing cards[]");

      expect(() =>
        app.validateExerciseMinimal({ id: "ex_1", template: "prompt_library" })
      ).toThrow("prompt_library missing items[]");
    });
  });

  describe("Exercise Registry and Lookup", () => {
    it("builds exercise registry merging bundled and imported exercises without duplicates", () => {
      const state = app.getState();
      state.bundledIndex = [
        {
          id: "bundled_1",
          title: "Bundled Ex 1",
          template: "structured_workflow",
          version: "1.0",
          source: "bundled"
        }
      ];

      state.importedExercises = [
        {
          id: "imported_1",
          title: "Imported Ex 1",
          template: "structured_workflow",
          version: "1.0",
          steps: [{ step_id: "s1", title: "Step 1" }]
        },
        // Duplicate ID should not duplicate in registry
        {
          id: "bundled_1",
          title: "Duplicate Bundled In Imported",
          template: "structured_workflow",
          version: "1.0",
          steps: [{ step_id: "s1", title: "Step 1" }]
        }
      ];

      const registry = app.buildExerciseRegistryList();
      expect(registry).toHaveLength(2);
      expect(registry.map((r: { id: string }) => r.id)).toEqual(["bundled_1", "imported_1"]);
    });

    it("fetches exercise by id from cache or imported exercises", async () => {
      const customEx = {
        id: "imported_test_cache",
        title: "Cached Exercise",
        template: "structured_workflow" as const,
        version: "1.0",
        steps: [{ step_id: "s1", title: "Step 1" }]
      };

      const state = app.getState();
      state.importedExercises = [customEx];

      const fetched = await app.fetchExerciseById("imported_test_cache");
      expect(fetched).toEqual(customEx);
      expect(state.exerciseCache.get("imported_test_cache")).toEqual(customEx);
    });

    it("throws error when exercise is not found", async () => {
      await expect(app.fetchExerciseById("non_existent_exercise")).rejects.toThrow(
        "Exercise not found"
      );
    });
  });
});
