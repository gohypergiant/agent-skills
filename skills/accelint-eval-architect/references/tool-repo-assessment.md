# Assessment — reading and classifying a tool repo

For `target_type = tool-repo`: a standalone tool in its own repo, not a skill in
this one. v1 targets **RAG / retrieval pipelines** (e.g. a parser that turns
documents into a queryable index a chatbot answers from). The goal is the same as
for skills — produce an eval profile that drives the recommendation — but you
cannot read a `SKILL.md`; you read code and **interview the developer**.

## The hard truth: comprehension is interactive
You cannot reliably reverse-engineer an arbitrary pipeline from files. Read what
files reveal, then ask the developer for the rest. **Refuse to recommend until
stages + invocation are confirmed.** Inventing pipeline facts produces an eval
that measures the wrong thing.

## What to read (files)
| Read | Extract |
|---|---|
| `README` / `docs/` | what the tool does; how it's run; any stated eval/benchmark |
| package manifest (`pyproject.toml` / `package.json` / `Cargo.toml` / `go.mod`) | toolchain, entry points, existing test runner |
| `bin/` / `src/` entry points, CLI definitions, route handlers | how stages are invoked |
| `tests/` / `eval/` / `benchmark/` | existing coverage; AUDIT trigger if an eval dir exists |
| config (chunking, embedding model, index, top-k) | retrieval parameters that affect metrics |

## What to interview the developer for (files won't tell you)
1. **Stages** — what are the pipeline steps? (typical RAG: ingest → index → retrieve → generate)
2. **Invocation per stage** — CLI command? importable function? HTTP endpoint? query API? (drives the SUT-invocation adapter)
3. **Eval boundary** — per-stage, end-to-end (question → answer), or both?
4. **Gold set** — is there a set of questions + correct answers + supporting source passages? If not, that's the first scaffold task ([gold-set.md](gold-set.md)).
5. **Definition of correct** — exact retrieval? grounded answer? citation accuracy? **refusal when the answer isn't in the corpus?** (the last is a headline metric for a docs bot).
6. **Corpus** — where is it, how big, how often does it change? (store a corpus hash to detect drift under the gold set).

## Tool-repo eval profile
```jsonc
{
  "target_type": "tool-repo",
  "repo_path": "/abs/path/to/parser-repo",
  "one_liner": "Parses ~20k pages of spec docs into a queryable index a chatbot answers from.",
  "toolchain": "python",
  "pipeline_kind": "rag",                 // rag | transform | api | other  (v1 implements rag)
  "stages": [
    {"name":"ingest",   "invoke":"cli: parse-docs <dir>",  "determinism":"fully_verifiable"},
    {"name":"retrieve", "invoke":"fn: retrieve(query,k)",  "determinism":"fully_verifiable_with_goldset"},
    {"name":"generate", "invoke":"http: POST /chat",       "determinism":"partially_verifiable"}
  ],
  "gold_set": {"present": false, "kind":"qa_passage_triples", "size": null},
  "corpus":   {"path":"./docs", "hash": null, "size":"~20k pages"},
  "eval_boundary": ["retrieve","generate","end_to_end"],
  "sut_invocation": {"ingest":"cli","retrieve":"function","generate":"http"},
  "eval_recommendation": "hybrid: deterministic retrieval + ragas|deepeval answer layer (gated)",
  "confidence": "high",
  "unread_or_uncertain": []
}
```

## Then continue
Hand the stages to [pipeline-decomposition.md](pipeline-decomposition.md) for the
per-stage metric matrix and the per-stage verifiability gate, and to
[framework-matrix.md](framework-matrix.md) for the recommendation. For RAG, the
gold set is the prerequisite — see [gold-set.md](gold-set.md).

## Scaffolding into an external repo
The eval is scaffolded into the **target repo**, using **its** toolchain
(`pyproject` for Python, `package.json` script for Node). Run the don't-lose-it
git check in that repo, and tell the developer to commit there before the first run.
