# Stage 2 Recommendations — accelint-nextjs-best-practices

Only recommendations supported by directly observed repository evidence are included below.

## 1. Add an explicit Pages Router handling path in `SKILL.md`
- **issue observed:** The frontmatter description promises Pages Router coverage, but the body is mostly App Router-oriented and gives little explicit direction for Pages Router requests.
- **evidence type:** Static audit evidence
- **evidence:** `SKILL.md` description says the skill applies to “App Router or Pages Router work,” while most body sections, examples, and reference routing focus on App Router, Server Components, Server Actions, and `app/api` route handlers. The eval set also includes a Pages Router boundary case (`evals/evals.json`, id 14).
- **recommended improvement:** Add a short “Pages Router adaptation” section telling agents to keep the same performance/security principles but answer with `getServerSideProps`, Pages API routes, and Pages-era constraints when the user explicitly says Pages Router.
- **expected benefit:** Reduces mismatch between trigger promise and delivered guidance, improving correctness on boundary cases without broadening scope.
- **confidence level:** High

## 2. Clarify task-shape triage before loading deeper references
- **issue observed:** The skill tells the agent what files exist, but not quite enough about which starting path to use for common task shapes.
- **evidence type:** Static audit evidence
- **evidence:** `SKILL.md` says to start with `AGENTS.md`, triage with `references/quick-checklist.md`, then load specific rules, but it does not sharply distinguish targeted fix, broad audit, route-handler review, or uncertainty cases. The supporting artifacts already exist, so this is an instruction-layer gap rather than a missing-file problem.
- **recommended improvement:** Add a concise triage matrix in `SKILL.md` explaining which artifact to consult first for: targeted fix, multi-file audit, route-handler/security review, and uncertain diagnosis.
- **expected benefit:** Faster, more consistent use of bundled artifacts and less unnecessary context loading.
- **confidence level:** High

## 3. Add a current-docs verification rule for uncertain or version-sensitive Next.js behavior
- **issue observed:** The skill gives high-confidence framework guidance but does not explicitly tell the agent to verify uncertain or version-sensitive behavior against current official Next.js docs.
- **evidence type:** Static audit evidence
- **evidence:** `SKILL.md` links official Next.js docs under “Additional Resources,” but the workflow does not say when to consult them. Next.js behavior changes over time, especially around route handlers, caching, and server/client boundaries.
- **recommended improvement:** Add a short rule telling agents to verify uncertain or version-sensitive claims against current official Next.js documentation before making strong assertions, especially when the user mentions a specific Next.js version or an unusual API combination.
- **expected benefit:** Lowers the chance of stale guidance and increases trustworthiness on evolving framework behavior.
- **confidence level:** Medium-High

## 4. Tighten route-handler guidance to cover proxy/header-forwarding/caching and memory-aware exports
- **issue observed:** The eval set covers route-handler security and scalability cases more broadly than the body currently does.
- **evidence type:** Static audit evidence
- **evidence:** `evals/evals.json` includes prompts about a large authenticated export built fully in memory (id 3) and a proxy route handler that forwards all headers and caches aggressively (id 16). `SKILL.md` mentions route handlers and security, but it does not explicitly call out safe header forwarding, authenticated cache boundaries, or memory-aware response patterns.
- **recommended improvement:** Add concise route-handler review guidance in `SKILL.md` that tells agents to assess auth consistency, least-privilege header forwarding, authenticated caching risks, and response-shape/memory strategy for large exports.
- **expected benefit:** Better alignment between the skill instructions and the repository’s own eval coverage, improving reliability on realistic API review requests.
- **confidence level:** High

## 5. Avoid broad changes beyond documented gaps
- **issue observed:** Evidence supports targeted instruction improvements, not a large rewrite.
- **evidence type:** Static audit evidence
- **evidence:** The package already has strong structure, compact size (204 lines in `SKILL.md`), and complete supporting artifacts. The main problems are coverage and clarity gaps.
- **recommended improvement:** Apply minimal edits in `SKILL.md` only, preserving frontmatter and existing references unless direct evidence requires more.
- **expected benefit:** Improves precision without risking regression in a skill that already grades strongly.
- **confidence level:** High

## Confidence / Blockers
- **Blocker:** No executed eval transcripts, benchmark outputs, or human feedback were available in this workflow.
- **Impact on confidence:** Recommendations are strong where repository evidence is direct, but they remain less certain than changes validated by live eval behavior.
