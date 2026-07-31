# accelint-skill-prose eval coverage report

- Updated `skills/accelint-skill-prose/evals/evals.json` to 35 eval cases.
- Coverage spans rewrite-only, audit-only, audit-plus-rewrite, and no-rewrite decisions.
- Cases cover frontmatter trigger safety, workflow/guardrail preservation, RFC-2119 severity normalization, exact-token preservation, rationale preservation, synonym-drift detection, referent ambiguity, output-mode compliance, rewrite-mode boundaries, folder-level artifact-set handling, progressive-disclosure file selection, and unchanged-file classification.
- Prompts include both direct prose edits and meta-behavior checks so the eval set exercises execution rules as well as rewrite quality.
- Several cases anchor expected behavior against neighboring skills and reference files to test cross-skill and cross-file safety, not just isolated sentence cleanup.
