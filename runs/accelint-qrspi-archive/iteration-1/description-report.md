# accelint-qrspi-archive description report

Description changed: yes

## Summary
- Rewrote the frontmatter description to foreground the full archive-plus-bookkeeping workflow.
- Added trigger wording that mirrors the eval set more closely: single-change archive, bulk archive, cross-linking touched specs, specs index updates, and archive index maintenance.
- Tightened boundaries by explicitly excluding propose, apply, stale-related pruning, status rewrites, and broader synthesis cleanup.

## Rationale
- Improves trigger precision for archive requests that also mention post-archive linking or index work.
- Preserves intended behavior by keeping native archive execution, additive related updates, specs index patching, and archive index appends in scope.
- Reduces false positives against nearby QRSPI skills by naming the out-of-scope workflows directly.
