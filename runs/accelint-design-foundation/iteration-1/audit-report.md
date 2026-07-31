# accelint-design-foundation audit

Overall grade: B+

## Key strengths
- Strong domain specificity around `@accelint/design-foundation` and `@accelint/design-toolkit`.
- Good coverage of important pitfalls: semantic tokens, spacing scale, outlines, `@variant`, CSS layers, and setup requirements.
- Solid progressive-disclosure structure with focused reference files.
- Useful troubleshooting guidance for common setup failures.

## Concrete weaknesses
- Frontmatter description under-triggered on migration, troubleshooting, and review-oriented requests.
- Core skill body did not clearly prioritize setup diagnosis before styling advice.
- Main CSS module example omitted the required `@reference` directive even though the skill correctly says it is mandatory.
- No changelog or default eval set existed, which made version tracking and regression testing weaker.

## Recommended improvements
- Broaden the description to cover styling, migration, setup, troubleshooting, and review use cases in the same stack.
- Add a short responsibility section so the skill checks setup first when tokens or variants fail.
- Add a response pattern that keeps outputs concise and implementation-first.
- Correct the example CSS module to include `@reference`.
- Add a Keep a Changelog file and a default `evals/evals.json` set for ongoing maintenance.
