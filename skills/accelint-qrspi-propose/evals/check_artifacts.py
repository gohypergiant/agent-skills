#!/usr/bin/env python3
"""Programmatic checks for an accelint-qrspi-propose run.

Usage: check_artifacts.py <repo-root> <change-name> --canary <TOKEN> [--stage questions|research|design|tasks]

Checks only what can be decided without judgment. Prints one line per check
(PASS/FAIL) and exits 1 if any check fails. Stdlib only.
"""
import argparse
import re
import sys
from pathlib import Path

SNAPSHOT = re.compile(r"^Snapshot: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z @ \S+$")
MARKER = "<!-- qrspi:complete -->"
SOLUTION_WORDS = re.compile(r"\b(we should|i recommend|recommend(ed|ation)?|should be changed|propose[sd]?|the solution is|best approach|implement (it|this) (by|with))\b", re.I)
NAME_OK = re.compile(r"^[a-z0-9]+(-[a-z0-9]+){1,5}(-\d+)?$")
DATE_PREFIX = re.compile(r"^(\d{4}-\d{2}-\d{2}|qrspi-\d{8})")

results = []


def check(name, ok, detail=""):
    results.append(ok)
    print(("PASS " if ok else "FAIL ") + name + (f" - {detail}" if detail and not ok else ""))


def header_marker(path):
    if not path.exists():
        check(f"{path.name} exists", False, str(path))
        return None
    text = path.read_text()
    lines = text.rstrip("\n").split("\n")
    check(f"{path.name} line 1 is Snapshot header", bool(SNAPSHOT.match(lines[0])), lines[0])
    check(f"{path.name} last line is completion marker", lines[-1] == MARKER, lines[-1])
    return text


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("repo")
    ap.add_argument("change")
    ap.add_argument("--canary", required=True)
    ap.add_argument("--stage", choices=["questions", "research", "design", "tasks"], default="tasks")
    a = ap.parse_args()
    repo = Path(a.repo)
    root = repo / "openspec" / "changes" / a.change
    order = ["questions", "research", "design", "tasks"]
    upto = order.index(a.stage)

    check("change folder exists", root.is_dir(), str(root))
    check("change name is 2-6 kebab words, no date prefix", bool(NAME_OK.match(a.change)) and not DATE_PREFIX.match(a.change), a.change)
    check("no trace.md", not (root / "trace.md").exists())

    q = header_marker(root / "questions.md")
    if q is not None:
        body = q
        check("questions.md has no solution language", not SOLUTION_WORDS.search(body), (SOLUTION_WORDS.search(body) or [""])[0] if SOLUTION_WORDS.search(body) else "")
    if upto >= 1:
        r = header_marker(root / "research.md")
        if r is not None:
            check("research.md has no solution language", not SOLUTION_WORDS.search(r))
            check("research.md does not contain the ticket canary", a.canary not in r)
    if upto >= 2:
        for f in ("proposal.md", "design.md"):
            p = root / f
            check(f"{f} exists", p.exists())
            if p.exists():
                check(f"{f} does not contain the ticket canary", a.canary not in p.read_text())
    if upto >= 3:
        p = root / "tasks.md"
        check("tasks.md exists", p.exists())
        if p.exists():
            t = p.read_text()
            check("tasks.md does not contain the ticket canary", a.canary not in t)
            check("tasks.md subtasks use '- [ ]' checklist format", bool(re.search(r"^- \[[ x]\] ", t, re.M)))
            check("tasks.md has Parallelization Strategy section", "## Parallelization Strategy" in t)

    hits = [str(p.relative_to(repo)) for p in repo.rglob("*")
            if p.is_file() and ".git" not in p.parts and p.suffix in {".md", ".json", ".yaml", ".yml", ".txt"}
            and a.canary in p.read_text(errors="ignore")]
    check("ticket canary appears in no file on disk", not hits, ", ".join(hits))
    sys.exit(0 if all(results) else 1)


if __name__ == "__main__":
    main()
