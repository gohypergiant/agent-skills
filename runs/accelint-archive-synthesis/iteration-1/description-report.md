# Description report

## Updated description
Periodically audit the full OpenSpec archive for cross-change decision drift, stale or contradictory archived decisions, `openspec/specs/INDEX.md` drift, and capability over-coupling that only becomes visible across many archived changes. Use this skill when the user asks to run archive synthesis, audit the OpenSpec archive, check whether older decisions still hold, look for contradictions across archived changes, reconcile `openspec/specs/INDEX.md` against live `spec.md` files, find stale capability summaries, or review whether a capability has become too interconnected. Also use it when `accelint-qrspi-archive` suggests a synthesis run after enough new archives and the human explicitly agrees. Do not use it for proposing a new change, implementing a change, archiving a change, or single-change verification; this skill is for periodic, corpus-wide, human-approved archive audits that stop at findings until the human confirms any action.

## Rationale
- Switched from a mostly jargon-heavy description to more natural archive-audit phrasing.
- Added realistic trigger language for contradictions, stale summaries, and over-coupling.
- Strengthened corpus-wide scope boundaries so the skill does not compete with single-change workflows.
- Made the human-approved, stop-at-findings behavior explicit in the description itself.
