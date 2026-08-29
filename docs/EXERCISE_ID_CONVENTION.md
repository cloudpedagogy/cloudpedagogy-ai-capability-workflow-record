# CloudPedagogy AI Capability Workflow Record

## Exercise ID Convention (Canonical Specification v1.2)

This document defines the **mandatory naming convention** for all
`structured_workflow` JSON exercise files used in CloudPedagogy AI Capability Workflow Record.

These rules ensure:

-   Registry stability
-   LocalStorage integrity
-   Version traceability
-   Future auto-detection by ID prefix
-   Cross-course scalability
-   Governance-safe referencing
-   Compatibility with hosted (S3 / GitHub Pages) deployments

Exercise IDs must follow this specification.

------------------------------------------------------------------------

# 1. Why ID Stability Matters

Each exercise ID:

-   Acts as a registry key
-   Is referenced by localStorage projects
-   May be parsed by the tool for exercise-type detection
-   May be used in governance documentation
-   May be bundled via `/exercises/index.json`
-   Must remain stable once published

Changing an ID after publication can break project references.

------------------------------------------------------------------------

# 2. General ID Rules (Apply to All Exercise Types)

All exercise IDs must:

-   Be lowercase only
-   Use hyphenated course slugs
-   Use double-underscore separators `__`
-   Use zero-padded chapter numbers (ch03)
-   Avoid lesson identifiers (the tool is chapter-level only)
-   Avoid timestamps
-   Avoid random tokens
-   Avoid spaces
-   Avoid special characters
-   Remain stable once released

IDs are deterministic, not decorative.

------------------------------------------------------------------------

# 3. Framework Application Exercises

Used for: Applying the AI Capability Framework at chapter level.

Format:

    fw_apply__course-slug__chNN__vN

Example:

    fw_apply__genai-in-strategic-decision-making-and-institutional-intelligence__ch03__v1

------------------------------------------------------------------------

# 4. Prompt Template Exercises

Used for: Structured prompt design workflows at chapter level.

Format:

    pt_apply__course-slug__chNN__vN

------------------------------------------------------------------------

# 5. Reflection & Discussion Exercises

Used for: Structured critical reflection workflows.

Format:

    rd_apply__course-slug__chNN__vN

------------------------------------------------------------------------

# 6. File Naming Convention

The JSON file name MUST match the ID exactly:

    <ID>.json

Example:

    fw_apply__genai-in-strategic-decision-making-and-institutional-intelligence__ch03__v1.json

When bundling exercises for hosted deployment:

-   Files must be placed inside `/exercises/`
-   They may optionally be registered in `/exercises/index.json`
-   IDs must match registry entries exactly

------------------------------------------------------------------------

# 7. Versioning Rules

-   v1 → Initial release
-   v2 → Structural workflow change
-   v3 → Major redesign
-   Minor textual edits that do NOT change structure should not
    increment version
-   Never modify an existing ID once published
-   Always increment version instead

------------------------------------------------------------------------

# 8. Hosted Deployment Considerations

When the tool is hosted (e.g., S3, GitHub Pages):

-   Exercise IDs function identically to local deployments
-   Projects remain stored in end-user browser localStorage
-   No data is stored server-side
-   Registry integrity depends on stable ID references

ID stability ensures long-term portability and audit traceability.

------------------------------------------------------------------------

# 9. What End Users Must NOT Do

Do NOT:

-   Invent custom prefixes
-   Use descriptive names instead of canonical IDs
-   Insert timestamps
-   Insert personal identifiers
-   Modify IDs after publishing
-   Remove version numbers
-   Introduce lesson codes (lsNN)

------------------------------------------------------------------------

# 10. Summary

The Exercise ID Convention ensures:

-   Stability
-   Scalability
-   Governance integrity
-   Registry consistency
-   Future-proof system architecture

This naming system is mandatory for all `structured_workflow` JSON
exercises generated via canonical meta-prompts.

Specification version: 1.2 (hosted deployment clarity aligned)
