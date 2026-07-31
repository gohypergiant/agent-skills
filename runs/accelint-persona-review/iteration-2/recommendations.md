# Stage 2 Recommendations — accelint-persona-review

## Recommendation 1
- **Issue observed:** The skill’s MCP handling is clear at a high level but underspecified for common failure modes such as malformed `node-id`, partial Figma access, empty selection, and empty Outline search results.
- **Evidence type:** Static audit evidence.
- **Evidence:** `skills/accelint-persona-review/SKILL.md` says to use the appropriate Figma MCP tool, convert `node-id=1-2` to `1:2`, and use Outline MCP, but it does not provide a compact decision path for what to do if selection is empty, the node cannot be fetched, or Outline returns no relevant docs.
- **Recommended improvement:** Add a short failure-mode playbook in `SKILL.md` covering malformed Figma node IDs, current-selection fallback, screenshot fallback, and how to proceed when Outline returns no useful documentation.
- **Expected benefit:** More consistent execution in headless/MCP-variable environments and less chance of the skill stalling or improvising inconsistent fallback behavior.
- **Confidence level:** High.

## Recommendation 2
- **Issue observed:** README usage examples imply a command-style interface that may not match how the skill is actually selected and used.
- **Evidence type:** Static audit evidence.
- **Evidence:** `skills/accelint-persona-review/README.md` centers `/persona-review ...` examples, while the package itself is described as an auto-triggered skill via frontmatter description and workflow guidance.
- **Recommended improvement:** Rewrite README usage to describe when the skill should trigger and present the command-style examples as illustrative prompts rather than required invocation syntax.
- **Expected benefit:** Reduces maintainer confusion and improves consistency between public documentation and actual skill behavior.
- **Confidence level:** Medium-high.

## Recommendation 3
- **Issue observed:** Some eval assertions are broad and may produce inconsistent grading, especially for evidence-labeling and negative-boundary behavior.
- **Evidence type:** Static audit evidence.
- **Evidence:** In `skills/accelint-persona-review/evals/evals.json`, assertions such as actionable recommendations and operational prioritization are useful but subjective, and negative cases do not consistently require explicit redirect/refusal behavior wording.
- **Recommended improvement:** Tighten the eval assertions or supporting guidance so graders can verify concrete behaviors like persona disambiguation, explicit uncertainty statements, and redirect behavior on non-fit prompts.
- **Expected benefit:** Improves repeatability of future optimization runs and makes quality changes easier to defend with stronger empirical evidence.
- **Confidence level:** Medium.

## Recommendation 4
- **Issue observed:** The skill already emphasizes evidence separation, but the operating sequence could better reinforce that supporting documents are optional evidence, not a blocking dependency.
- **Evidence type:** Static audit evidence.
- **Evidence:** `SKILL.md` tells the model to search Outline docs, but the strongest no-Outline fallback behavior is described later and could be easier to miss during execution.
- **Recommended improvement:** Tighten the workflow wording so it explicitly says the review should continue with persona profile plus design evidence when Outline adds no value or is unavailable.
- **Expected benefit:** Lowers the risk of over-searching, unnecessary blocking, or overstating the weight of supporting documents.
- **Confidence level:** Medium-high.

## Blockers affecting confidence
- No executed eval transcripts, benchmark outputs, or runtime tool failures were available in this workflow stage.
- Because the evidence is static-only at this point, recommendations favor minimal, high-value wording and documentation changes over structural rewrites.
