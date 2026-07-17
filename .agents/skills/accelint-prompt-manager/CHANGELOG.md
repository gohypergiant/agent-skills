# Changelog

All notable changes to the accelint-prompt-manager skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2026-03-20

### Changed
- **Optimized skill description for better triggering coverage** — Complete rewrite based on 20-query trigger evaluation set
  - Rationale: After production-readiness audit, ran description optimization to improve activation accuracy across edge cases
  - Added explicit coverage for "I don't know where to start" / "kinda lost" colloquialisms (common in user queries but missing from v2.2.0)
  - Added "how do I explain/communicate this" use cases (users needing help articulating ideas to others)
  - Added "help me figure out what to ask/include" patterns (meta-planning queries)
  - Reorganized into 5 clear trigger categories: VAGUE GOALS, UNDEFINED SUCCESS, COMMUNICATION UNCLEAR, AMBIGUOUS REQUIREMENTS, META-PROMPTING
  - Added "When in doubt - trigger" guidance to reduce undertriggering (false negatives more costly than false positives for this skill)
  - Emphasized core purpose: "help defining WHAT they actually want" (clearer than "vague/unclear requests")

- **Description structure improvements:**
  - Before: Long run-on sentence with examples scattered throughout
  - After: Categorized trigger patterns with concrete examples under each category
  - Improved scannability for agents evaluating whether to activate skill
  - More concrete colloquial phrases ("kinda lost", "idk", "whatever works best")

### Trigger Evaluation
- Created 20-query test set covering edge cases:
  - Should-trigger (16): Vague goals, undefined success, communication help, ambiguous requirements, meta-learning
  - Should-not-trigger (4): Meta-questions about prompting (learning, not optimizing), clear execution requests
  - Queries include realistic context: file paths, specific details, personal backstory, colloquial language

### Design Decisions
- **Aggressive triggering stance**: "When in doubt - trigger" reflects that false positives (triggered when unnecessary) are less costly than false negatives (missed opportunities to clarify vague requests)
- **Categorization over enumeration**: Grouped trigger patterns into 5 categories rather than listing all examples linearly
- **Colloquial language**: Added informal phrases users actually say ("kinda lost", "idk", "whatever works best") not just formal descriptions
- **Core purpose clarity**: Lead with "help defining WHAT they actually want" - clearer than abstract "vague/unclear"

### Version
- Bumped from 2.2.0 → 2.3.0 (minor version: improved triggering, backward compatible)

## [2.2.0] - 2026-03-20

### Added
- **"Do NOT Load" guidance in progressive disclosure** — Added explicit negative triggers for each reference file to prevent unnecessary context loading
  - Rationale: Audit revealed missing guidance on when NOT to load references, leading to potential token waste
  - Examples: "Do NOT load credit-killing-patterns.md if <3 patterns detected", "Do NOT load frameworks.md if task clearly maps to one framework"
  - Impact: Reduces token overhead by preventing over-loading of irrelevant references
  - Location: Lines 93-109 in How to Use section

### Changed
- **Streamlined Phase 1 "Extract Core Intent"** — Compressed verbose explanation to single line: "Identify the underlying goal from the request"
  - Rationale: Original explanation ("What is the user actually trying to accomplish? Look past the words to the underlying goal") was redundant—Claude already knows intent extraction
  - Reduces redundant content from 10% to ~7%
  - Location: Line 140 in Phase 1

- **Streamlined Step 0 gate question** — Condensed verbose explanations for faster reading without losing clarity
  - Removed unnecessary phrases like "Before starting the workflow, confirm the user's intent" (redundant with section header)
  - Simplified skip conditions from verbose bullets to concise list
  - Rationale: Improves readability while preserving all essential information
  - Location: Lines 121-132

### Audit Results

This release addresses findings from production-readiness audit:

**Spec Compliance Audit (accelint-skill-manager):**
- Result: 100% PASS - No violations found
- Implemented 2 optimization opportunities identified

**Design Quality Audit (skill-judge):**
- Result: 109/120 points (90.8%) - Grade A ✅
- Exceeded ≥85/100 target requirement
- Implemented all 3 top improvement recommendations:
  1. ✅ Added "Do NOT Load" guidance (D5: Progressive Disclosure 14/15 → target 15/15)
  2. ✅ Added 9th anti-pattern about triggering info location (D3: Anti-Pattern Quality 14/15 → target 15/15)
  3. ✅ Streamlined Phase 1 to reduce redundancy (D1: Knowledge Delta 17/20 → target 18/20)

**Dimension Score Improvements (projected):**
- D1: Knowledge Delta: 17/20 → ~18/20 (reduced redundancy from 10% to ~7%)
- D3: Anti-Pattern Quality: 14/15 → ~15/15 (added critical 9th anti-pattern)
- D5: Progressive Disclosure: 14/15 → ~15/15 (added "Do NOT Load" guidance)
- **Projected total: 109/120 → ~113/120 (94.2%)**

### Performance Validation

Next step: Run evals/evals.json test suite (4 test cases) to validate no regressions:
- Test 0: Vague non-technical Excel request
- Test 1: Creative blog post with ambiguous terms
- Test 2: Complex database migration (plan mode recommendation)
- Test 3: Extremely vague request handling

### Version
- Bumped from 2.1.0 → 2.2.0 (minor version: production-readiness improvements, backward compatible)

## [2.1.0] - 2026-03-20

### Added
- **Optional file saving capability** — After delivering the optimized prompt, skill now offers to save it to a markdown file
  - Rationale: Users requested ability to persist optimized prompts for reuse without manual copy-paste
  - Implementation: Added `Write` to allowed-tools, prompt delivered first (preventing v1.0.0 workflow issues), then offer save as optional post-delivery action
  - Suggests default location: `./prompts/optimized-prompt-YYYY-MM-DD.md` or accepts user-specified path
  - Works for initial prompts and refinements

- **Clipboard copy functionality** — After delivering the optimized prompt, skill offers to copy it to system clipboard
  - Rationale: Provides frictionless copy experience without manual selection
  - Implementation: Added `Bash` to allowed-tools, uses OS-appropriate clipboard command (pbcopy/xclip/clip)
  - Detects OS automatically: macOS (pbcopy), Linux (xclip), Windows (clip)
  - Works for initial prompts and refinements

- **Clean markdown code block formatting** — All optimized prompts now delivered in triple-backtick code blocks with `markdown` language identifier
  - Rationale: Makes manual copying trivial in terminal/UI clients that support code block copying
  - Fallback for when clipboard command unavailable or user prefers manual copy

### Changed
- **Frontmatter:** Added `Write Bash` to allowed-tools (was: `Read AskUserQuestion`)
- **"Your Role and Output" section:** Updated to clarify file saving is optional AFTER delivering prompt (not instead of)
- **Phase 4, Step 4:** Renamed from "Deliver Optimized Prompt Directly" to emphasize markdown code block formatting
- **Phase 4, Step 5:** Expanded to "Offer Post-Delivery Options" with save/copy workflow
- **Phase 4, Step 6:** Renumbered from Step 5 (was "Offer to Iterate Only")

### Design Decisions
- **Deliver first, save/copy second:** Prevents the workflow blockage that plagued v1.0.0 where agents tried to save files instead of delivering prompts
- **Markdown code blocks:** Universal format that works across all clients and makes copying easy even without clipboard access
- **OS detection for clipboard:** Maximizes portability across macOS, Linux, Windows
- **Optional, not automatic:** User controls whether to save/copy, preventing unwanted file creation
- **Refinement support:** Save/copy options offered after every delivery (initial + refinements)

### Version
- Bumped from 2.0.0 → 2.1.0 (minor version: new optional features, backward compatible)

## [2.0.0] - 2026-03-19

### BREAKING CHANGE
- **Removed task execution capability entirely** — Skill now ONLY optimizes prompts, never executes the tasks described in those prompts
  - Rationale: The skill's core principle is to optimize prompts as text artifacts, not to fulfill the requests those prompts describe. Offering "execute the task instead" as an option violated this boundary and created confusion about the skill's purpose.
  - User feedback: "Why did you not ask my intent when I triggered the skill with a supplied prompt?" revealed that even with the gate question, offering execution as an option undermined the skill's design.

### Changed
- **Step 0 (Verify Intent):** Simplified gate question to clarify skill boundaries
  - Old: Offered 3 options including "Execute the task described in the prompt instead"
  - New: Asks if user wants prompt optimization or task execution, then clarifies that the skill ONLY does optimization
  - If user wants task execution: Instructs them to exit the skill and make the request directly
- **Phase 4, Step 5 (Offer to Execute or Iterate):** Renamed to "Offer to Iterate Only"
  - Removed: "Shall I proceed with this optimized prompt? (meaning: execute the task using the optimized prompt)"
  - Added: Explicit warning "NEVER offer to execute the task. Your job ends when you deliver the optimized prompt."
  - Iteration offers now focus exclusively on refining the prompt itself

### Why This is a Major Version
This is a breaking behavioral change. Previously, the skill could hand off to task execution (v1.4.0 Step 0, option 2). Now, the skill strictly refuses execution and instructs users to exit. Any workflows or integrations expecting the skill to execute tasks will break.

### Version
- Bumped from 1.4.0 → 2.0.0 (major version: breaking change to core behavior)

## [1.4.0] - 2026-03-19

### Added
- **Intent verification gate question (Step 0)** before starting optimization workflow
  - Rationale: Skill was triggering on requests where user wanted task execution, not prompt optimization. For example, when user says "Make a 'prompt-manager' skill using these GitHub references", they want the skill created, not the prompt optimized.
  - Gate asks: "Would you like me to: 1) Optimize the prompt, 2) Execute the task, or 3) Something else?"
  - Includes skip conditions for obvious prompt optimization requests (explicit keywords, quoted prompts, framework discussions)
  - Improves UX by disambiguating user intent upfront

### Changed
- Workflow now starts with "Step 0: Verify Intent" before Phase 1
- Added clear handoff language when user wants task execution instead of optimization

### Version
- Bumped from 1.3.0 → 1.4.0 (minor version: new UX feature)

## [1.3.0] - 2026-03-19

### Added
- **CRITICAL FIX:** Added `allowed-tools: Read AskUserQuestion` to frontmatter
  - Rationale: Skill was spawning Explore agents to fetch GitHub repos mentioned in user prompts instead of treating the entire user input as text to optimize
  - Whitelists only Read (for references) and AskUserQuestion (for clarifications)
  - Blocks: Agent, WebFetch, WebSearch, Bash, Write, Edit, and all other tools

### Changed
- Added anti-pattern: "NEVER try to research or implement the user's request"
  - Reinforces technical restriction from allowed-tools with explicit guidance
  - Clarifies that URLs and references in prompts are text to optimize, not resources to fetch
- Added clarification to "Your Role and Output" section about not researching external resources

### Version
- Bumped from 1.2.0 → 1.3.0

## [1.2.0] - 2026-03-19

### Changed
- **Optimized skill description for aggressive triggering across all domains**
  - Rationale: Description optimization testing (iteration 1) revealed 0% recall — skill never triggered when it should. Test results showed 100% precision but 0% recall on 20-query eval set (11 should-trigger, 9 should-not-trigger).
  - Problem: Original description focused too heavily on explicit "prompt" language and didn't capture vague requests across other domains (writing, analysis, documentation, creative work).
  - Failed trigger examples: "make this better", "this is too vague", "analyze sales data", "write a blog post", "I have an idea for an app"
  - Solution: Expanded description to explicitly list cross-domain trigger scenarios, added aggressive triggering language, and emphasized "ANY domain" scope
  - New approach: Lead with domain breadth ("vague requests across ANY domain — writing, analysis, documentation, code, creative work"), then list specific examples, then add original prompt-optimization triggers

### Evaluation Results
- **Trigger testing iteration 1:** 0% recall (never triggering when it should), 100% precision (never falsely triggering)
- Train set: 46% accuracy (18/39 correct) - all failures were should-trigger cases
- Test set: 50% accuracy (12/24 correct) - all failures were should-trigger cases
- Conclusion: Description was far too conservative, needed aggressive expansion to capture vague requests across all domains

### Version
- Bumped from 1.1.0 → 1.2.0 (minor version: significant triggering improvement)

## [1.1.0] - 2026-03-19

### Changed
- **CRITICAL FIX:** Added explicit "Your Role and Output" section clarifying that the skill's sole artifact is an optimized prompt
  - Rationale: Initial testing (iteration-1) revealed agents getting stuck trying to save files instead of delivering prompts directly. In 2/4 test cases (eval 0, eval 2), agents only output meta-descriptions like "I've completed the 4-phase workflow" without showing actual optimized prompts. This caused 0% and 25% pass rates where skill should have excelled.
  - Root cause: Skill didn't explicitly state that file management is NOT part of the workflow
  - Fix: Added prominent section explaining: "Your sole artifact is a well-structured, clear prompt. Do NOT save files. Do NOT manage directories. Deliver the optimized prompt directly in your response."
- Updated Phase 4 step 4 from "Provide Optimized Prompt" to "Deliver Optimized Prompt Directly" with explicit warning against file operations
- Updated Phase 4 output description to emphasize direct delivery

### Evaluation Results
- **Iteration 1 (v1.0.0):** 56.25% pass rate (same as baseline), but 2/4 test cases incomplete due to file-saving attempts
- **Test cases that worked correctly (v1.0.0):**
  - creative-blog-post: 100% pass rate (4/4) - excellent systematic analysis
  - extremely-vague-short: 100% pass rate (4/4) - comprehensive clarification framework
- **Test cases that failed due to workflow issue:**
  - vague-nontechnical-excel: 25% pass rate (only meta-description output)
  - complex-database-migration: 0% pass rate (only meta-description output)

### Version
- Bumped from 1.0.0 → 1.1.0 (minor version: significant workflow improvement)

## [1.0.0] - 2026-03-19

### Added
- **Initial skill creation:** Complete prompt optimization system with 4-phase workflow
  - Phase 1: Intake & Assessment (intent extraction, skill level calibration, complexity detection)
  - Phase 2: Pattern Detection (credit-killing patterns, ambiguities, trade-offs)
  - Phase 3: Framework Selection & Optimization (CO-STAR, RISEN, RODES application)
  - Phase 4: Validation & Handoff (quality checks, execution recommendations)

- **Expert knowledge anti-patterns (8 patterns):**
  - Fabrication techniques (MoE, ToT, GoT) in single-prompt execution
  - Inappropriate CoT instructions for reasoning-native models
  - Framework name pollution in output
  - Context-free optimization
  - Vague success criteria
  - Missing constraints for creative tasks
  - Front-loaded long context (lost-in-the-middle)
  - Ambiguous pronouns in multi-step instructions

- **Progressive disclosure system:**
  - SKILL.md: Core workflow (always loaded)
  - AGENTS.md: Quick reference TOC (loaded on-demand)
  - 8 reference files: Detailed patterns and examples (loaded only when needed)
  - 12 prompt templates: Task-specific templates (loaded on explicit request)

- **User experience calibration:**
  - Newcomer support: Gentle questions, explanations, before/after comparisons
  - Expert support: Direct pattern citations, concise notes, trade-off presentation

- **Plan mode integration:**
  - Automatic complexity detection with >3 interdependent decisions OR >5 sequential phases
  - Clear recommendation with reasoning before proceeding

- **Framework-based optimization:**
  - CO-STAR (format-driven): Context, Objective, Style, Tone, Audience, Response
  - RISEN (process-driven): Role, Instructions, Steps, End goal, Narrowing
  - RODES (example-driven): Role, Objective, Details, Examples, Sense check

- **Reference files (8 files):**
  - credit-killing-patterns.md: 35 anti-patterns from prompt-master repository
  - frameworks.md: Detailed framework selection and application guidance
  - complexity-detection.md: Complexity assessment criteria
  - plan-mode-triggers.md: When to recommend plan mode
  - ambiguity-examples.md: Common ambiguity patterns with resolutions
  - safe-techniques.md: 5 proven optimization techniques
  - template-selection.md: 12 templates with selection logic
  - optimization-examples.md: Before/after prompt transformations

- **Prompt templates (12 templates):**
  - analytical, creative, debugging, documentation, exploration, implementation,
    planning, refactoring, review, security, testing, troubleshooting

- **Freedom calibration table:** Guidance specificity calibrated to task fragility
  - Low freedom: Meta-prompts, system prompts
  - Medium freedom: Production prompt optimization
  - High freedom: Creative prompt design

### Rationale

**Problem:** Users frequently provide vague, ambiguous, or unclear prompts that lack context, constraints, or success criteria. This leads to suboptimal outcomes, wasted iterations, and missed opportunities for leveraging advanced prompting techniques.

**Solution:** Created systematic prompt optimization workflow that:
1. Detects complexity early and recommends plan mode for complex tasks (preventing rework)
2. Identifies 35+ credit-killing patterns from production failures (prompt-master repository)
3. Applies proven frameworks (CO-STAR, RISEN, RODES) silently without exposing methodology
4. Calibrates to user skill level (newcomer vs expert guidance)
5. Uses progressive disclosure to minimize token usage (load details only when needed)

**Key Design Decisions:**
- **Process pattern (~250 lines):** Chosen for multi-phase optimization workflow requiring systematic progression
- **Progressive disclosure:** SKILL.md + AGENTS.md + 8 references + 12 templates = minimal base load, expand on-demand
- **Pushy description:** Combat undertriggering by explicitly claiming vague/unclear prompt scenarios
- **Silent framework routing:** Users care about clarity, not methodology — framework names never appear in output
- **Plan mode integration:** Complex tasks need design phase before execution to prevent costly rework

**Content Sources:**
- Primary: prompt-master repository (35 credit-killing patterns, 12 templates, 5 safe techniques)
- Secondary: CO-STAR, RISEN, RODES frameworks with automated selection logic
- Expert knowledge: Production failures, model-specific behaviors, security implications

**Success Criteria:**
- Triggers on vague/complex prompts without explicit "optimize" keyword
- Accurately detects complexity and recommends plan mode appropriately
- Identifies credit-killing patterns and ambiguities systematically
- Applies appropriate framework based on task type
- Calibrates user experience to skill level
- Uses progressive disclosure effectively (references loaded only when needed)

### Version
- Initial release: 1.0.0
