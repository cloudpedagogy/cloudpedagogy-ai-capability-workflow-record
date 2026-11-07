/**
 * CloudPedagogy AI Capability Workflow Record - Domain Types
 * Fully typed schema definitions preserving existing storage keys,
 * field structures, and historical data compatibility.
 */

export type TemplateType = "structured_workflow" | "reflection_deck" | "prompt_library";

export type ProjectStatus = "draft" | "in_progress" | "completed";

export interface ExerciseMeta {
  id: string;
  title: string;
  template: TemplateType;
  version: string;
  tags?: string[];
  source: "bundled" | "imported" | "builtin";
  file?: string;
}

export interface InputRequired {
  key: string;
  label?: string;
  type?: "text" | "select" | "textarea";
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface StepField {
  key: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

export interface PromptBlock {
  title?: string;
  prompt_template?: string;
  body?: string;
}

export interface WorkflowStepFramework {
  step_id: string;
  title: string;
  instructions?: string[];
  fields?: StepField[];
  prompt_block?: PromptBlock;
}

export interface WorkflowStepLegacy {
  id: string;
  title: string;
  guidance?: string;
}

export type WorkflowStep = WorkflowStepFramework | WorkflowStepLegacy;

export interface StructuredWorkflowExercise {
  id: string;
  title?: string;
  template: "structured_workflow";
  version?: string;
  tags?: string[];
  workflow?: {
    summary?: string;
    objectives?: string[];
  };
  summary?: string;
  guardrails?: string[];
  inputs_required?: InputRequired[];
  steps: WorkflowStep[];
  scenario?: {
    intro?: string;
  };
  prompt_starters?: string[];
}

export interface ReflectionDeckExercise {
  id: string;
  title?: string;
  template: "reflection_deck";
  version?: string;
  tags?: string[];
  cards: unknown[];
}

export interface PromptLibraryExercise {
  id: string;
  title?: string;
  template: "prompt_library";
  version?: string;
  tags?: string[];
  items: unknown[];
}

export type Exercise = StructuredWorkflowExercise | ReflectionDeckExercise | PromptLibraryExercise;

export interface PromptRun {
  step_id: string;
  kind: "prompt_copy" | "prompt_run";
  at: string;
}

export interface StructuredWorkflowProjectData {
  inputs?: Record<string, string>;
  steps?: Record<string, Record<string, string>>;
  completed_steps?: Record<string, boolean>;
  prompt_runs?: PromptRun[];
  legacy_notes_by_step?: Record<string, string>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  app_version: string;
  schema_version: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  exercise: ExerciseMeta;
  step_index: number;
  data: StructuredWorkflowProjectData;
  capabilityNotes?: string;
  governanceNotes?: string;
}

export interface ProjectStore {
  app_version: string;
  projects: Project[];
}

export interface ExerciseSourceStatus {
  bundledLoaded: boolean;
  bundledError: string;
  importedCount: number;
  builtinCount: number;
}
