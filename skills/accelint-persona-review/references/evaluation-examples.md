# Evaluation Examples

Examples of effective and ineffective persona-based design reviews.

## What Makes a Good Persona Review

### ✅ Specific to Persona Profile

**Good:**
> The manual track validation workflow creates friction for ASTs who are already juggling 7+ systems (documented pain point). The current design requires them to context-switch between BCS-F, RS-4, and ERSA before making a valid/not-valid determination. Consider consolidating validation inputs into a single view, prioritized by the AST's decision criteria: radar signature clarity, weather pattern correlation, and ERSA visual confirmation.

**Why:** This directly references the persona's documented pain points and systems (`Sees`) and proposes a solution aligned with their workflow.

**Bad:**
> This interface could be more intuitive. Users need easier access to validation tools.

**Why:** This is generic advice that could apply to anyone. It does not reference the persona profile or operational context.

---

### ✅ Prioritize Operational Impact

**Good:**
> The alert notification design will interrupt the WD during fighter communications (critical "Hears" channel). For high-tempo scrambles, breaking concentration on Fighter Comms to acknowledge a system alert could delay relay of time-critical intercept vectors (documented "Says & Does"). Recommend: defer non-critical alerts until communication lull, or use peripheral visual indicators that don't demand immediate attention.

**Why:** This captures the operational stakes. Interrupting fighter comms has real consequences. It grounds the recommendation in the persona's documented workflow.

**Bad:**
> The notification colors don't follow our style guide. Let's make them more consistent.

**Why:** This prioritizes visual polish over operational effectiveness and misses the persona's actual need.

---

### ✅ Respect Domain Expertise

**Good:**
> The simplified threat assessment UI removes details about presumed target locations and alternate intercept vectors - information WDs use for COA generation (documented "Says & Does"). While the streamlined view reduces visual clutter, it eliminates data WDs need for manual mission planning (documented pain point: "Manual COA generation"). Consider: keep detailed view as default, offer simplified view as optional toggle.

**Why:** This recognizes that "simplification" can remove necessary complexity and respects the operator's expertise.

**Bad:**
> This screen shows too much information at once. Let's hide the advanced details to make it simpler for operators.

**Why:** This assumes operators are overwhelmed by complexity they actually need. That approach would remove critical data.

---

### ✅ Connect Across Profile Sections

**Good:**
> The base status overlay mutation system addresses WD's documented pain point ("Manually updates base status with overlay mutations"), but the design doesn't account for the fact that they also monitor Radio Mx Board (documented "Sees") and coordinate over DEN ("Hears"). When base status changes, they need to relay T.A.s over DEN ("Says & Does"). Consider: auto-populate DEN relay template when base status changes, prepopulating with relevant details from the mutation.

**Why:** This synthesizes insights from `Pain Points`, `Sees`, `Hears`, and `Says & Does` to propose an integrated solution.

**Bad:**
> This overlay feature is nice. It will make updating base status easier.

**Why:** This is a surface-level observation. It does not connect to the broader workflow context.

---

## What to Avoid

### ❌ Generic UX Advice

Don't say: "Make it more intuitive" / "Improve the user experience" / "Add better labels"

These apply to any interface. Ground every observation in the persona's specific profile.

### ❌ Assuming Simplification is Always Better

Don't say: "This is too complex, simplify it"

Operators are domain experts. Necessary complexity enables their work. Only flag complexity that doesn't serve their documented responsibilities.

### ❌ Ignoring Operational Context

Don't say: "Add a training tutorial for this feature"

Consider their schedule and work tempo. An E1 surveillance tech on a busy schedule doesn't have time for extensive tutorials. Design should align with their existing mental models from systems they already use.

### ❌ Treating All Personas the Same

Don't say: "Operators will find this confusing"

Different personas have different experience levels, responsibilities, and pain points. An E4 AST review should differ from an O4 MCC review for the same interface.

---

## Output Format Flexibility

The skill provides an example output structure, but you can adapt it based on:

- **Depth of findings**: If cognitive load is the primary concern, expand that section and condense the others.
- **Persona profile completeness**: If supporting docs provide rich context, reference them heavily.
- **Design scope**: A single component needs a different structure than a full dashboard review.

The critical elements are:
1. A clear connection to the persona's documented profile
2. Specific, actionable recommendations
3. Prioritization based on operational impact
4. Evidence from supporting documentation when available

Do not force findings into sections where they do not naturally fit. Let the persona's actual needs drive the structure.
