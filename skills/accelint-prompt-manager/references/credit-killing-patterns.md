# Credit-Killing Patterns

These are production-tested anti-patterns that reliably degrade prompt quality. Each comes from hard-won experience of what actually fails in practice.

## What

Specific prompt construction patterns that reduce model effectiveness, increase token waste, or produce unreliable outputs. These patterns "kill credits" by burning API calls without proportional value.

## Why It Matters

Generic advice like "be clear" doesn't prevent concrete failures. These patterns represent actual problems encountered in production systems processing millions of prompts. Knowing what NOT to do is half of expert knowledge.

---

## 1. Fabrication Techniques (MoE, ToT, GoT) {#fabrication}

**Pattern:** Asking Claude to "act as 3 experts and debate", "explore multiple reasoning paths in a tree", or "build a graph of connected thoughts".

**Why It Fails:** These techniques (Mixture-of-Experts, Tree-of-Thought, Graph-of-Thought) make Claude invent conversations between fake personas rather than deepening its own reasoning. The model fabricates the appearance of multi-agent collaboration without actual benefit. You get theatrical output that looks impressive but doesn't improve reasoning quality.

**Example:**
❌ "Act as 3 experts (a frontend dev, a backend dev, and a DBA). Debate the best approach to implementing this feature."
✅ Split into 3 separate prompts, each asking Claude to reason from one perspective, then synthesize results.

**When to Use Instead:** Plan mode for complex multi-perspective tasks, or sequential prompts with explicit perspective shifts.

---

## 2. Chain-of-Thought on Reasoning-Native Models {#cot}

**Pattern:** Adding "think step by step", "show your reasoning", "explain your thought process" to prompts for Claude 4.5+.

**Why It Fails:** Claude 4.5+ already uses extended thinking natively. Adding explicit CoT instructions wastes tokens and can degrade output quality by forcing artificial structure over natural reasoning flow. The model already reasons deeply—you're just making it document that process redundantly.

**Example:**
❌ "Think step by step and show your reasoning: Calculate the optimal cache TTL for this API."
✅ "Calculate the optimal cache TTL for this API." (Claude 4.5+ reasons internally without prompting)

**Model-Specific:** Older models (pre-Claude 4.5, GPT-3.5) DO benefit from explicit CoT. Know your target model.

---

## 3. Framework Name Pollution {#naming}

**Pattern:** Outputting "Using CO-STAR framework...", labeling sections with "(Context)", "(Objective)", or explaining the methodology you're applying.

**Why It Fails:** Users care about clarity and results, not prompt engineering methodology. Exposing framework names adds noise without value. It's like a chef describing knife techniques instead of serving the meal.

**Example:**
❌ "Using the CO-STAR framework: [Context] You're a senior engineer... [Objective] Refactor this..."
✅ "You're a senior engineer refactoring legacy authentication code. Make it secure, maintainable, and test-covered..."

**Rule:** Route through frameworks silently. The structure improves quality invisibly.

---

## 4. Context-Free Optimization {#context}

**Pattern:** Optimizing prompts without knowing where they'll run (interactive chat vs API vs system prompt), what model will execute them, or what tools are available.

**Why It Fails:** A prompt for Claude Code (with file access, git tools, bash) differs fundamentally from one for ChatGPT (text-only) or an API call (no conversation history). Context determines optimization strategy.

**Example:**
❌ Generic optimization: "Write a function to parse JSON"
✅ Context-aware optimization:
  - Claude Code: "Read data.json, parse it, handle malformed entries by logging to errors.txt"
  - API call: "Parse this JSON string: {...}. Return parsed object or error details."

**Key Contexts to Consider:**
- Model capabilities (reasoning, tool use, multimodal)
- Available tools/integrations
- Conversation history (cold start vs continuation)
- Token budget (interactive vs batch)
- User expectations (speed vs thoroughness)

---

## 5. Vague Success Criteria {#criteria}

**Pattern:** Using unmeasurable terms like "make this better", "comprehensive documentation", "clean code", "improve performance".

**Why It Fails:** Without objective validation, success is subjective and inconsistent. What's "comprehensive" to one person is "excessive" to another. "Better" compared to what? Models can't hit a target they can't see.

**Example:**
❌ "Write comprehensive tests for this API"
✅ "Write tests covering: (1) happy path, (2) auth failures, (3) rate limiting, (4) malformed input. Target 80%+ branch coverage."

**Fix:** Pin criteria to measurable outcomes, specific edge cases, or concrete examples.

---

## 6. Missing Creative Constraints {#constraints}

**Pattern:** Giving creative tasks unlimited freedom: "write a blog post", "design a logo", "create marketing copy".

**Why It Fails:** Without boundaries, creative tasks produce wildly inconsistent results. You'll get anything from 100-word summaries to 5000-word essays, formal academic tone to casual social media style. Constraints enable creativity by defining the solution space.

**Example:**
❌ "Write a blog post about our new feature"
✅ "Write a 500-word blog post for technical decision-makers announcing our new caching feature. Tone: professional but approachable. Include: problem statement, solution overview, 2-3 specific benefits, call-to-action. Avoid: jargon, marketing hype, buzzwords."

**Key Constraints:** Tone, length, style references, what to avoid, audience, format.

---

## 7. Front-Loaded Long Context (Lost-in-the-Middle) {#context-positioning}

**Pattern:** Embedding all context at the beginning of very long prompts, then asking questions at the end.

**Why It Fails:** The "lost-in-the-middle" phenomenon causes models to weaken attention on middle sections of long inputs. Critical information buried in the middle gets lower weight than content at start or end.

**Example:**
❌ "[5000 words of API documentation] ...Based on all of the above, write error handling code."
✅ "Write error handling code for this API. Key requirements: [summary]. Full API reference: [link or appendix]. Critical: retry on 429/503, fail on 401/403."

**Fix:** Place critical instructions at beginning and end. Reference detailed context instead of embedding it inline.

---

## 8. Ambiguous Pronouns in Multi-Step Workflows {#pronouns}

**Pattern:** Using "it", "this", "that", "them" in complex instructions spanning multiple steps.

**Why It Fails:** After several steps, pronouns become ambiguous. "Validate it" — validate what? The input, the output, the config? Ambiguity compounds across steps, causing execution drift.

**Example:**
❌ "Parse the JSON, validate it, transform it, then save it to the database."
✅ "Parse the JSON input. Validate the parsed data against schema.json. Transform the validated data using transform_rules.py. Save the transformed data to the users table."

**Fix:** Replace pronouns with specific nouns in multi-step instructions.

---

## 9. Overloaded Prompts

**Pattern:** Trying to accomplish 5+ distinct tasks in a single prompt.

**Why It Fails:** Models allocate attention across all requested tasks. With too many simultaneous objectives, quality degrades on all of them. You get shallow execution instead of deep work on any single task.

**Example:**
❌ "Review this code for bugs, suggest performance improvements, write tests, update documentation, and refactor for readability."
✅ Split into sequential prompts: (1) bug review, (2) performance analysis, (3) test writing, (4) docs update, (5) refactoring.

**Rule:** One primary objective per prompt. Complex projects need plan mode.

---

## 10. Temporal References in System Prompts

**Pattern:** Using "today", "currently", "recent", "this week" in permanent system prompts or skill files.

**Why It Fails:** System prompts persist across sessions. "Recent work on the auth system" becomes meaningless after months. Temporal references decay, creating confusion.

**Example:**
❌ "Focus on the authentication refactor we're currently working on"
✅ "When working on authentication code, prioritize security and maintainability"

**Fix:** Use permanent, context-independent language in system prompts.

---

## 11. Example-Free Abstract Instructions

**Pattern:** Describing what you want abstractly without showing concrete examples.

**Why It Fails:** "Write in a conversational tone" means different things to different people. Without examples, models guess at your intent.

**Example:**
❌ "Write commit messages in our style"
✅ "Write commit messages following these examples:
  - fix: resolve race condition in websocket handler
  - feat: add rate limiting to public API endpoints
  - chore: update dependencies for security patches"

**Fix:** Show don't tell. Include 2-3 concrete examples.

---

## 12. Undefined Audience

**Pattern:** Not specifying who the output is for: "write documentation", "explain this code", "create a tutorial".

**Why It Fails:** Documentation for senior engineers differs drastically from docs for beginners. Without audience definition, you get generic middle-ground output that satisfies no one.

**Example:**
❌ "Document this API"
✅ "Document this API for frontend developers integrating it for the first time. Assume familiarity with REST but not our auth system."

**Fix:** Always specify audience: skill level, domain knowledge, role.

---

## 13. Missing Error Handling Guidance

**Pattern:** Requesting operations without specifying how to handle failures.

**Why It Fails:** Models don't know whether to retry, fail fast, log and continue, or prompt for input. Inconsistent error handling across similar operations.

**Example:**
❌ "Fetch data from all these APIs and combine the results"
✅ "Fetch data from all these APIs. On 429/503: retry with exponential backoff (max 3 attempts). On 401/403: fail immediately with error details. On success: combine results and deduplicate by ID."

**Fix:** Specify error handling strategy for each failure mode.

---

## 14. Format Ambiguity

**Pattern:** Not specifying output format when multiple formats are plausible.

**Why It Fails:** "Analyze this data" could yield paragraphs of text, a bulleted list, JSON, a table, or visualizations. Format mismatch breaks downstream processing.

**Example:**
❌ "Extract all user emails from this log file"
✅ "Extract all user emails from this log file. Output format: JSON array of strings, one email per element, deduplicated."

**Fix:** Explicitly request format: markdown, JSON, CSV, bulleted list, etc.

---

## 15. Assuming Domain Knowledge

**Pattern:** Using domain jargon or acronyms without definition.

**Why It Fails:** Models have broad knowledge but may not know your company's specific terminology. "BOPIS", "SKU", "OKR", "SLO" without context leads to misinterpretation.

**Example:**
❌ "Calculate BOPIS availability for high-velocity SKUs"
✅ "Calculate Buy-Online-Pickup-In-Store (BOPIS) availability for products with >100 daily orders (high-velocity SKUs)."

**Fix:** Define domain-specific terms on first use, even if they seem obvious.

---

## Additional Patterns (16-35)

These patterns follow the same structure. Due to space constraints, here are abbreviated entries:

**16. Unbounded Lists:** "List all possible..." without limits → specify "top 5" or "most important 3"
**17. Missing Priority Guidance:** Multiple requirements without ranking → specify must-have vs nice-to-have
**18. Implicit Assumptions:** Assuming model knows project context → make context explicit
**19. Negative Instructions Only:** "Don't do X, Y, Z" without positive guidance → specify what TO do
**20. Scope Creep:** Starting focused then adding "also..." repeatedly → define full scope upfront
**21. Mixed Abstraction Levels:** Alternating between high-level goals and implementation details → maintain consistent abstraction
**22. Passive Voice Overload:** "Data should be validated..." → use active voice "Validate the data..."
**23. Long Conditional Chains:** Nested if-then-else logic → use decision tables or separate prompts per path
**24. Unanchored Superlatives:** "The best approach" → best by what criteria? (speed, maintainability, cost)
**25. Generic Personas:** "Act as an expert" → specify expertise domain and experience level
**26. Missing Validation Steps:** No quality checks → specify validation criteria
**27. Undefined Edge Cases:** "Handle errors" → which specific errors?
**28. Time Pressure Signals:** "Quickly..." or "ASAP..." → clarify scope reduction vs time constraint
**29. Implied Preferences:** Expecting model to guess your taste → make preferences explicit
**30. Context Dumping:** Pasting entire files without highlighting relevant sections → point to specific lines
**31. Revision Without Criteria:** "Make it better" → specify what's wrong with current version
**32. Unmotivated Constraints:** "Must use library X" without explaining why → provide rationale for constraints
**33. Success Without Definition:** "Optimize this" → optimize for what? (speed, memory, readability)
**34. Jargon Overload:** Dense technical terminology → balance precision with clarity
**35. Missing Baseline:** "Improve performance" → improve from what baseline? By how much?

## How to Apply

When optimizing a prompt, scan for these patterns systematically. Each detected pattern has a concrete fix. This list is not exhaustive—new anti-patterns emerge with new models and use cases—but these 35 represent the most common production failures.
