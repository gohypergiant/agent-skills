# Gold set — the prerequisite for RAG eval

Retrieval and answer-correctness cannot be scored without a gold set: questions,
their correct answers, and the **source passages** that support them. Building it
is the real cost of a RAG eval — be honest about that, and help bootstrap it
without faking it.

## Shape
```yaml
# goldset.yaml — each entry is a question with its supporting evidence.
corpus_hash: "<sha256 of the corpus at curation time>"   # detects drift
entries:
  - id: q1
    question: "What is the maximum payload mass for the X-9 platform?"
    answer: "1,200 kg."
    supporting_passages:               # chunk IDs or (doc, page) the answer comes from
      - {doc: "x9-spec.pdf", page: 42, chunk_id: "x9-spec#c318"}
    answerable: true
  - id: q_adv1
    question: "What is the warranty period for the X-9 platform?"
    answer: null
    supporting_passages: []
    answerable: false                  # adversarial: NOT in the corpus → bot must refuse
```

## Bootstrap, then curate (the hard rule)
`scripts/bootstrap_goldset.py` stratified-samples the corpus and LLM-drafts
candidate triples + adversarial unanswerable questions. **Drafts are a starting
point, never trusted output.**

- **Circularity is the trap:** if the gold set and the judge come from the same
  unreviewed LLM pass, you are grading the model against itself — the scores are
  meaningless. A human must verify each triple's answer and supporting passage
  before it counts.
- The bootstrap output ships with a mandatory curation banner and an
  `verified: false` flag per entry; the harness should refuse (or loudly warn)
  on unverified entries.

## Sampling matters
Sample **across** the corpus, not the first N pages — spec docs bury critical
facts deep. Stratify by section/document so retrieval is tested against the whole
index, not just the front matter. Include questions whose answers span multiple
passages (tests context_recall), and adversarial unanswerable questions (tests
refusal_on_unknown).

## Corpus drift
Store `corpus_hash` in the gold set. When the 20k docs change, the hash mismatches
and the eval flags that the gold set may be stale — a renamed section or removed
page can silently invalidate a supporting-passage reference. AUDIT mode checks
this (the RAG analogue of the stale-golden check).

## Size tiers
- **smoke** (~10 Q): every run, cheap, catches gross regressions.
- **full** (as large as curation allows): on demand / nightly, the real signal.
Gate the judge-scored metrics behind opt-in so smoke runs stay cheap.

## What NOT to do
- Do not auto-trust bootstrap drafts.
- Do not sample only the easy/front pages.
- Do not omit adversarial unanswerable questions — a docs bot's worst failure is
  confidently answering what isn't in the docs.
- Do not let the gold set rot silently — the corpus hash is the tripwire.
