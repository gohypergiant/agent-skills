#!/usr/bin/env python3
"""Scaffold an eval harness into a target skill from a framework template.

Mechanical only: copies the chosen template into <target>/evals/, strips the
`.template` suffix from code files, substitutes `__PLACEHOLDER__` tokens, and
runs the don't-lose-it git check. The JUDGMENT parts — choosing the framework,
deriving fixtures, writing real metrics — are the agent's job per SKILL.md.

Usage:
  scaffold_eval.py --framework deepeval --target skills/accelint-foo \\
      --set SKILL_NAME=accelint-foo --set MODE=conversion

Frameworks: deepeval | deterministic-vitest | deterministic-pytest | human-review | rag

`rag` scaffolds into a tool repo (a RAG pipeline), not a skill — use
`--set TARGET_NAME=<tool>` and point `--target` at the tool repo.

Substitution:
  --set KEY=VALUE   replaces every __KEY__ token. Unset tokens are LEFT INTACT
                    (so the agent sees what still needs filling) and reported.
"""

from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

FRAMEWORKS = {"deepeval", "deterministic-vitest", "deterministic-pytest", "human-review", "rag"}
# Placeholder must start with a letter so literal fill-in blanks (e.g. a row of
# underscores in a review checklist) are NOT mistaken for substitution tokens.
_TOKEN = re.compile(r"__([A-Z][A-Z0-9_]*)__")


def _templates_root() -> Path:
    return Path(__file__).resolve().parent.parent / "assets" / "templates"


def _substitute(text: str, mapping: dict[str, str]) -> tuple[str, set[str]]:
    """Replace __KEY__ with mapping[KEY]; return (new_text, unresolved_tokens)."""
    unresolved: set[str] = set()

    def repl(m: re.Match) -> str:
        key = m.group(1)
        if key in mapping:
            return mapping[key]
        unresolved.add(key)
        return m.group(0)

    return _TOKEN.sub(repl, text), unresolved


def scaffold(framework: str, target: Path, mapping: dict[str, str]) -> int:
    src = _templates_root() / framework
    if not src.is_dir():
        sys.exit(f"Unknown framework template: {framework}")

    dest = target / "evals"
    if dest.exists() and any(dest.iterdir()):
        sys.exit(f"Refusing to overwrite non-empty {dest} — remove it or scaffold elsewhere.")

    unresolved: set[str] = set()
    copied: list[Path] = []
    for path in sorted(src.rglob("*")):
        if path.is_dir():
            continue
        rel = path.relative_to(src)
        out_rel = Path(str(rel)[:-len(".template")]) if rel.suffix == ".template" else rel
        out_path = dest / out_rel
        out_path.parent.mkdir(parents=True, exist_ok=True)
        if rel.name == ".gitkeep":
            shutil.copy2(path, out_path)
            copied.append(out_path)
            continue
        text = path.read_text(encoding="utf-8")
        new_text, missing = _substitute(text, mapping)
        unresolved |= missing
        out_path.write_text(new_text, encoding="utf-8")
        copied.append(out_path)

    print(f"Scaffolded {framework} into {dest}  ({len(copied)} files)")
    for p in copied:
        print(f"  + {p.relative_to(target)}")

    if unresolved:
        print("\nUNRESOLVED PLACEHOLDERS (fill these before running):")
        for tok in sorted(unresolved):
            print(f"  __{tok}__")

    _git_check(target, dest)
    return 0


def _git_check(target: Path, dest: Path) -> None:
    """The don't-lose-it check: warn if eval source is untracked."""
    try:
        out = subprocess.run(
            ["git", "status", "--porcelain", str(dest)],
            cwd=target, capture_output=True, text=True, timeout=10,
        )
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print("\n[!] Could not run git status — confirm eval source is tracked manually.")
        return
    untracked = [ln[3:] for ln in out.stdout.splitlines() if ln.startswith("??")]
    src_untracked = [f for f in untracked if not any(
        seg in f for seg in ("results/", ".venv/", "__pycache__/", ".pytest_cache/", ".env"))]
    print("\nDON'T-LOSE-IT CHECK")
    if src_untracked:
        print("  Untracked eval SOURCE — commit before the first run:")
        for f in src_untracked:
            print(f"    {f}")
        print(f"  Suggested:  git add {dest} && git commit -m 'scaffold eval'")
    else:
        print("  OK — no untracked source detected.")


def main() -> int:
    ap = argparse.ArgumentParser(description="Scaffold an eval harness from a template.")
    ap.add_argument("--framework", required=True, choices=sorted(FRAMEWORKS))
    ap.add_argument("--target", required=True, type=Path, help="path to the target skill dir")
    ap.add_argument("--set", action="append", default=[], metavar="KEY=VALUE",
                    help="placeholder substitution; repeatable")
    args = ap.parse_args()

    mapping: dict[str, str] = {}
    for pair in args.set:
        if "=" not in pair:
            sys.exit(f"--set expects KEY=VALUE, got: {pair}")
        k, v = pair.split("=", 1)
        mapping[k.strip()] = v
    if not args.target.is_dir():
        sys.exit(f"Target skill dir not found: {args.target}")
    return scaffold(args.framework, args.target, mapping)


if __name__ == "__main__":
    raise SystemExit(main())
