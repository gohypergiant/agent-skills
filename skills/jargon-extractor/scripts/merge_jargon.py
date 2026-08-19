#!/usr/bin/env python3
"""Merge new glossary entries into a JARGON.md file.

Owns every mechanical part of maintaining the glossary: parsing the
existing file, upserting entries by term (case-insensitive), sorting
alphabetically, and writing the result back out. Semantic decisions
(what a term means, how to merge two definitions of the same term)
happen upstream, in the model; this script only trusts the entries
it is handed and never guesses at merging meanings itself.

Usage:
    python3 merge_jargon.py <path-to-JARGON.md> <path-to-entries.json>
    python3 merge_jargon.py <path-to-JARGON.md> <path-to-entries.json> --dry-run

entries.json shape:
    [{"term": "API", "definition": "..."}, ...]

Entries in entries.json are upserted into the existing glossary by
term (case-insensitive match). Terms not mentioned in entries.json are
left untouched. The file does not need to exist yet; a fresh glossary
is created with a default header.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ENTRY_PATTERN = re.compile(r"^- \*\*(.+?)\*\*: (.+)$")

DEFAULT_HEADER = (
    "# Jargon\n"
    "\n"
    "<!-- Maintained by the jargon-extractor skill. Entries are sorted\n"
    "     alphabetically, case-insensitive. Re-run the skill to add or\n"
    "     update terms; avoid hand-editing the ordering. -->\n"
    "\n"
)


def fail(message: str) -> None:
    print(f"error: {message}", file=sys.stderr)
    sys.exit(1)


def parse_existing(path: Path) -> tuple[str, dict[str, tuple[str, str]]]:
    """Return (preamble, entries) where entries maps lowercase term to
    (original-cased term, definition). Aborts rather than silently
    dropping content it cannot parse."""

    if not path.exists():
        return DEFAULT_HEADER, {}

    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    preamble_lines: list[str] = []
    entries: dict[str, tuple[str, str]] = {}
    seen_first_entry = False
    unparsed: list[tuple[int, str]] = []

    for lineno, line in enumerate(lines, start=1):
        match = ENTRY_PATTERN.match(line)
        if match:
            seen_first_entry = True
            term, definition = match.group(1), match.group(2)
            key = term.casefold()
            if key in entries:
                unparsed.append((lineno, f"duplicate term already in file: {term!r}"))
                continue
            entries[key] = (term, definition)
            continue

        if not seen_first_entry:
            preamble_lines.append(line)
            continue

        if line.strip() == "":
            continue

        unparsed.append((lineno, line))

    if unparsed:
        details = "\n".join(f"  line {n}: {content!r}" for n, content in unparsed)
        fail(
            "existing glossary has lines in the entry region that do not "
            f"match the '- **Term**: Definition' format:\n{details}\n"
            "Fix these by hand before re-running, so no existing content "
            "is silently dropped or misfiled."
        )

    preamble = "\n".join(preamble_lines)
    if preamble and not preamble.endswith("\n\n"):
        preamble = preamble.rstrip("\n") + "\n\n"

    return preamble or DEFAULT_HEADER, entries


def load_new_entries(path: Path) -> dict[str, tuple[str, str]]:
    if not path.exists():
        fail(f"entries file not found: {path}")

    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"entries file is not valid JSON: {exc}")

    if not isinstance(raw, list):
        fail("entries file must be a JSON array of {\"term\", \"definition\"} objects")

    result: dict[str, tuple[str, str]] = {}
    for i, item in enumerate(raw):
        if not isinstance(item, dict):
            fail(f"entries[{i}] is not an object")
        term = item.get("term")
        definition = item.get("definition")
        if not isinstance(term, str) or not term.strip():
            fail(f"entries[{i}] has a missing or empty 'term'")
        if not isinstance(definition, str) or not definition.strip():
            fail(f"entries[{i}] has a missing or empty 'definition' (term: {term!r})")

        key = term.strip().casefold()
        if key in result:
            fail(
                f"entries file has duplicate term {term!r}; merge duplicate "
                "definitions into one entry before calling this script, the "
                "script upserts by term and cannot decide how to combine two "
                "meanings on its own"
            )
        result[key] = (term.strip(), definition.strip())

    return result


def render(preamble: str, entries: dict[str, tuple[str, str]]) -> str:
    ordered = sorted(entries.values(), key=lambda pair: pair[0].casefold())
    body = "\n".join(f"- **{term}**: {definition}" for term, definition in ordered)
    return preamble + body + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("glossary_path", type=Path, help="path to JARGON.md (created if missing)")
    parser.add_argument("entries_path", type=Path, help="path to a JSON array of new/updated entries")
    parser.add_argument("--dry-run", action="store_true", help="report what would change without writing")
    args = parser.parse_args()

    preamble, existing = parse_existing(args.glossary_path)
    new_entries = load_new_entries(args.entries_path)

    added, updated, unchanged = [], [], []
    merged = dict(existing)

    for key, (term, definition) in new_entries.items():
        if key not in existing:
            added.append(term)
        elif existing[key][1] != definition:
            updated.append(term)
        else:
            unchanged.append(term)
            continue
        merged[key] = (term, definition)

    output = render(preamble, merged)

    summary = {
        "glossary_path": str(args.glossary_path),
        "added": sorted(added, key=str.casefold),
        "updated": sorted(updated, key=str.casefold),
        "unchanged": sorted(unchanged, key=str.casefold),
        "total_terms": len(merged),
        "dry_run": args.dry_run,
    }
    print(json.dumps(summary, indent=2))

    if args.dry_run:
        return

    args.glossary_path.parent.mkdir(parents=True, exist_ok=True)
    args.glossary_path.write_text(output, encoding="utf-8")


if __name__ == "__main__":
    main()
