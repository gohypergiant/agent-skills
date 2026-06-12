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
  --set KEY=VALUE   replaces every __KEY__ token. Required keys per framework
                    (see REQUIRED_KEYS) are checked BEFORE any file is written;
                    optional unset tokens are LEFT INTACT (so the agent sees
                    what still needs filling) and reported.

Layering (EXTEND mode):
  --layer           allow a non-empty destination; copy ONLY files that do not
                    already exist (never overwrite) and report collisions to
                    merge manually. This is how a judge layer is added to an
                    existing deterministic harness.
  --dest NAME       destination dirname inside the target (default: evals),
                    e.g. --dest evals-judge for a fully separated judge layer.
"""

from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

FRAMEWORKS = {"deepeval", "deterministic-vitest", "deterministic-pytest", "human-review", "rag"}

# Placeholders that MUST be provided via --set, per framework. Checked before
# any file is written so a forgotten key fails fast instead of producing a
# half-filled scaffold.
REQUIRED_KEYS: dict[str, list[str]] = {
    "deepeval": ["SKILL_NAME"],
    "deterministic-pytest": ["SKILL_NAME"],
    "deterministic-vitest": ["SKILL_NAME"],
    "human-review": ["SKILL_NAME"],
    "rag": ["TARGET_NAME"],
}

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


def scaffold(
    framework: str,
    target: Path,
    mapping: dict[str, str],
    layer: bool = False,
    dest_name: str = "evals",
) -> int:
    src = _templates_root() / framework
    if not src.is_dir():
        sys.exit(f"Unknown framework template: {framework}")

    missing_required = [k for k in REQUIRED_KEYS.get(framework, []) if k not in mapping]
    if missing_required:
        keys = ", ".join(missing_required)
        example = missing_required[0]
        sys.exit(
            f"Missing required placeholder(s) for {framework}: {keys}\n"
            f"Pass them via --set, e.g.  --set {example}=my-value"
        )

    dest = target / dest_name
    if dest.exists() and any(dest.iterdir()) and not layer:
        sys.exit(
            f"Refusing to overwrite non-empty {dest} — remove it, scaffold "
            f"elsewhere (--dest), or use --layer to add only missing files."
        )

    unresolved: set[str] = set()
    copied: list[Path] = []
    conflicts: list[Path] = []
    for path in sorted(src.rglob("*")):
        if path.is_dir():
            continue
        rel = path.relative_to(src)
        out_rel = Path(str(rel)[:-len(".template")]) if rel.suffix == ".template" else rel
        out_path = dest / out_rel
        if layer and out_path.exists():
            conflicts.append(out_rel)
            continue
        out_path.parent.mkdir(parents=True, exist_ok=True)
        if rel.name == ".gitkeep":
            shutil.copy2(path, out_path)
            copied.append(out_path)
            continue
        # Normalize CRLF -> LF: templates checked out on Windows mounts can
        # materialize CRLF, and scaffolds would otherwise commit CRLF into
        # target repos.
        text = path.read_text(encoding="utf-8").replace("\r\n", "\n")
        new_text, missing = _substitute(text, mapping)
        unresolved |= missing
        out_path.write_text(new_text, encoding="utf-8", newline="\n")
        copied.append(out_path)

    print(f"Scaffolded {framework} into {dest}  ({len(copied)} files)")
    for p in copied:
        print(f"  + {p.relative_to(target)}")

    if layer:
        if conflicts:
            print("\nLAYER CONFLICTS (left untouched — merge manually):")
            for rel in conflicts:
                print(f"  = {dest_name}/{rel}")
            print(
                "  These files already exist; integrate the template's version "
                "by hand (e.g. merge judge fixtures into your conftest)."
            )
        else:
            print("\nLAYER: no conflicts")

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
    if out.returncode != 0:
        # e.g. target is not a git repo — a silent "OK" here would be a lie.
        print(
            "\n[!] git status failed (target not a git repo?) — eval source is "
            "NOT protected. Initialize a repo / confirm tracking manually:\n"
            f"    {out.stderr.strip()[:200]}"
        )
        return
    untracked = [ln[3:] for ln in out.stdout.splitlines() if ln.startswith("??")]
    # Exact-name match for .env: a substring test would also skip .env.example,
    # which IS source and must be committed.
    src_untracked = [f for f in untracked if not (
        Path(f).name == ".env"
        or any(seg in f for seg in ("results/", ".venv/", "__pycache__/", ".pytest_cache/"))
    )]
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
    ap.add_argument("--layer", action="store_true",
                    help="add only missing files into an existing eval dir (never overwrite)")
    ap.add_argument("--dest", default="evals", metavar="NAME",
                    help="destination dirname inside the target (default: evals)")
    args = ap.parse_args()

    mapping: dict[str, str] = {}
    for pair in args.set:
        if "=" not in pair:
            sys.exit(f"--set expects KEY=VALUE, got: {pair}")
        k, v = pair.split("=", 1)
        mapping[k.strip()] = v
    if not args.target.is_dir():
        sys.exit(f"Target skill dir not found: {args.target}")
    return scaffold(args.framework, args.target, mapping, layer=args.layer, dest_name=args.dest)


if __name__ == "__main__":
    raise SystemExit(main())
