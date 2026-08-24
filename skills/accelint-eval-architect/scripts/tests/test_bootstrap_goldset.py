"""Tests for bootstrap_goldset.py — drafts, content-hash sensitivity, sampling,
and the PDF contract."""

import sys
from pathlib import Path

import pytest
import yaml

sys.path.insert(0, str(Path(__file__).parent.parent))

import bootstrap_goldset  # noqa: E402


def _make_corpus(tmp_path: Path, n_files: int = 3) -> Path:
    corpus = tmp_path / "corpus"
    corpus.mkdir()
    for i in range(n_files):
        (corpus / f"doc{i}.md").write_text(f"Fact number {i}.\n", encoding="utf-8")
    return corpus


def _run_main(argv: list[str], monkeypatch) -> int:
    monkeypatch.setattr(sys, "argv", ["bootstrap_goldset.py", *argv])
    return bootstrap_goldset.main()


def test_no_llm_draft_shape(tmp_path, monkeypatch):
    corpus = _make_corpus(tmp_path)
    out = tmp_path / "goldset.draft.yaml"
    rc = _run_main(
        ["--corpus", str(corpus), "--out", str(out), "--n", "3", "--adversarial", "2", "--no-llm"],
        monkeypatch,
    )
    assert rc == 0
    text = out.read_text(encoding="utf-8")
    assert "REQUIRES HUMAN CURATION" in text
    data = yaml.safe_load(text)
    assert "corpus_hash" in data and "corpus_path" in data
    entries = data["entries"]
    assert len(entries) == 5
    assert all(e["verified"] is False for e in entries)
    assert sum(1 for e in entries if not e["answerable"]) == 2


def test_content_hash_changes_on_same_size_edit(tmp_path):
    corpus = _make_corpus(tmp_path, n_files=2)
    before = bootstrap_goldset.corpus_hash(corpus)
    # Same byte length, different content — the old name+size hash missed this.
    target = corpus / "doc0.md"
    original = target.read_bytes()
    edited = original.replace(b"Fact", b"Fakt")
    assert len(edited) == len(original)
    target.write_bytes(edited)
    after = bootstrap_goldset.corpus_hash(corpus)
    assert before != after


def test_hash_matches_rag_template_helper(tmp_path):
    """The bootstrap hash and the template's corpus_hash.py MUST agree."""
    helper_src = (
        Path(__file__).parent.parent.parent
        / "assets" / "templates" / "rag" / "corpus_hash.py.template"
    ).read_text(encoding="utf-8")
    namespace: dict = {}
    exec(compile(helper_src, "corpus_hash.py", "exec"), namespace)  # noqa: S102 - our own template
    corpus = _make_corpus(tmp_path)
    assert namespace["compute_corpus_hash"](corpus) == bootstrap_goldset.corpus_hash(corpus)


def test_stratified_sample_spreads(tmp_path):
    corpus = _make_corpus(tmp_path, n_files=10)
    files = bootstrap_goldset.collect_files(corpus)
    sample = bootstrap_goldset.stratified_sample(sorted(files), 3)
    assert len(sample) == 3
    names = {p.name for p in sample}
    # Must reach beyond the first 3 files in sorted order.
    assert names != {"doc0.md", "doc1.md", "doc2.md"}


def test_empty_corpus_exits_nonzero(tmp_path, monkeypatch):
    corpus = tmp_path / "empty"
    corpus.mkdir()
    out = tmp_path / "x.yaml"
    with pytest.raises(SystemExit) as exc:
        _run_main(["--corpus", str(corpus), "--out", str(out), "--no-llm"], monkeypatch)
    assert exc.value.code not in (0, None)


def test_pdf_only_corpus_without_pypdf(tmp_path, monkeypatch):
    try:
        import pypdf  # noqa: F401
        pytest.skip("pypdf installed in this env — the no-pypdf path can't be exercised")
    except ImportError:
        pass
    corpus = tmp_path / "pdfs"
    corpus.mkdir()
    (corpus / "spec.pdf").write_bytes(b"%PDF-1.4 dummy")
    out = tmp_path / "x.yaml"
    with pytest.raises(SystemExit) as exc:
        _run_main(["--corpus", str(corpus), "--out", str(out), "--no-llm"], monkeypatch)
    assert "pypdf" in str(exc.value)

def test_out_refuses_overwrite_without_force(tmp_path, monkeypatch):
    corpus = _make_corpus(tmp_path)
    out = tmp_path / "goldset.draft.yaml"
    out.write_text("curated: do-not-clobber\n", encoding="utf-8")
    with pytest.raises(SystemExit) as exc:
        _run_main(["--corpus", str(corpus), "--out", str(out), "--no-llm"], monkeypatch)
    assert "--force" in str(exc.value)
    assert out.read_text(encoding="utf-8") == "curated: do-not-clobber\n"

    rc = _run_main(
        ["--corpus", str(corpus), "--out", str(out), "--no-llm", "--force"], monkeypatch
    )
    assert rc == 0
    assert "REQUIRES HUMAN CURATION" in out.read_text(encoding="utf-8")


def test_out_creates_parent_dirs(tmp_path, monkeypatch):
    corpus = _make_corpus(tmp_path)
    out = tmp_path / "nested" / "dir" / "goldset.draft.yaml"
    rc = _run_main(["--corpus", str(corpus), "--out", str(out), "--no-llm"], monkeypatch)
    assert rc == 0
    assert out.exists()


def test_collect_files_sorted(tmp_path):
    corpus = tmp_path / "corpus"
    corpus.mkdir()
    for name in ("zeta.md", "alpha.md", "mid.txt"):
        (corpus / name).write_text("x\n", encoding="utf-8")
    files = bootstrap_goldset.collect_files(corpus)
    assert files == sorted(files), "file order must be deterministic for reproducible sampling"
