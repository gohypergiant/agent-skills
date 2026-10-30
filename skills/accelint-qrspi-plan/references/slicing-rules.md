# Slicing Rules for tasks.md

Rules `accelint-qrspi-plan` applies to a generated `tasks.md` before Checkpoint 2. `accelint-qrspi-apply` depends on vertical slicing, the `- [ ]` checklist format, and the Parallelization Strategy section.

Work through the three parts in order. Edit `tasks.md` in place with the Edit tool.

## Contents

- Part 1: Validate vertical slicing structure
- Part 2: Convert horizontal slicing to vertical slices
- Part 3: Check for and add the Parallelization Strategy section

## Part 1: Validate vertical slicing structure

**VERTICAL SLICING (required for accelint-qrspi-apply)**:

Each slice must deliver an end-to-end testable feature path, NOT a horizontal
layer. Structure the work so that after completing Slice 1, you have something
demonstrable and testable.

✓ CORRECT - Vertical (end-to-end feature slices):
```
Slice 1: Mock API + working frontend (user can see and click, no real data)
Slice 2: Wire real service layer (now pulls actual data)
Slice 3: Add database integration (data persists)
```

✗ WRONG - Horizontal (architectural layers):
```
Slice 1: All database migrations
Slice 2: All service layer changes
Slice 3: All API endpoints
Slice 4: All frontend components
```

**Indicators of VERTICAL slicing (correct)**:
- Each slice has a "Deliverable:" that describes a working, testable feature
- Slices cross architectural boundaries (e.g., a slice touches both CLI and implementation)
- Each slice ends with something demonstrable to a user or stakeholder
- Parallelization is possible with minimal dependencies between slices

**Indicators of HORIZONTAL slicing (incorrect)**:
- Slices are organized by layer: "Database changes", "Service layer", "API routes", "Frontend"
- Deliverables are architectural components, not user-facing features
- Early slices cannot be tested end-to-end without later slices
- Slices have sequential dependencies (must finish layer 1 before layer 2)

Requirements for each slice:
- Deliverable: A working, testable increment (e.g., "CLI with security removed from public API")
- Test: Explicit verification steps showing the slice works end-to-end
- Parallelization: Slices should be independent enough to implement concurrently with minimal blocking
- Checkpoints: Each subtask has a "Test:" line describing verification
- Size: Prefer 3-5 major slices; more than 5 suggests scope is too large
- Duration: Max 2 hours per subtask; break larger work into smaller subtasks

**CRITICAL: Testing Throughout (not just at the end)**:

EVERY vertical slice must include testing steps. If testing only appears in the
final slice, the structure is actually horizontal slices masquerading as vertical.

✓ CORRECT - Testing in every slice:
```
Slice 1: Mock API + working frontend
- [ ] Build mock API endpoint
- [ ] Create frontend component
- [ ] Test: Verify UI renders and responds to mock data

Slice 2: Wire real service layer
- [ ] Add service layer implementation
- [ ] Connect frontend to service
- [ ] Test: Verify real data flows from service to UI

Slice 3: Add database integration
- [ ] Add database queries
- [ ] Update service to use database
- [ ] Test: Verify data persists and loads correctly
```

✗ WRONG - All testing deferred to the end:
```
Slice 1: Mock API + working frontend
- [ ] Build mock API endpoint
- [ ] Create frontend component

Slice 2: Wire real service layer
- [ ] Add service layer implementation
- [ ] Connect frontend to service

Slice 3: Add database integration
- [ ] Add database queries
- [ ] Update service to use database
- [ ] Test everything end-to-end  ← RED FLAG: Only testing appears here
```

**When validating tasks.md**, check that:
- EACH slice has explicit test steps within that slice
- Test steps verify the slice's specific deliverable (not just "run tests")
- No slice consists purely of building without testing
- The final slice is NOT just "test everything" — that's a sign of horizontal work

## Part 2: Convert horizontal slicing to vertical slices

REQUIRED: The `qrspi-apply` skill requires vertical slicing. If the openspec-continue-change skill generated horizontal slices, you MUST restructure them before presenting them to the user.

**Conversion process**:

a) **Identify end-to-end feature paths**: Look for the smallest complete user-facing
   feature that touches all relevant architectural layers. For example:
   - Instead of: "Slice 1: All API changes" + "Slice 2: All CLI changes"
   - Convert to: "Slice 1: CLI help command (CLI + API)" + "Slice 2: CLI list command (CLI + API)"

b) **Restructure each slice** with these required elements:
   - **Deliverable:** - A working, demonstrable feature (not just "API endpoint exists")
   - **Test:** - Explicit verification showing the end-to-end path works
   - **Subtasks in markdown checklist format**: Each subtask MUST use `- [ ] instruction` format
   - Subtasks that cross layers (e.g., "- [ ] Update API handler" + "- [ ] Wire CLI command" + "- [ ] Add help text")

   CRITICAL: Preserve the markdown checklist format (`- [ ] ...`) for all subtasks.
   Do NOT use numbered lists (1. 2. 3.) or plain bullets (- without [ ]).
   The accelint-qrspi-apply skill depends on this format to track task completion.

c) **Ensure EVERY slice includes testing steps**: Check that each slice has explicit
   test subtasks within that slice, not just at the end. If testing only appears
   in the final slice, add test steps to each earlier slice:
   - Each slice should have one or more `- [ ] Test: <what to verify>` subtasks
   - Test steps should verify the slice's specific deliverable
   - Don't create a final "test everything" slice — testing belongs throughout

d) **Preserve parallelization opportunities**: Structure slices to be independent
   - Good: "Slice 1: auth flow" and "Slice 2: data export flow" are independent
   - Bad: "Slice 1: database schema" must complete before "Slice 2: service layer"

e) **Update Parallelization Strategy (if it exists)**: If the tasks.md already has
   a "## Parallelization Strategy" section, revise it to reflect the new slice
   structure (which slices can run in parallel, which have dependencies).
   Note: If the section doesn't exist, it will be added in Part 3.

f) **Write changes to tasks.md**: Edit the file in place using the Edit tool

g) **Show diff to user**: Display what changed and explain why (e.g., "Converted
   from layer-based to feature-based slices and added testing steps to each slice")

## Part 3: Check for and add the Parallelization Strategy section

After vertical slicing is validated or corrected, check whether tasks.md contains a `## Parallelization Strategy` section.

**If the section is missing or incomplete**, add it NOW using the Edit tool
to append to the end of tasks.md (after all slices):

```markdown
## Parallelization Strategy

### Dependencies (Must Complete First)

- **Slice X** must wait until Slices Y-Z complete (reason)

**Independent tasks (can run in parallel):**
- Slice A and Slice B are independent → can implement simultaneously
- Slice A and Slice C are independent → can implement simultaneously

**Sequential dependencies:**
- Slice D must complete before Slice E because (reason)

**Critical path:**
Slice X → Slice Y (reason for dependency)

**Recommended implementation order:**
1. Implement Slices A, B, C in parallel (description)
2. Implement Slice D (description)
3. Implement Slice E (description)
```

Keep it simple and focused on:
- Which slices can run in parallel (and why they're independent)
- Which slices must be sequential (and the dependency reason)
- Recommended order for implementation

DO NOT overcomplicate with excessive detail or edge cases.

**If the section exists but was part of a horizontal-to-vertical conversion**
(Part 2, item d), verify it accurately reflects the new vertical slice structure and
update if needed.
