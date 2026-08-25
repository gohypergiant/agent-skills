#!/usr/bin/env python3
"""
merge_epistemic_map.py

Mechanical merge step for the epistemic-mapper skill. Takes one or more
findings JSON files (from the extraction wave and the risk synthesis pass),
merges them against any existing state, and writes a single self-contained
EPISTEMIC-MAP.md -- plain human-readable markdown, nothing else.

Entry format mirrors constraints-extractor's: a short heading (id + a
truncated title), a metadata block of labeled lines (Confidence, Category,
Severity, First seen, and Evidence or Sources considered), the full
statement as its own paragraph, a bolded "Why it matters" paragraph, and a
closing "Evidence notes" (or "Reasoning") section. Every field the merge
needs to round-trip lives in one of those lines -- there is no frontmatter,
no companion file, and nothing stored twice. On the next run, this script
parses that same markdown back in as state, the same approach
constraints-extractor uses.

This script owns: ID assignment, category slug canonicalization, dedup
merge, confidence assignment, promotion/resolution/dismissal tracking, and
ordering. It does not own: judgment about what belongs in which quadrant,
or whether a statement is actually evidenced. That happens upstream, in the
subagents that produce the findings files this script consumes.

This is the ONLY legitimate way EPISTEMIC-MAP.md gets written or updated.
Nothing should hand-draft or restructure this file directly -- see
SKILL.md's "script-only" note if you're an agent tempted to do that. Any
write that doesn't exactly match what this script renders will fail to
parse back in on the next run -- that's deliberate, not a bug to work
around.

Usage:
    python merge_epistemic_map.py \
        --findings /abs/path/source1.json /abs/path/source2.json \
        --output-dir /abs/path/to/repo/root \
        [--backlog-size 5] [--dry-run]

Writes exactly one file: <output-dir>/EPISTEMIC-MAP.md.

All paths must be absolute. Relative paths are refused outright -- a
relative --output-dir resolves against whatever the current working
directory happens to be, which is how stray JSON files end up committed to
a repo root by accident.
"""

import argparse
import difflib
import json
import os
import re
import sys
from datetime import date
from pathlib import Path

REQUIRED_QUADRANTS = {"known-known", "known-unknown", "unknown-known", "unknown-unknown"}
SEVERITIES = {"high", "medium", "low"}
TITLE_MAX_LEN = 70

CATEGORY_ALIASES = {
    "architecture-technical": {"technical", "architecture", "infra", "infrastructure", "system"},
    "product-user": {"product", "user", "ux", "customer", "feature"},
    "business-scope": {"business", "scope", "contract", "commercial", "revenue"},
    "team-process": {"process", "team", "workflow", "ops", "operational"},
    "vendor-external-dependency": {"vendor", "dependency", "third-party", "third party", "integration", "external"},
}

FIELD_NAME_HINTS = {
    "observation": "statement",
    "description": "statement",
    "finding": "statement",
    "notes": "impact",
    "why": "impact",
    "why_it_matters": "impact",
}

QUADRANT_SYNONYM_HINTS = {
    "fact": "known-known",
    "facts": "known-known",
    "question": "known-unknown",
    "questions": "known-unknown",
    "assumption": "unknown-known",
    "assumptions": "unknown-known",
    "risk": "unknown-unknown",
    "risks": "unknown-unknown",
}

STATEMENT_MATCH_THRESHOLD = 0.82

QUADRANT_HEADINGS = (
    ("Facts (Known Known)", "known-known"),
    ("Questions (Known Unknown)", "known-unknown"),
    ("Assumptions (Unknown Known)", "unknown-known"),
    ("Risks (Unknown Unknown)", "unknown-unknown"),
)
HEADING_TO_QUADRANT = dict(QUADRANT_HEADINGS)

ENTRY_HEADING_RE = re.compile(r"^### (EM-\d+) \u00b7 .+$")
CONFIDENCE_LINE_RE = re.compile(r"^Confidence: (CONFIRMED|INFERRED|CONFLICTING)$")
CATEGORY_LINE_RE = re.compile(r"^Category: ([a-z][a-z-]*)$")
SEVERITY_LINE_RE = re.compile(r"^Severity: (high|medium|low)$")
FIRST_SEEN_LINE_RE = re.compile(r"^First seen: (\d{4}-\d{2}-\d{2})$")
STATUS_LINE_RE = re.compile(r"^Status: (resolved|dismissed)(?: \u2014 (.*))?$")
HISTORY_LINE_RE = re.compile(r"^History \((\d{4}-\d{2}-\d{2})\): (\S+) -> (\S+) \u2014 (.*)$")
SOURCES_CONSIDERED_LINE_RE = re.compile(r"^Sources considered: (.+)$")
EVIDENCE_SUMMARY_LINE_RE = re.compile(r"^Evidence: .+$")
WHY_IT_MATTERS_RE = re.compile(r"^\*\*Why it matters:\*\* (.*)$")
EVIDENCE_NOTES_HEADER_RE = re.compile(r"^\*\*Evidence notes:\*\*$")
EVIDENCE_NOTE_BULLET_RE = re.compile(r"^- `(.+?)` -- (.*)$")
REASONING_HEADER_RE = re.compile(r"^\*\*Reasoning:\*\*$")

# The backtick is the delimiter this format uses to wrap "source:location" in
# both the compact Evidence summary line and the Evidence notes bullets.
# Rejecting it from those two fields is cheaper and more honest than a
# parser that silently mis-splits on the rare input that has it.
RESERVED_EVIDENCE_CHAR = "`"


class ValidationError(Exception):
    """Raised when input fails schema or structural validation. Never swallowed."""


def require_absolute(path_str: str, flag_name: str) -> Path:
    path = Path(path_str)
    if not path.is_absolute():
        raise ValidationError(
            f"{flag_name} must be an absolute path, got '{path_str}'. "
            "Relative paths resolve against the current working directory "
            "and are how stray files end up in the repo root."
        )
    return path


def relativize_path(source_path: str, output_dir: Path) -> str:
    """Convert an absolute path to a relative path from the project root.

    If the source path is already relative, return it as-is.
    If it's absolute, try to make it relative to the output directory
    (assumed to be the project root).
    """
    if not source_path:
        return source_path

    source_path_obj = Path(source_path)

    # If already relative, return as-is
    if not source_path_obj.is_absolute():
        return source_path

    # Try to make relative to the output directory (project root)
    try:
        project_root = output_dir.resolve()
        relative = source_path_obj.resolve().relative_to(project_root)
        return str(relative)
    except (ValueError, RuntimeError):
        # If the path is outside the project root, return the original
        return source_path


def normalize_text(text: str) -> str:
    """Collapses embedded newlines/extra whitespace to single spaces and trims.
    A subagent's free-text field containing a literal newline would otherwise
    break this format's paragraph-based parsing on the next run -- cheap
    insurance against an entirely avoidable failure."""
    return re.sub(r"\s+", " ", text or "").strip()


def truncate_title(statement: str, max_len: int = TITLE_MAX_LEN) -> str:
    if len(statement) <= max_len:
        return statement
    return statement[:max_len].rsplit(" ", 1)[0] + "..."


def canonicalize_category(raw_category: str) -> str:
    lowered = raw_category.strip().lower()
    if lowered in CATEGORY_ALIASES:
        return lowered
    for canonical, aliases in CATEGORY_ALIASES.items():
        if lowered in aliases:
            return canonical
    all_terms = list(CATEGORY_ALIASES.keys())
    for canonical, aliases in CATEGORY_ALIASES.items():
        all_terms.extend(aliases)
    match = difflib.get_close_matches(lowered, all_terms, n=1, cutoff=0.75)
    if match:
        term = match[0]
        return term if term in CATEGORY_ALIASES else next(
            canonical for canonical, aliases in CATEGORY_ALIASES.items() if term in aliases
        )
    raise ValidationError(
        f"Category '{raw_category}' does not match any canonical slug or alias. "
        f"Canonical slugs: {', '.join(sorted(CATEGORY_ALIASES.keys()))}. "
        "These are broad functional buckets, not risk-type labels -- pick whichever "
        "one best matches where the consequence actually lands, and put the specific "
        "pattern (e.g. 'cascading schedule dependency') in the statement or reasoning "
        "text instead. Flagging for manual review rather than guessing which one you meant."
    )


def validate_entry(entry: dict, source_file: str) -> None:
    quadrant = entry.get("quadrant")
    if quadrant not in REQUIRED_QUADRANTS:
        hint = ""
        if isinstance(quadrant, str) and quadrant.lower() in QUADRANT_SYNONYM_HINTS:
            hint = (
                f" Did you mean '{QUADRANT_SYNONYM_HINTS[quadrant.lower()]}'? Quadrant "
                "slugs are always the hyphenated known/unknown pair, never a short "
                "synonym like 'fact' or 'risk'."
            )
        raise ValidationError(
            f"[{source_file}] entry has invalid or missing quadrant: {quadrant!r}. "
            f"Must be one of {sorted(REQUIRED_QUADRANTS)}.{hint}"
        )
    if not entry.get("statement", "").strip():
        present_alias = next((k for k in FIELD_NAME_HINTS if k in entry and FIELD_NAME_HINTS[k] == "statement"), None)
        hint = f" Found '{present_alias}' instead — rename it to 'statement'." if present_alias else ""
        raise ValidationError(f"[{source_file}] entry is missing a non-empty 'statement'.{hint}")
    if not entry.get("impact", "").strip():
        present_alias = next((k for k in FIELD_NAME_HINTS if k in entry and FIELD_NAME_HINTS[k] == "impact"), None)
        hint = f" Found '{present_alias}' instead — rename it to 'impact'." if present_alias else ""
        raise ValidationError(
            f"[{source_file}] entry '{entry.get('statement', '')[:60]}' is missing 'impact'. "
            f"A thin metadata-only entry doesn't earn a place in the map.{hint}"
        )
    if entry.get("severity") is not None and entry["severity"] not in SEVERITIES:
        raise ValidationError(
            f"[{source_file}] entry '{entry.get('statement', '')[:60]}' has an invalid "
            f"severity: {entry['severity']!r}. Must be one of {sorted(SEVERITIES)}, or omit it for 'medium'."
        )

    if quadrant == "unknown-unknown":
        if not entry.get("reasoning", "").strip():
            raise ValidationError(
                f"[{source_file}] Risk entry '{entry.get('statement', '')[:60]}' is missing "
                "'reasoning'. Risks are substantiated by synthesis, not citation, but they "
                "still need to show their work."
            )
        if not entry.get("sources_considered"):
            raise ValidationError(
                f"[{source_file}] Risk entry '{entry.get('statement', '')[:60]}' is missing "
                "'sources_considered'. A risk claim needs to name what was synthesized."
            )
    else:
        evidence = entry.get("evidence")
        if not evidence or not isinstance(evidence, list):
            raise ValidationError(
                f"[{source_file}] entry '{entry.get('statement', '')[:60]}' is missing "
                "'evidence'. No evidence, no entry — this applies to every quadrant except Risk."
            )
        for ev in evidence:
            if not ev.get("source") or not ev.get("location"):
                raise ValidationError(
                    f"[{source_file}] entry '{entry.get('statement', '')[:60]}' has an "
                    "evidence item missing 'source' or 'location'."
                )
            for field_name in ("source", "location"):
                text = ev.get(field_name) or ""
                if RESERVED_EVIDENCE_CHAR in text:
                    raise ValidationError(
                        f"[{source_file}] entry '{entry.get('statement', '')[:60]}' has an "
                        f"evidence '{field_name}' containing a backtick, which this format "
                        "uses to wrap the citation and can't safely contain. Rephrase it."
                    )


def load_findings(paths: list, output_dir: Path) -> list:
    entries = []
    for path in paths:
        if not path.exists():
            raise ValidationError(f"Findings file does not exist: {path}")
        with path.open() as f:
            data = json.load(f)

        if "entries" not in data:
            raise ValidationError(
                f"{path} has no top-level 'entries' key. Found keys instead: "
                f"{sorted(data.keys())}. Every findings file must be shaped "
                '{"entries": [...]} per references/schema.md — a subagent producing '
                "a differently-shaped report (grouped by category, a different key "
                "name, etc.) will silently contribute zero entries here rather than "
                "erroring, which is exactly the bug this check exists to catch."
            )
        if not isinstance(data["entries"], list):
            raise ValidationError(
                f"{path}'s 'entries' key is a {type(data['entries']).__name__}, "
                "not a list. Expected a flat array of entry objects."
            )

        for entry in data["entries"]:
            validate_entry(entry, str(path))
            entry["category"] = canonicalize_category(entry["category"])
            entry.setdefault("confidence", "INFERRED")
            entry.setdefault("severity", "medium")
            entry["statement"] = normalize_text(entry["statement"])
            entry["impact"] = normalize_text(entry["impact"])
            if entry.get("reasoning"):
                entry["reasoning"] = normalize_text(entry["reasoning"])
            for ev in entry.get("evidence", []):
                # Relativize the source path
                if "source" in ev:
                    ev["source"] = relativize_path(ev["source"], output_dir)
                for field_name in ("source", "location", "detail"):
                    if field_name in ev:
                        ev[field_name] = normalize_text(ev[field_name])
            entries.append(entry)
    return entries


# ---------------------------------------------------------------------------
# Parsing prior state directly out of EPISTEMIC-MAP.md's own rendered text.
# No frontmatter, no companion file -- the markdown this script wrote last
# time is itself the state, the same approach constraints-extractor uses.
# ---------------------------------------------------------------------------

def load_state(output_file: Path) -> list:
    """
    Returns the list of entries currently recorded in EPISTEMIC-MAP.md, by
    parsing its own rendered structure back in. No file yet is a normal
    first-run condition. A file that exists but doesn't match this script's
    own output format IS an error -- refusing to guess at prior state is
    safer than silently starting over and losing every promotion recorded.
    """
    if not output_file.exists():
        return []

    text = output_file.read_text()
    if text.startswith("---\n"):
        raise ValidationError(
            f"{output_file} starts with '---', which looks like the old "
            "frontmatter-based format from a previous version of this skill. "
            "That format is no longer supported -- delete the file and let "
            "this run regenerate it from scratch, or restore a pre-frontmatter "
            "backup if one exists."
        )

    entries = []
    sections = re.split(r"(?m)^## (.+)$", text)
    for i in range(1, len(sections), 2):
        heading = sections[i].strip()
        quadrant = HEADING_TO_QUADRANT.get(heading)
        if quadrant is None:
            continue  # "Epistemic Backlog" or anything else -- not entries.
        body = sections[i + 1] if i + 1 < len(sections) else ""
        entries.extend(_parse_quadrant_section(body, quadrant, output_file))
    return entries


def split_paragraphs(text: str) -> list:
    return [p.strip() for p in re.split(r"\n\s*\n", text.strip("\n")) if p.strip()]


def _parse_quadrant_section(body: str, quadrant: str, source_path: Path) -> list:
    blocks = re.split(r"(?m)^### ", body)
    return [_parse_entry_block("### " + b, quadrant, source_path) for b in blocks[1:]]


def _parse_entry_block(block: str, quadrant: str, source_path: Path) -> dict:
    lines = block.splitlines()
    heading_line = lines[0]
    if not ENTRY_HEADING_RE.match(heading_line):
        raise ValidationError(
            f"{source_path}: couldn't parse entry heading: {heading_line!r}. "
            "EPISTEMIC-MAP.md's structure must exactly match what "
            "merge_epistemic_map.py renders -- if this file was hand-edited, "
            "that's most likely why. Restore the original format or delete "
            "the file and let the script regenerate it."
        )
    entry_id = heading_line[len("### "):].split(" \u00b7 ", 1)[0].strip()

    paragraphs = split_paragraphs("\n".join(lines[1:]))
    if len(paragraphs) < 4:
        raise ValidationError(
            f"{source_path}: entry {entry_id} doesn't have the expected structure "
            "(metadata block, statement paragraph, 'Why it matters' paragraph, and "
            f"an Evidence notes or Reasoning section) -- found {len(paragraphs)} "
            "paragraph(s). If this file was hand-edited, that's most likely why."
        )
    if len(paragraphs) > 4:
        raise ValidationError(
            f"{source_path}: entry {entry_id} has {len(paragraphs)} paragraphs, more "
            "than this format expects (metadata, statement, why-it-matters, "
            "evidence/reasoning). Unexpected extra content -- if this file was "
            "hand-edited, that's most likely why."
        )

    metadata_block, statement_block, why_block, trailing_block = paragraphs

    entry = {
        "id": entry_id, "quadrant": quadrant,
        "confidence": None, "category": None, "severity": None, "first_seen": None,
        "status": "active", "resolution_note": None, "history": [],
        "evidence": [], "reasoning": None, "sources_considered": [],
        "statement": None, "impact": None,
    }

    for raw_line in metadata_block.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if (m := CONFIDENCE_LINE_RE.match(line)):
            entry["confidence"] = m.group(1)
        elif (m := CATEGORY_LINE_RE.match(line)):
            entry["category"] = m.group(1)
        elif (m := SEVERITY_LINE_RE.match(line)):
            entry["severity"] = m.group(1)
        elif (m := FIRST_SEEN_LINE_RE.match(line)):
            entry["first_seen"] = m.group(1)
        elif (m := STATUS_LINE_RE.match(line)):
            entry["status"], entry["resolution_note"] = m.groups()
        elif (m := HISTORY_LINE_RE.match(line)):
            h_date, was, became, reason = m.groups()
            entry["history"].append({"date": h_date, "was": was, "became": became, "reason": reason})
        elif (m := SOURCES_CONSIDERED_LINE_RE.match(line)):
            entry["sources_considered"] = [s.strip() for s in m.group(1).split(",")]
        elif EVIDENCE_SUMMARY_LINE_RE.match(line):
            continue  # Derived summary line -- Evidence notes below is the real data.
        else:
            raise ValidationError(
                f"{source_path}: entry {entry_id} has an unrecognized metadata line: "
                f"{line!r}. If this file was hand-edited, that's most likely why."
            )

    missing = [f for f in ("confidence", "category", "severity", "first_seen") if entry[f] is None]
    if missing:
        raise ValidationError(
            f"{source_path}: entry {entry_id}'s metadata block is missing required "
            f"field(s): {missing}."
        )

    entry["statement"] = normalize_text(statement_block)

    why_lines = why_block.splitlines()
    m = WHY_IT_MATTERS_RE.match(why_lines[0])
    if not m:
        raise ValidationError(
            f"{source_path}: entry {entry_id} is missing the '**Why it matters:** ' "
            "paragraph in the expected position (third paragraph of the entry)."
        )
    entry["impact"] = normalize_text(" ".join([m.group(1)] + why_lines[1:]))

    trailing_lines = trailing_block.splitlines()
    if quadrant == "unknown-unknown":
        if not REASONING_HEADER_RE.match(trailing_lines[0].strip()):
            raise ValidationError(
                f"{source_path}: Risk entry {entry_id} is missing the '**Reasoning:**' "
                "section in the expected position (fourth paragraph of the entry)."
            )
        entry["reasoning"] = normalize_text(" ".join(trailing_lines[1:]))
    else:
        if not EVIDENCE_NOTES_HEADER_RE.match(trailing_lines[0].strip()):
            raise ValidationError(
                f"{source_path}: entry {entry_id} is missing the '**Evidence notes:**' "
                "section in the expected position (fourth paragraph of the entry)."
            )
        for bullet in trailing_lines[1:]:
            bm = EVIDENCE_NOTE_BULLET_RE.match(bullet.strip())
            if not bm:
                raise ValidationError(
                    f"{source_path}: entry {entry_id} has an unparseable evidence note "
                    f"line: {bullet!r}."
                )
            source_location, detail = bm.groups()
            source, _, location = source_location.partition(":")
            entry["evidence"].append({"source": source, "location": location, "detail": detail})

    return entry


def statement_similarity(a: str, b: str) -> float:
    return difflib.SequenceMatcher(None, a.lower(), b.lower()).ratio()


def next_id(existing_ids: set) -> str:
    n = 1
    while f"EM-{n:03d}" in existing_ids:
        n += 1
    return f"EM-{n:03d}"


def merge_entries(new_entries: list, prior_entries: list, today: str) -> tuple:
    """
    Merges new findings into prior state. Returns (merged_entries, promotions,
    dedup_count). Entries from prior state that aren't touched by this run
    are carried forward unchanged — a partial run should never wipe entries
    a previous run found.
    """
    prior_by_id = {e["id"]: e for e in prior_entries}
    used_ids = set(prior_by_id.keys())
    merged = dict(prior_by_id)
    promotions = []
    dedup_count = 0

    for new_entry in new_entries:
        match_id = None
        for existing_id, existing in prior_by_id.items():
            if statement_similarity(existing["statement"], new_entry["statement"]) >= STATEMENT_MATCH_THRESHOLD:
                match_id = existing_id
                break

        if match_id:
            existing = merged[match_id]
            if existing["quadrant"] != new_entry["quadrant"]:
                existing.setdefault("history", []).append({
                    "date": today,
                    "was": existing["quadrant"],
                    "became": new_entry["quadrant"],
                    "reason": new_entry.get("impact", ""),
                })
                promotions.append((match_id, existing["quadrant"], new_entry["quadrant"]))
                existing["quadrant"] = new_entry["quadrant"]
                existing["confidence"] = "CONFIRMED"
            else:
                if existing.get("confidence") != "CONFLICTING":
                    existing["confidence"] = "CONFIRMED"
                dedup_count += 1
            existing["statement"] = new_entry["statement"]
            existing["category"] = new_entry["category"]
            existing["impact"] = new_entry["impact"]
            existing["evidence"] = new_entry.get("evidence", existing.get("evidence"))
            existing["reasoning"] = new_entry.get("reasoning", existing.get("reasoning"))
            existing["sources_considered"] = new_entry.get("sources_considered", existing.get("sources_considered"))
            existing["severity"] = new_entry.get("severity", existing.get("severity", "medium"))
            existing["status"] = new_entry.get("status", existing.get("status", "active"))
        else:
            new_id = next_id(used_ids)
            used_ids.add(new_id)
            new_entry["id"] = new_id
            new_entry.setdefault("status", "active")
            new_entry.setdefault("history", [])
            new_entry.setdefault("first_seen", today)
            merged[new_id] = new_entry

    return list(merged.values()), promotions, dedup_count


def executive_summary(entries: list) -> str:
    facts = sum(1 for e in entries if e["quadrant"] == "known-known" and e.get("status") == "active")
    unresolved = sum(
        1 for e in entries
        if e["quadrant"] in ("known-unknown", "unknown-known", "unknown-unknown")
        and e.get("status") == "active"
    )
    if facts == 0 and unresolved == 0:
        return "No entries yet. Run extraction to populate the map."
    tilt = "Fact-Heavy" if facts >= unresolved else "Assumption-Heavy"
    return (
        f"This repository is currently **{tilt}**: {facts} validated facts against "
        f"{unresolved} unresolved questions, assumptions, and risks. "
        f"{'Most of what matters here is proven.' if tilt == 'Fact-Heavy' else 'Most of what matters here is still unvalidated — treat this as the priority list before scaling.'}"
    )


def render_entry(e: dict) -> str:
    lines = [f"### {e['id']} \u00b7 {truncate_title(e['statement'])}", ""]

    lines.append(f"Confidence: {e['confidence']}")
    lines.append(f"Category: {e['category']}")
    lines.append(f"Severity: {e.get('severity', 'medium')}")
    lines.append(f"First seen: {e['first_seen']}")
    status = e.get("status", "active")
    if status != "active":
        note = e.get("resolution_note") or ""
        lines.append(f"Status: {status}" + (f" \u2014 {note}" if note else ""))
    for h in e.get("history", []):
        lines.append(f"History ({h['date']}): {h['was']} -> {h['became']} \u2014 {h['reason']}")

    if e["quadrant"] == "unknown-unknown":
        sources = e.get("sources_considered") or []
        lines.append(f"Sources considered: {', '.join(sources)}")
    else:
        evidence = e.get("evidence", [])
        refs = ", ".join(f"`{ev['source']}:{ev['location']}`" for ev in evidence)
        ref_word = "ref" if len(evidence) == 1 else "refs"
        lines.append(f"Evidence: {refs} ({len(evidence)} {ref_word})")

    lines += ["", e["statement"], "", f"**Why it matters:** {e['impact']}", ""]

    if e["quadrant"] == "unknown-unknown":
        lines.append("**Reasoning:**")
        lines.append(e.get("reasoning", ""))
    else:
        lines.append("**Evidence notes:**")
        for ev in e.get("evidence", []):
            lines.append(f"- `{ev['source']}:{ev['location']}` -- {ev.get('detail', '')}")

    return "\n".join(lines)


def build_backlog(entries: list, size: int) -> list:
    severity_rank = {"high": 0, "medium": 1, "low": 2}
    quadrant_rank = {"unknown-unknown": 0, "unknown-known": 1, "known-unknown": 2}
    candidates = [
        e for e in entries
        if e["quadrant"] in quadrant_rank and e.get("status", "active") == "active"
    ]
    candidates.sort(key=lambda e: (
        quadrant_rank[e["quadrant"]],
        severity_rank.get(e.get("severity", "medium"), 1),
    ))
    return candidates[:size]


def render_map(entries: list, backlog: list) -> str:
    facts = [e for e in entries if e["quadrant"] == "known-known"]
    questions = [e for e in entries if e["quadrant"] == "known-unknown"]
    assumptions = [e for e in entries if e["quadrant"] == "unknown-known"]
    risks = [e for e in entries if e["quadrant"] == "unknown-unknown"]

    def count_active(bucket):
        return sum(1 for e in bucket if e.get("status", "active") == "active")

    resolved_total = sum(1 for e in entries if e.get("status") in ("resolved", "dismissed"))

    parts = [
        "# Epistemic Map",
        "",
        f"_Last updated: {date.today().isoformat()} \u00b7 "
        f"{count_active(facts)} facts \u00b7 {count_active(questions)} open questions \u00b7 "
        f"{count_active(assumptions)} assumptions \u00b7 {count_active(risks)} risks \u00b7 "
        f"{resolved_total} resolved since tracking began_",
        "",
        executive_summary(entries),
        "",
        "## Facts (Known Known)",
        "",
    ]
    parts.extend(render_entry(e) + "\n" for e in facts) if facts else parts.append("_None recorded yet._\n")
    parts += ["## Questions (Known Unknown)", ""]
    parts.extend(render_entry(e) + "\n" for e in questions) if questions else parts.append("_None recorded yet._\n")
    parts += ["## Assumptions (Unknown Known)", ""]
    parts.extend(render_entry(e) + "\n" for e in assumptions) if assumptions else parts.append("_None recorded yet._\n")
    parts += ["## Risks (Unknown Unknown)", ""]
    parts.extend(render_entry(e) + "\n" for e in risks) if risks else parts.append("_None recorded yet._\n")
    parts += ["## Epistemic Backlog", ""]
    if backlog:
        for item in backlog:
            parts.append(f"- [ ] {item['impact']} \u2014 resolves {item['id']} ({item.get('severity', 'medium')})")
    else:
        parts.append("_Nothing outstanding._")
    return "\n".join(parts) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--findings", nargs="+", required=True, help="Absolute paths to findings JSON files.")
    parser.add_argument("--output-dir", required=True, help="Absolute path to the directory to write EPISTEMIC-MAP.md into.")
    parser.add_argument("--backlog-size", type=int, default=5, help="Number of backlog items to surface (default 5).")
    parser.add_argument("--dry-run", action="store_true", help="Print the rendered map instead of writing files.")
    args = parser.parse_args()

    try:
        findings_paths = [require_absolute(p, "--findings") for p in args.findings]
        output_dir = require_absolute(args.output_dir, "--output-dir")

        output_file = output_dir / "EPISTEMIC-MAP.md"
        new_entries = load_findings(findings_paths, output_dir)
        prior_entries = load_state(output_file)

        today = date.today().isoformat()
        merged_entries, promotions, dedup_count = merge_entries(new_entries, prior_entries, today)
        backlog = build_backlog(merged_entries, args.backlog_size)
        rendered = render_map(merged_entries, backlog)

        if args.dry_run:
            print(rendered)
        else:
            output_dir.mkdir(parents=True, exist_ok=True)
            output_file.write_text(rendered)

        print("\n--- merge summary ---", file=sys.stderr)
        print(f"Total entries: {len(merged_entries)}", file=sys.stderr)
        print(f"New findings processed: {len(new_entries)} (dedup matches: {dedup_count})", file=sys.stderr)
        if promotions:
            print("Promotions:", file=sys.stderr)
            for entry_id, was, became in promotions:
                print(f"  [{entry_id}] {was} -> {became}", file=sys.stderr)
        else:
            print("Promotions: none this run.", file=sys.stderr)

    except ValidationError as e:
        print(f"error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
