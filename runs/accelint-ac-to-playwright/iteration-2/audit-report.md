# Stage 1 Audit Report — accelint-ac-to-playwright

## Scope
Audited `skills/accelint-ac-to-playwright` using the skill-creator workflow guidance plus direct package inspection and validation runs.

## Grade
**A-**

## Audit summary
This skill is already strong: the package builds and tests cleanly, the core contract is explicit, and the eval set covers a broad range of assessment and conversion cases. The main issues found were limited and evidence-based: one package-level security vulnerability in the installed dependency graph, a documentation drift point in the package README, and a few instruction-density/scannability issues in `SKILL.md` that could make execution less reliable under long prompts.

## Evidence

### Executed validation evidence
1. **Build passed**
   - Command: `cd skills/accelint-ac-to-playwright && npm run build`
   - Result: succeeded.
2. **Tests passed**
   - Command: `cd skills/accelint-ac-to-playwright && npm test`
   - Result: `20` test files passed, `293` tests passed.
   - Coverage: `96.54%` statements, `91.73%` branches, `98.73%` functions, `98.57%` lines.
3. **Security audit found one high-severity vulnerability**
   - Command: `cd skills/accelint-ac-to-playwright && npm audit --json`
   - Result: `1` high severity vulnerability.
   - Affected package: transitive `postcss` advisory `GHSA-r28c-9q8g-f849`.
   - Impact on confidence: lowers package-readiness confidence until dependency graph is updated.

### Static audit evidence
1. **README package docs drift from current skill contract**
   - `README.md` still describes supported actions broadly but does not foreground the assessment-first stop rule or the requirement that conversion mode must request explicit output directories before writing files.
   - The README is not the primary runtime contract, but repo maintainers may rely on it when auditing or extending the package.
2. **`SKILL.md` is behaviorally solid but dense**
   - The skill contains many hard requirements and exceptions.
   - Several sections repeat mode distinctions and negative rules in ways that are accurate but increase scan load.
   - Because agent skills rely on fast retrieval and compliance, high-density instruction blocks can reduce execution reliability even without changing meaning.
3. **Eval coverage is good but static**
   - `evals/evals.json` includes 16 realistic prompts spanning readiness checks, conversion, ambiguity handling, batching, keyboard, visibility, tags, and external source metadata.
   - No executed eval transcripts or benchmark artifacts were present in this run directory, so confidence about real triggered behavior comes from static coverage plus package tests rather than fresh skill-run comparisons.

## Strengths
- Clear separation between assessment mode and conversion mode.
- Strong explicit guardrails against guessing, invalid selectors, and invalid action generation.
- Good alignment between package code and core workflow rules based on inspected schema/translator files.
- Healthy unit/integration-style test coverage for the conversion toolchain.

## Weaknesses / risks
- Dependency vulnerability remains open in the current installed graph.
- README guidance is slightly behind the strongest current skill contract.
- Instruction density in `SKILL.md` may slow or weaken reliable execution in long multi-file tasks.

## Blockers
- No fresh skill-execution benchmark or human-review transcripts were available under this iteration run, so this audit could not compare actual with-skill outputs against a baseline. Recommendations should therefore label static-only conclusions clearly where applicable.
