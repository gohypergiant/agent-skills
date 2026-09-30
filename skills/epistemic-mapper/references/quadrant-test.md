# The Quadrant Test, in Detail

Read this before running the extraction wave. SKILL.md's flowchart has the
Q1/Q2/Q3 triage test itself — this file has the worked example per
quadrant, a redirect table for near-misses, and notes specific to the Risk
quadrant.

## Table of Contents

1. Worked example per quadrant
2. Redirect table
3. Notes on the Risk quadrant specifically

---

## 1. Worked example per quadrant

**Known Known (Fact).** The prototype's `payments/stripe-client.ts` has a
hardcoded `currency: 'usd'` and a passing integration test that charges a
test card in USD. That the prototype currently only processes USD is a
Fact — it's directly observable and evidenced by both the code and a
passing test. *Evidence: `payments/stripe-client.ts:14`, `payments.test.ts`
(passing).*

**Known Unknown (Question).** A comment in the same file reads
`// TODO: confirm Stripe supports EUR payouts for our entity type`. Someone
already knows this is unresolved and said so. That's a Question, not a
Risk — the gap is already visible to anyone reading the file.
*Evidence: `payments/stripe-client.ts:22`.*

**Unknown Known (Assumption).** Nowhere does any doc or comment say "we
assume all customers are billed monthly," but the billing scheduler has no
branch for any other cadence, and the pricing page in `docs/pricing.md`
only shows monthly plans. Nobody stated the assumption, but the whole
system is built on it. *Evidence: `billing/scheduler.ts` (no annual-cadence
branch), `docs/pricing.md` (monthly plans only).*

**Unknown Unknown (Risk).** No single file states this, but across three
modules — `payments/stripe-client.ts`, `billing/scheduler.ts`, and
`docs/pricing.md` — the entire revenue path assumes Stripe, USD, and
monthly billing, with zero fallback or error-handling for a failed charge
anywhere in the payment flow. Any one of those assumptions failing (a
declined card, a Stripe outage, an international customer) has no handling
path. *Reasoning: single-vendor, single-currency, single-cadence coupling
with no observed failure handling across the entire revenue-critical path —
this is the kind of blind spot that surfaces in week one of a production
incident, not in a code review.*

## 2. Redirect table

| Looks like | Actually is | Where it belongs |
|---|---|---|
| "We should use `pnpm`, not `npm`" | A team preference, no external enforcer | `config.yaml` / `AGENTS.md`, not here |
| "SOC 2 requires audit logging on all writes" | A hard compliance constraint, already covered by the forcing-function test | `CONSTRAINTS.md` — cross-reference, don't duplicate |
| "MRR stands for Monthly Recurring Revenue" | A term definition | `JARGON.md` — cross-reference, don't duplicate |
| "We chose Postgres over Mongo for relational integrity" | A recorded architectural decision with a stated rationale | `ARCHITECTURE.md` — this is a Fact only if the map needs to reference *why* the decision constrains future work, otherwise leave it to `ARCHITECTURE.md` |
| "The onboarding flow probably has edge cases we haven't found" | Too vague to act on — not a specific observation | Not an entry. Push back for something concrete, or leave for the Risk synthesis pass if a specific pattern is found |

## 3. Notes on the Risk quadrant specifically

Because Risks come from synthesis rather than a single source, they need a
higher bar for inclusion than "this could theoretically go wrong somewhere."
A good Risk entry names the specific modules or docs whose combination
creates the exposure, and explains why the combination matters more than any
one piece alone. A Risk entry that reduces to "the code could have bugs" is
too generic to act on — redirect it back through the test, or drop it.
