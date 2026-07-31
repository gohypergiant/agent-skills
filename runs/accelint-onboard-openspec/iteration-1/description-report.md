# Description optimization report

Updated `skills/accelint-onboard-openspec/SKILL.md` frontmatter description using the existing default eval coverage in `skills/accelint-onboard-openspec/evals/evals.json` and the run notes in `runs/accelint-onboard-openspec/`.

## What changed

- Expanded the trigger surface beyond initial setup to explicitly cover create, import, append, dry-run, and refresh workflows.
- Added stronger wording for existing-config scenarios, including restructuring custom YAML into the `context:` / `rules:` schema and refreshing from repo drift or unresolved `# TODO: fill in` markers.
- Added trigger language for terms that appeared in the eval set but were underrepresented in the original description, such as project DNA, refresh findings, and updating config from repo facts.
- Clarified negative boundaries so the skill does not over-trigger on adjacent requests for `AGENTS.md` / `CLAUDE.md`, architecture documentation, or unrelated coding help.
- Kept the description anchored on the concrete deliverable: producing or revising `openspec/config.yaml`.

## Why

The prior description was solid for greenfield onboarding but under-specified several high-value cases covered by the default eval set:

- import mode with restructure / append / dry run
- refresh mode driven by drift, findings, and unresolved TODOs
- separation from companion workflows like `accelint-onboard-agents`
- boundary protection against architecture-doc requests

The new description should improve trigger quality by naming those workflows directly while reducing ambiguity about what this skill should not own.
