# Stage 1 Audit Report — accelint-persona-review

## Audit method
Used `/skill:skill-creator` guidance as the audit standard, then reviewed the skill package statically. No runtime evals were executed in this stage.

## Overall grade
**A-**

## Audit summary

### Strengths
- **Strong trigger boundaries** — `skills/accelint-persona-review/SKILL.md` frontmatter clearly defines when the skill should trigger and excludes near-miss cases such as generic visual-polish feedback, product strategy, and non-design writing work.
- **Clear evidence-oriented workflow** — the skill requires loading the persona index first, then only the requested persona, and delays loading `references/evaluation-examples.md` until critique time.
- **Good uncertainty discipline** — the skill explicitly separates persona evidence, design evidence, supporting-doc evidence, and inference, and tells the reviewer to state limits when the review is screenshot-only or supporting docs are unavailable.
- **Reasonable evaluation coverage** — `skills/accelint-persona-review/evals/evals.json` covers Figma URL review, screenshot fallback, Outline unavailable, ambiguous persona handling, invalid persona handling, evidence discipline, and negative boundary cases.

### Weaknesses
- **MCP fallback guidance is high-level** — the skill says to use the appropriate Figma MCP tool and Outline MCP, but does not provide a tighter failure-mode playbook for malformed node IDs, partial Figma access, or empty Outline results.
- **README usage may be misleading** — `skills/accelint-persona-review/README.md` uses command-style examples that can drift from the package’s actual skill-trigger model.
- **Some eval assertions are broad** — several checks appear likely to require subjective grading unless more explicit grading guidance or more objective assertions are added.

## Evidence
- **Static audit evidence** only.
- Files directly reviewed:
  - `skills/accelint-persona-review/SKILL.md`
  - `skills/accelint-persona-review/CHANGELOG.md`
  - `skills/accelint-persona-review/README.md`
  - `skills/accelint-persona-review/evals/evals.json`
  - referenced local guidance files as needed

## Improvement opportunities
1. Add a more explicit MCP fallback/decision path in `SKILL.md` for common access and retrieval failures.
2. Tighten `README.md` usage wording so it matches automatic skill invocation rather than implying a required slash command.
3. Improve eval/grading specificity so evidence-labeling and refusal/redirect behavior are easier to judge consistently.

## Confidence
**Moderate.** The audit is grounded in repository evidence, but confidence is limited by the absence of executed evals or observed run transcripts.
