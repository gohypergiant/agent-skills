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
      --n 12 --adversarial 3 [--no-llm] [--force]

  --no-llm   skip LLM drafting; emit blank, human-fillable entry stubs.
  --force    overwrite an existing --out file (refused by default — the draft
             may already hold human curation).
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
    "# corpus_path may be edited to a path relative to the eval dir.\n"
)


def corpus_hash(corpus_dir: Path) -> str:
    """Content-based corpus hash — the drift tripwire.

    Algorithm (mirrored EXACTLY by the rag template's ``corpus_hash.py``; the
    two must stay in lockstep): sha256, updated per file in order sorted by
    POSIX relative path from the corpus root, with
    ``relpath.encode() + b"\\0" + file_bytes``, final ``hexdigest()[:16]``.

    Hashing raw content (not name+size) means a same-size content edit still
    changes the hash. PDFs are hashed by raw bytes like every other file.
    """
    h = hashlib.sha256()
    files = sorted(
        (p for p in corpus_dir.rglob("*") if p.is_file()),
        key=lambda p: p.relative_to(corpus_dir).as_posix(),
    )
    for f in files:
        rel = f.relative_to(corpus_dir).as_posix()
        h.update(rel.encode())
        h.update(b"\0")
        h.update(f.read_bytes())
    return h.hexdigest()[:16]


def _read_pdf_text(path: Path) -> str:
    """Extract text from a PDF via pypdf, tolerating per-page failures."""
    from pypdf import PdfReader  # lazy: optional dependency

    parts: list[str] = []
    for page in PdfReader(str(path)).pages:
        try:
            parts.append(page.extract_text() or "")
        except Exception:  # noqa: BLE001 - skip unreadable pages, keep going
            continue
    return "\n".join(parts)


def collect_files(corpus: Path) -> list[Path]:
    """Return readable corpus files: text formats always; PDFs when pypdf is available.

    PDFs are the realistic spec-doc corpus. If PDFs are present but pypdf is
    not installed: warn-and-skip when text files exist alongside them; hard-exit
    with install/pre-extract guidance when PDFs are all there is.
    """
    # Sorted everywhere: rglob order is filesystem-dependent, and an unsorted
    # list makes the stratified sample non-reproducible across machines.
    text_files = sorted(p for p in corpus.rglob("*") if p.is_file() and p.suffix.lower() in _TEXT_EXT)
    pdf_files = sorted(p for p in corpus.rglob("*") if p.is_file() and p.suffix.lower() == ".pdf")

    if not pdf_files:
        return text_files

    try:
        import pypdf  # noqa: F401 - availability probe only
        return sorted(text_files + pdf_files)
    except ImportError:
        if text_files:
            print(
                f"[warn] {len(pdf_files)} PDF file(s) skipped — pypdf not installed "
                f"(uv pip install pypdf to include them).",
                file=sys.stderr,
            )
            return text_files
        sys.exit(
            f"Corpus under {corpus} is PDF-only and pypdf is not installed.\n"
            f"Either install it (uv pip install pypdf) or pre-extract the PDFs "
            f"to .txt/.md and point --corpus at the extracted text."
        )


def _read_snippet(path: Path, limit: int = 4000) -> str:
    """Read the draft-source snippet for a file (text directly; PDFs via pypdf)."""
    if path.suffix.lower() == ".pdf":
        return _read_pdf_text(path)[:limit]
    return path.read_text(encoding="utf-8", errors="replace")[:limit]


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
        snippet = _read_snippet(f)
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
    ap.add_argument("--force", action="store_true", help="overwrite an existing --out file")
    args = ap.parse_args()

    if not args.corpus.is_dir():
        sys.exit(f"Corpus dir not found: {args.corpus}")
    if args.out.exists() and not args.force:
        # A draft may already contain hours of human curation — never clobber it.
        sys.exit(f"Refusing to overwrite {args.out} (it may hold curated entries) — pass --force.")
    files = collect_files(args.corpus)
    if not files:
        sys.exit(
            f"No readable files ({', '.join(sorted(_TEXT_EXT))}, .pdf with pypdf) "
            f"under {args.corpus}"
        )

    sample = stratified_sample(files, args.n)
    entries = build_entries(sample, use_llm=not args.no_llm)
    entries += build_adversarial(args.adversarial)

    doc = {
        "corpus_hash": corpus_hash(args.corpus),
        "corpus_path": str(args.corpus.resolve()),
        "entries": entries,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(_BANNER + yaml.safe_dump(doc, sort_keys=False), encoding="utf-8")

    verified = sum(1 for e in entries if e["verified"])
    print(f"Wrote {args.out} — {len(entries)} DRAFT entries ({verified} verified).")
    print("NEXT: curate every entry (confirm answer + supporting passage), set verified: true.")
    print("The harness will refuse to run until entries are verified.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
