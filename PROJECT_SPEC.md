# PROJECT_SPEC: ai capability studio

## 1. Repo Name
`ai capability studio`

## 2. One-Sentence Purpose
A static, offline-first browser tool for documenting and governing structured human-AI workflows.

## 3. Problem the App Solves
Lack of clear audit trails, human oversight documentation, and privacy-preserving environments for AI-assisted institutional workflows (higher education/public sector).

## 4. Primary User / Audience
Educators, researchers, strategy teams, and governance leaders.

## 5. Core Role in the CloudPedagogy Ecosystem
Operationalizes AI capability frameworks by providing a practical, governance-compliant interface for documenting structured collaboration between humans and AI.

## 6. Main Entities / Data Structures
- **Project**: Stores the user's current session state, including inputs, completed steps, and prompt snapshots.
- **Exercise**: A JSON template defining the 6-step `structured_workflow` schema, instructions, and prompt templates.

## 7. Main User Workflows
1. **New Project**: Initialize a project from a bundled or imported Exercise template.
2. **Step Completion**: Traverse 6 sequential steps, documenting inputs and AI-assisted outputs.
3. **Human-Choice Recording**: Explicitly document human refined judgment and decisions.
4. **Governance Export**: Generate a Markdown or JSON record for audit trails.

## 8. Current Features
- Browser-based dashboard.
- Continuous auto-save via `localStorage`.
- Static JSON exercise loading and manual imports.
- Multi-format exports (Markdown/JSON).
- Responsive UI for desktop browsers.

## 9. Stubbed / Partial / Incomplete Features
- Listed as a "Stable prototype" with "Chapter-level architecture locked," but no explicit "TODO" features listed in README.

## 10. Import / Export and Storage Model
- **Storage**: Browser `localStorage` (origin-specific).
- **Import**: JSON `Exercise` files.
- **Export**: JSON `Project` files and Markdown audit records.

## 11. Relationship to Other CloudPedagogy Apps
Acts as a reference implementation for executing workflows designed by the "Meta-Prompt Pack" or theoretical capability frameworks defined in other repositories.

## 12. Potential Overlap or Duplication Risks
May overlap with specific feature areas of `curriculum-simulation-tool` or `workflow-governance-designer`, but focuses specifically on the *recording* of the live workflow.

## 13. Distinctive Value of This App
Zero-data transmission (complete privacy), offline accessibility, and explicit separation of "Exercises" (blueprints) from "Projects" (active work).

## 14. Recommended Future Enhancements
(Inferred) Integration with institutional repositories for centralized record storage; department-specific exercise bundles; multi-user review flows if ported to a backend-enabled environment.

## 15. Anything Unclear or Inferred from Repo Contents
References to "institutional customization" suggest the app is intended as a base for white-labeled versions but details are not provided in the public repo code.

## Capability and Governance Alignment
This tool is aligned with the CloudPedagogy Capability and Governance standard.
Capability: The tool supports development of practical AI capability through structured interaction and workflow use.
Governance: The tool includes lightweight, optional fields that make assumptions, risks, and decisions visible and reviewable.
This alignment ensures the tool supports both effective use of AI and responsible, accountable practice.
