# Stage 2 Recommendations — accelint-ts-audit-all

## 1. Normalize the workflow to one canonical step model
- **Issue observed:** The skill uses conflicting step counts: “9-step audit process,” “8-Step Process plus archive,” and progress text like “Step Y of 8.”
- **Evidence type:** Static audit evidence
- **Evidence:** `skills/accelint-ts-audit-all/SKILL.md` mixes 9-step and 8-step terminology; `skills/accelint-ts-audit-all/assets/audit-process-template.md` includes “all 9 steps are done” and also “Step Y of 8.”
- **Recommended improvement:** Choose one canonical model and apply it consistently across `SKILL.md`, templates, and supporting docs. The cleanest option is to describe **8 execution steps plus archive/completion** everywhere.
- **Expected benefit:** Reduces operator confusion, improves resumability, and lowers maintenance drift across package files.
- **Confidence level:** High

## 2. Harden the merge-back shell example
- **Issue observed:** The example for extracting the original branch from the audit process file appears brittle.
- **Evidence type:** Static audit evidence
- **Evidence:** `skills/accelint-ts-audit-all/SKILL.md` uses `grep "^**Original Branch:**" ${audit_process_file} | cut -d'`' -f2`, which is fragile because the markdown asterisks are regex-significant and the pattern is unlikely to match safely as written.
- **Recommended improvement:** Replace the example with a safer, exact-match approach that clearly targets the markdown line format, or simplify the guidance so it does not depend on a fragile parsing command.
- **Expected benefit:** Improves reliability in headless execution and reduces copy-paste failure risk during merge completion.
- **Confidence level:** High

## 3. Reconcile template verification guidance with the main workflow
- **Issue observed:** The audit-process template includes a bench-command slot that is not clearly integrated into the main verification flow.
- **Evidence type:** Static audit evidence
- **Evidence:** `skills/accelint-ts-audit-all/assets/audit-process-template.md` lists test, build, bench, and lint commands, while `SKILL.md` frames required verification primarily around exact test/build/lint commands.
- **Recommended improvement:** Clarify in both places that bench commands are optional and only used when applicable, rather than appearing as a default required step.
- **Expected benefit:** Reduces ambiguity about required verification work and keeps the template aligned with the actual orchestration logic.
- **Confidence level:** Medium-High

## 4. Add eval coverage for ambiguous approval input and mid-approval interruption
- **Issue observed:** Eval coverage strongly checks that the approval structure exists, but less directly tests malformed approval responses or resumption while approval is still pending.
- **Evidence type:** Static audit evidence
- **Evidence:** `skills/accelint-ts-audit-all/evals/evals.json` includes strong coverage for approval sequencing (for example, evals 12, 13, and 18), but no clear eval focused on ambiguous replies like partial numbered selections with commentary, or context interruption between issue presentation and acceptance.
- **Recommended improvement:** Add one or two evals for ambiguous user acceptance input and one eval for saving/resuming while awaiting approval.
- **Expected benefit:** Better protection against real-world conversational variance in a skill whose workflow depends heavily on exact approval handling.
- **Confidence level:** Medium

## 5. Keep README aligned but reduce behavior drift risk
- **Issue observed:** The package maintains behavior guidance in both `SKILL.md` and `README.md`, while `SKILL.md` also tells agents not to load the README.
- **Evidence type:** Static audit evidence
- **Evidence:** `skills/accelint-ts-audit-all/README.md` contains workflow descriptions, examples, and guardrails that overlap with `SKILL.md`; `SKILL.md` explicitly says not to load the README.
- **Recommended improvement:** Keep README user-facing, but tighten wording so it summarizes rather than re-specifies nuanced agent behavior. Where possible, point back to `SKILL.md` as canonical.
- **Expected benefit:** Lowers drift risk without requiring structural package changes.
- **Confidence level:** Medium

## Recommendation strength summary
- **Strongest, evidence-backed changes:** step-model normalization and shell-example hardening.
- **Moderate changes:** template verification alignment and eval expansion.
- **Lower-scope hygiene change:** README drift reduction.
