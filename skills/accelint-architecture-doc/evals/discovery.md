# Description-selection pilot

This checks whether a model selects `accelint-architecture-doc` from its description. It does not execute the skill or measure automatic selection among competing skills.

## Inputs and procedure

`discovery.json` records 17 prompts and expected selections. The cases cover document creation and maintenance, requests without a filename, standalone exclusions, and the exception for advice, planning, and diagrams used in document updates. Three cases repeat the original description's unqualified trigger phrases.

Compare the description in `SKILL.md` with the description at baseline commit `8d979e68783cd8fa45a8c7aa34e708be9221f484`. Give each version to a separate fresh model context with the same prompts and settings. Do not expose `should_select` labels to the evaluator. Use this instruction with the skill name, description, and an array of request IDs and prompts:

```text
Evaluate skill selection only. For each request, decide whether the provided skill description applies. Do not execute requests. Return only a JSON array with id and select boolean for every request.
```

Record the returned selections, model, settings, and any failed runs. Compare each result with `should_select`. Keep the descriptions separate so one evaluation cannot borrow wording from the other.

## Observed results

On 2026-09-11, separate fresh-context GPT-6 Astra subagents at low reasoning matched all 17 expected selections for both descriptions. Each agent classified all prompts in one batch. `discovery-results.json` contains the transcribed selections.

The description decreased from 790 to 390 characters, a 50.6% reduction in characters. This is not a token, latency, or cost measurement. The workflow body after frontmatter is byte-for-byte unchanged from the baseline.

A Claude Code run was attempted, but authentication was unavailable. No Claude result is claimed. The 17-case set includes three original trigger phrases added after an independent review of the initial 14-case set; both Astra runs reported here used the final set.

## Remaining validation

Run the same comparison on the Claude models the team supports. Test automatic discovery with competing installed skills and execute a representative workflow through its preview approval gate on Claude and Astra. Use the existing `evals.json` workflow scenarios for that follow-up. The single-pass selection results here do not establish general cross-model compatibility or completion quality.
