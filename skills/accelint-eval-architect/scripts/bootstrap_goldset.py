#!/usr/bin/env python3
"""Bootstrap a DRAFT RAG gold set from a corpus — then REQUIRE human curation.

Stratified-samples a corpus directory, LLM-drafts candidate Q/A/passage triples
plus adversarial unanswerable questions, and writes them with `verified: false`
and a mandatory-curation banner. The eval harness refuses to run on unverified
entries (see references/gold-set.md).

CRITICAL: drafts are a starting point, never trusted output. An un-curated gold
set graded by an auto-generated judge is circular and meaningless — a human must
verify each answer and its supporting passage before it counts.

Usage:
  bootstrap_goldset.py --corpus ./docs --out goldset.draft.yaml \\
      --n 12 --adversarial 3 [--no-llm]

  --no-llm   skip LLM drafting; emit blank, human-fillable entry stubs.
  Without --no-llm, requires litellm + LITELLM_BASE_URL / LITELLM_API_KEY /
  JUDGE_MODEL_ALIAS in the environment.
"""

from __future__ import annotations

import argparse
import hashlib
import os
import sys
from pathlib import Path

import yaml

_TEXT_EXT = {".txt", ".md", ".rst", ".html", ".json", ".csv"}
_BANNER = (
    "# ⚠️  DRAFT GOLD SET — REQUIRES HUMAN CURATION ⚠️\n"
    "# Every entry below is an LLM/stub DRAFT with verified: false.\n"
    "# A human must confirm each answer AND its supporting_passages against the\n"
    "# real corpus, then set verified: true. The harness refuses unverified entries.\n"
    "# Never trust a gold set graded by the same model family that generated it.\n"
)


def corpus_hash(files: list[Path]) -> str:
    h = hashlib.sha256()
    for f in sorted(files):
        h.update(f.name.encode())
        h.update(str(f.stat().st_size).encode())
    return h.hexdigest()[:16]


def collect_files(corpus: Path) -> list[Path]:
    return [p for p in corpus.rglob("*") if p.is_file() and p.suffix.lower() in _TEXT_EXT]


def stratified_sample(files: list[Path], n: int) -> list[Path]:
    """Spread the sample ACROSS the corpus, not just the first files."""
    if not files or n <= 0:
        return []
    if len(files) <= n:
        return files
    step = len(files) / n
    return [files[int(i * step)] for i in range(n)]


def _draft_with_llm(snippet: str, source: str) -> dict | None:
    try:
        from litellm import completion
    except ImportError:
        return None
    base = os.getenv("LITELLM_BASE_URL")
    key = os.getenv("LITELLM_API_KEY")
    alias = os.getenv("JUDGE_MODEL_ALIAS")
    if not (base and key and alias):
        return None
    prompt = (
        "From the passage below, write ONE factual question a user might ask, the "
        "exact answer, and quote the sentence that supports it. Return YAML with "
        "keys question, answer, supporting_quote. Passage:\n\n" + snippet[:2000]
    )
    try:
        resp = completion(
            model=f"openai/{alias}", api_base=base, api_key=key,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0, max_tokens=400,
        )
        data = yaml.safe_load(resp.choices[0].message.content)
        if isinstance(data, dict) and "question" in data:
            return data
    except Exception as e:  # noqa: BLE001 - drafting is best-effort
        print(f"  [warn] LLM draft failed for {source}: {e}", file=sys.stderr)
    return None


def build_entries(sample: list[Path], use_llm: bool) -> list[dict]:
    entries: list[dict] = []
    for i, f in enumerate(sample, 1):
        snippet = f.read_text(encoding="utf-8", errors="replace")[:4000]
        draft = _draft_with_llm(snippet, f.name) if use_llm else None
        entries.append({
            "id": f"q{i}",
            "question": (draft or {}).get("question", "DRAFT: write a question answerable from this source"),
            "answer": (draft or {}).get("answer", "DRAFT: the exact answer"),
            "supporting_passages": [{"doc": f.name, "page": None, "chunk_id": "DRAFT: fill chunk id",
                                     "quote": (draft or {}).get("supporting_quote", "")}],
            "answerable": True,
            "verified": False,
            "_source_file": f.name,
        })
    return entries


def build_adversarial(n: int) -> list[dict]:
    return [{
        "id": f"q_adv{i}",
        "question": "DRAFT: a plausible question whose answer is NOT in the corpus",
        "answer": None,
        "supporting_passages": [],
        "answerable": False,
        "verified": False,
    } for i in range(1, n + 1)]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--corpus", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--n", type=int, default=12, help="answerable draft questions")
    ap.add_argument("--adversarial", type=int, default=3, help="unanswerable draft questions")
    ap.add_argument("--no-llm", action="store_true", help="emit blank stubs instead of LLM drafts")
    args = ap.parse_args()

    if not args.corpus.is_dir():
        sys.exit(f"Corpus dir not found: {args.corpus}")
    files = collect_files(args.corpus)
    if not files:
        sys.exit(f"No text files ({', '.join(sorted(_TEXT_EXT))}) under {args.corpus}")

    sample = stratified_sample(files, args.n)
    entries = build_entries(sample, use_llm=not args.no_llm)
    entries += build_adversarial(args.adversarial)

    doc = {"corpus_hash": corpus_hash(files), "entries": entries}
    args.out.write_text(_BANNER + yaml.safe_dump(doc, sort_keys=False), encoding="utf-8")

    verified = sum(1 for e in entries if e["verified"])
    print(f"Wrote {args.out} — {len(entries)} DRAFT entries ({verified} verified).")
    print("NEXT: curate every entry (confirm answer + supporting passage), set verified: true.")
    print("The harness will refuse to run until entries are verified.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
