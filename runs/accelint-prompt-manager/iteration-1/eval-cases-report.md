# accelint-prompt-manager eval cases report

Updated default eval set for non-interactive use in `evals/evals.json`.

## Coverage summary

The generated eval set covers 12 realistic prompt-optimization scenarios across the skill's main behavior boundaries:

1. Vague non-technical data request with unclear success criteria
2. Creative writing prompt with ambiguous tone and missing constraints
3. High-complexity migration request that should trigger plan-mode guidance
4. Extremely vague request that requires foundational intake questions
5. Explicit Claude Code prompt-improvement request with coding-agent context
6. Fragile system-prompt editing with policy-preservation and token-economy constraints
7. Incident-analysis prompt refinement requiring evidence vs hypothesis separation
8. Junior-analyst workflow prompt that needs simpler language and stepwise structure
9. Social-post generation prompt with strong anti-fluff and audience constraints
10. Rewrite of credit-killing prompt patterns for Claude 4.5 behavior
11. Batch/API workflow prompt that must be self-contained and non-interactive
12. Risk-sensitive vendor-comparison prompt with uncertainty and legal-safety constraints

## Evaluation intent

These cases are designed to check that the skill consistently:

- stays in prompt-optimization mode instead of executing the underlying task
- asks targeted clarification questions when critical details are missing
- skips the intent gate when the user explicitly asks for prompt optimization
- recommends planning for complex, interdependent downstream work
- adapts output to execution context such as Claude Code, batch jobs, and system prompts
- detects and removes credit-killing prompt patterns
- improves vague success criteria, constraints, structure, and audience calibration

## Notes

- The set is intentionally non-interactive-friendly: each case has a concrete expected behavior and assertion set even when the ideal live behavior would involve asking clarifying questions.
- Coverage emphasizes realistic near-production requests rather than toy prompts.
- All changes are scoped to the `skills/accelint-prompt-manager` directory.
