# accelint-skill-prose description optimization report

## Outcome
No frontmatter description change was applied to `skills/accelint-skill-prose/SKILL.md`.

## What I evaluated
- Used the `skill-creator` description-optimization workflow in non-interactive mode.
- Generated a default trigger eval set with 18 realistic near-miss and should-trigger queries.
- Ran the optimization loop for 5 iterations with the current session model (`gpt-5.4`).

## Why no change was applied
The optimization run did not produce a description that outperformed the current one on held-out evals.

- Current description held the best test score: `4/7`
- Best train score reached by a candidate: `7/11`
- Multiple rewritten candidates matched or underperformed the original on test data
- The candidates mainly rephrased the same boundaries but did not reliably improve triggering for the missed positive cases

Because the run-loop selected the existing description as `best_description`, applying a rewrite would not have been evidence-based or clearly safer.

## Observed pattern
The eval negatives were consistently handled well, but several positive cases still under-triggered across both the original and candidate descriptions, especially requests about:
- behavior-preserving rewrites of agent instructions
- frontmatter trigger-clarity audits
- skill-folder prose passes across `SKILL.md` plus linked references

That suggests the remaining limitation is not obviously fixed by simple frontmatter rewording alone.

## Files changed
- Wrote this report: `runs/accelint-skill-prose/description-report.md`
- Left unchanged: `skills/accelint-skill-prose/SKILL.md`
