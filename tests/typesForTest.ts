import type {
  Project,
  ProjectStore,
  ExerciseMeta,
  StructuredWorkflowExercise,
  ExerciseSourceStatus,
  Exercise
} from "../src/types";

export interface AIWorkflowAppType {
  APP_VERSION: string;
  STORAGE_KEY: string;
  IMPORTED_EXERCISES_KEY: string;
  BUNDLED_INDEX_URL: string;
  BUILTIN_EXERCISES: Exercise[];
  TEMPLATE_LABELS: Record<string, string>;
  loadProjectStore: () => ProjectStore;
  saveProjectStore: (store: ProjectStore) => void;
  loadImportedExercises: () => Exercise[];
  saveImportedExercises: (exercises: Exercise[]) => void;
  fetchExercisesIndex: () => Promise<ExerciseMeta[]>;
  fetchExerciseById: (id: string) => Promise<Exercise>;
  validateExerciseMinimal: (ex: unknown) => void;
  populateExercisePickers: () => void;
  buildExerciseRegistryList: () => ExerciseMeta[];
  createProjectFromExerciseMeta: (name: string, meta: ExerciseMeta) => Project;
  initProjectDataForTemplate: (template: string) => Project["data"];
  getProjectById: (id: string) => Project | null;
  getActiveProject: () => Project | null;
  touchProject: (project: Project) => void;
  buildMarkdownRecord: (project: Project) => Promise<string>;
  renderGlobalInputControl: (inp: unknown, value: unknown) => string;
  renderStepFieldControl: (stepId: string, f: unknown, value: unknown) => string;
  renderPromptTemplate: (
    template: string,
    globalInputs: Record<string, string>,
    stepFields: Record<string, string>
  ) => string;
  clamp: (n: number, min: number, max: number) => number;
  safeFilename: (name: string) => string;
  escapeHTML: (str: unknown) => string;
  escapeAttr: (str: unknown) => string;
  renderCapabilityGovernanceLayer: (project: Project) => string;
  wireCapabilityGovernanceLayer: (project: Project) => void;
  openNewProjectModal: () => void;
  closeNewProjectModal: () => void;
  renameProject: (id: string) => void;
  closeRenameProjectModal: () => void;
  saveRenameProject: () => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  showDashboard: () => void;
  showRunner: () => void;
  openProject: (projectId: string) => Promise<void>;
  renderDashboard: () => void;
  renderRunner: () => Promise<void>;
  init: () => Promise<void>;
  getState: () => {
    store: ProjectStore;
    activeProjectId: string | null;
    bundledIndex: ExerciseMeta[];
    exerciseCache: Map<string, StructuredWorkflowExercise>;
    importedExercises: Exercise[];
    sourceStatus: ExerciseSourceStatus;
  };
}
