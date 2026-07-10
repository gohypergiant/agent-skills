"""Tests for scaffold_eval.py — the skill's own automation gets the same
regression discipline it demands of every metric."""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

import scaffold_eval  # noqa: E402


def _scaffold_rag(tmp_path: Path, **kwargs) -> Path:
    target = tmp_path / "target"
    target.mkdir(exist_ok=True)
    scaffold_eval.scaffold("rag", target, {"TARGET_NAME": "demo"}, **kwargs)
    return target / kwargs.get("dest_name", "evals")


def test_copies_strips_template_suffix_and_substitutes(tmp_path):
    dest = _scaffold_rag(tmp_path)
    runner = dest / "runner.py"
    assert runner.exists(), ".template suffix not stripped"
    assert not (dest / "runner.py.template").exists()
    text = (dest / "pyproject.toml").read_text(encoding="utf-8")
    assert "demo-evals" in text
    assert "__TARGET_NAME__" not in text


def test_optional_tokens_left_intact(tmp_path):
    dest = _scaffold_rag(tmp_path)
    # The rag template has no optional tokens left after TARGET_NAME, so prove
    # the mechanism with the deepeval template instead (it has many optional ones).
    target2 = tmp_path / "target2"
    target2.mkdir()
    scaffold_eval.scaffold("deepeval", target2, {"SKILL_NAME": "demo"})
    runner = (target2 / "evals" / "runner.py").read_text(encoding="utf-8")
    assert "__USER_MESSAGE_TEMPLATE__" in runner  # optional token preserved for the agent


def test_refuses_non_empty_dest_without_layer(tmp_path):
    target = tmp_path / "target"
    (target / "evals").mkdir(parents=True)
    (target / "evals" / "existing.py").write_text("x", encoding="utf-8")
    with pytest.raises(SystemExit):
        scaffold_eval.scaffold("rag", target, {"TARGET_NAME": "demo"})


def test_layer_skips_existing_and_reports_conflicts(tmp_path, capsys):
    target = tmp_path / "target"
    (target / "evals").mkdir(parents=True)
    sentinel = "DO NOT OVERWRITE"
    (target / "evals" / "README.md").write_text(sentinel, encoding="utf-8")

    scaffold_eval.scaffold("rag", target, {"TARGET_NAME": "demo"}, layer=True)

    # Colliding file untouched and reported; non-colliding file copied.
    assert (target / "evals" / "README.md").read_text(encoding="utf-8") == sentinel
    assert (target / "evals" / "runner.py").exists()
    out = capsys.readouterr().out
    assert "LAYER CONFLICTS" in out
    assert "README.md" in out


def test_required_key_fail_fast_writes_nothing(tmp_path):
    target = tmp_path / "target"
    target.mkdir()
    with pytest.raises(SystemExit) as exc:
        scaffold_eval.scaffold("rag", target, {})  # TARGET_NAME missing
    assert "TARGET_NAME" in str(exc.value)
    assert not (target / "evals").exists(), "fail-fast must run before any copy"


def test_dest_flag_changes_dirname(tmp_path):
    dest = _scaffold_rag(tmp_path, dest_name="evals-judge")
    assert dest.name == "evals-judge"
    assert (dest / "runner.py").exists()


def test_crlf_normalized_to_lf(tmp_path, monkeypatch):
    # Fake templates root containing a CRLF template with a required-free framework.
    troot = tmp_path / "templates"
    fake = troot / "rag"  # reuse a known framework name so REQUIRED_KEYS applies
    fake.mkdir(parents=True)
    (fake / "file.py.template").write_bytes(b"name = '__TARGET_NAME__'\r\nline2\r\n")
    monkeypatch.setattr(scaffold_eval, "_templates_root", lambda: troot)

    target = tmp_path / "target"
    target.mkdir()
    scaffold_eval.scaffold("rag", target, {"TARGET_NAME": "demo"})

    out_bytes = (target / "evals" / "file.py").read_bytes()
    assert b"\r" not in out_bytes, "CRLF must not leak into scaffolded files"
    assert b"name = 'demo'" in out_bytes

def test_git_check_outside_repo_warns_not_ok(tmp_path, capsys):
    # tmp_path is not a git repo: a false "OK" here once masked unprotected source.
    _scaffold_rag(tmp_path)
    out = capsys.readouterr().out
    assert "OK — no untracked source" not in out
    assert "NOT protected" in out


def test_git_check_flags_env_example_but_not_env(tmp_path, capsys):
    import shutil
    import subprocess
    if shutil.which("git") is None:
        pytest.skip("git unavailable")
    subprocess.run(["git", "init", "-q", str(tmp_path)], check=True)
    target = tmp_path
    dest = target / "evals"
    dest.mkdir()
    # Track one file so git reports per-file untracked paths instead of
    # collapsing the whole directory to "evals/".
    (dest / "README.md").write_text("tracked\n", encoding="utf-8")
    subprocess.run(["git", "-C", str(target), "add", "evals/README.md"], check=True)
    subprocess.run(
        ["git", "-C", str(target), "-c", "user.name=t", "-c", "user.email=t@t",
         "commit", "-qm", "x"],
        check=True,
    )
    (dest / ".env.example").write_text("KEY=\n", encoding="utf-8")
    (dest / ".env").write_text("KEY=secret\n", encoding="utf-8")
    scaffold_eval._git_check(target, dest)
    out = capsys.readouterr().out
    assert ".env.example" in out, ".env.example is source — it must be flagged untracked"
    lines_flagging_env = [
        ln for ln in out.splitlines() if ln.strip().endswith("/.env") or ln.strip() == ".env"
    ]
    assert not lines_flagging_env, "a real .env (secrets) must stay excluded"

def test_git_check_works_with_relative_target(tmp_path, monkeypatch, capsys):
    # A relative --target once made git resolve the pathspec to
    # <target>/<target>/evals → empty output → false "OK".
    import shutil
    import subprocess
    if shutil.which("git") is None:
        pytest.skip("git unavailable")
    subprocess.run(["git", "init", "-q", str(tmp_path)], check=True)
    (tmp_path / "target").mkdir()
    monkeypatch.chdir(tmp_path)
    scaffold_eval.scaffold("rag", Path("target"), {"TARGET_NAME": "demo"})
    out = capsys.readouterr().out
    assert "OK — no untracked source" not in out
    assert "Untracked eval SOURCE" in out


def test_dest_escaping_target_is_rejected(tmp_path):
    target = tmp_path / "target"
    target.mkdir()
    with pytest.raises(SystemExit) as exc:
        scaffold_eval.scaffold("rag", target, {"TARGET_NAME": "demo"},
                               dest_name="../escaped")
    assert "inside the target" in str(exc.value)
    assert not (tmp_path / "escaped").exists()
