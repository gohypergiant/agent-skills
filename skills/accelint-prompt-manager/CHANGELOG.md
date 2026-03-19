# Changelog

All notable changes to the accelint-prompt-manager skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
