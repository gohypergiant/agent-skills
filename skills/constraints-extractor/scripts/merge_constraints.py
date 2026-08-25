#!/usr/bin/env python3
"""
merge_constraints.py

Deterministically merges correlated constraint findings into a CONSTRAINTS.md
file, using an agent-optimized entry grammar: a stable CONSTR-<CATEGORY>-<NNN>
identifier per entry, a line-oriented `Key: value` metadata block, and a
one-line-per-citation `Evidence notes` list. Owns all mechanical file
operations (ID assignment, category insertion, dedup merge, ordering) so the
orchestrating agent never hand-formats an entry -- hand formatting is how ad
hoc structure ends up in the file, and it breaks this script's ability to
parse the file back in on the next run.

Usage:
    python3 merge_constraints.py --target CONSTRAINTS.md --findings findings.json

Idempotent: running twice with the same findings file produces no diff.

Both --target and --findings should be absolute paths. --findings in
particular: the script refuses to run with a relative path, since a relative
path resolves against the repo being scanned, not /tmp. Always build findings
files under a `mktemp -d "/tmp/constraints-extractor.XXXXXX"` directory and
pass the absolute path.

A finding that fails validation is skipped individually, not fatal -- every
other valid finding in the same run still gets written. The script only
refuses to write anything for document-level problems (invalid JSON, a
missing `constraints` key, a bad path) where there's genuinely nothing to
salvage.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import TypedDict

TEMPLATE_RELATIVE_PATH = Path(__file__).resolve().parent.parent / "references" / "template.md"

MIDDLE_DOT = "\u00b7"
EM_DASH = "\u2014"
EMPTY_MARKER = "*No entries yet.*"
VALID_CONFIDENCE = {"CONFIRMED", "CONFLICTING"}

CATEGORY_ORDER: tuple[tuple[str, str], ...] = (
    ("compliance-governance", "1. Compliance & Governance"),
    ("security-privacy-ip-cui", "2. Security, Privacy, IP & CUI"),
    ("hosting-infrastructure", "3. Hosting & Infrastructure Boundaries"),
    ("tooling-approved-path", "4. Tooling & Approved-Path Restrictions"),
    ("workflow-sequencing", "5. Workflow & Sequencing Requirements"),
    ("stakeholder-executive", "6. Stakeholder & Executive Expectations"),
    ("scope-prioritization-delivery", "7. Scope, Prioritization & Delivery Boundaries"),
    ("external-dependencies", "8. External Dependencies Shaping Future Planning"),
)
HEADING_TO_SLUG: dict[str, str] = {heading: slug for slug, heading in CATEGORY_ORDER}
CATEGORY_SLUGS: set[str] = {slug for slug, _ in CATEGORY_ORDER}

# The short uppercase tag used in every entry's stable ID, CONSTR-<TAG>-<NNN>.
# Chosen once; changing a tag orphans every existing ID using it, so treat
# this table itself as append-only in practice.
CATEGORY_ID_TAG: dict[str, str] = {
    "compliance-governance": "COMPLY",
    "security-privacy-ip-cui": "SEC",
    "hosting-infrastructure": "INFRA",
    "tooling-approved-path": "TOOL",
    "workflow-sequencing": "FLOW",
    "stakeholder-executive": "STAKE",
    "scope-prioritization-delivery": "SCOPE",
    "external-dependencies": "DEPS",
}
ID_TAG_TO_CATEGORY: dict[str, str] = {tag: slug for slug, tag in CATEGORY_ID_TAG.items()}

CATEGORY_ALIASES: dict[str, str] = {
    "compliance": "compliance-governance",
    "governance": "compliance-governance",
    "security": "security-privacy-ip-cui",
    "privacy": "security-privacy-ip-cui",
    "cui": "security-privacy-ip-cui",
    "ip": "security-privacy-ip-cui",
    "hosting": "hosting-infrastructure",
    "infrastructure": "hosting-infrastructure",
    "infra": "hosting-infrastructure",
    "tooling": "tooling-approved-path",
    "tools": "tooling-approved-path",
    "approved-path": "tooling-approved-path",
    "workflow": "workflow-sequencing",
    "sequencing": "workflow-sequencing",
    "operational": "workflow-sequencing",
    "operations": "workflow-sequencing",
    "stakeholder": "stakeholder-executive",
    "executive": "stakeholder-executive",
    "scope": "scope-prioritization-delivery",
    "prioritization": "scope-prioritization-delivery",
    "delivery": "scope-prioritization-delivery",
    "dependencies": "external-dependencies",
    "dependency": "external-dependencies",
    "external": "external-dependencies",
}


def normalize_category(raw: str) -> str | None:
    key = (raw or "").strip().lower()
    if key in CATEGORY_SLUGS:
        return key
    if key in CATEGORY_ALIASES:
        return CATEGORY_ALIASES[key]
    import difflib

    candidates = CATEGORY_SLUGS | set(CATEGORY_ALIASES)
    matches = difflib.get_close_matches(key, candidates, n=1, cutoff=0.6)
    if matches:
        resolved = matches[0]
        return CATEGORY_ALIASES.get(resolved, resolved)
    return None


def normalize_title(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (title or "").strip().lower()).strip("-")


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

class EvidenceItem(TypedDict):
    file: str
    location: str  # a line number ("37") or inclusive range ("8-11")
    note: str       # one-line explanation of what this citation shows


class Claim(TypedDict):
    letter: str
    statement: str
    file: str
    location: str


class Entry(TypedDict):
    id: str  # "CONSTR-<TAG>-<NNN>", assigned once, stable across retitles
    title: str
    confidence: str  # "CONFIRMED" | "CONFLICTING"
    category: str
    affects: list[str]
    enforced_by: list[str]
    evidence: list[EvidenceItem]
    statement: str
    impact: str
    claims: list[Claim]


def format_citation(file: str, location: str) -> str:
    return f"`{file}:{location}`" if location else f"`{file}`"


def parse_citation(token: str) -> tuple[str, str]:
    """Splits a `file:location` token on the LAST colon, so a location
    containing no colon of its own (the normal case) round-trips cleanly."""
    text = token.strip().strip("`").strip()
    if ":" in text:
        file_part, _, location = text.rpartition(":")
        return file_part.strip(), location.strip()
    return text, ""


def relativize_path(file_path: str, target_path: Path) -> str:
    """Convert an absolute path to a relative path from the project root.

    If the file path is already relative, return it as-is.
    If it's absolute, try to make it relative to the directory containing
    the target CONSTRAINTS.md file (assumed to be the project root).
    """
    if not file_path:
        return file_path

    file_path_obj = Path(file_path)

    # If already relative, return as-is
    if not file_path_obj.is_absolute():
        return file_path

    # Try to make relative to the target's parent directory (project root)
    try:
        project_root = target_path.parent.resolve()
        relative = file_path_obj.resolve().relative_to(project_root)
        return str(relative)
    except (ValueError, RuntimeError):
        # If the path is outside the project root, return the original
        return file_path


# ---------------------------------------------------------------------------
# Shape normalization -- tolerates common field-name and evidence-shape
# variation from extraction/correlation before validation ever runs. This is
# a tolerance layer, not permission to skip the schema upstream --
# references/troubleshooting.md still defines the canonical shape, and every
# promotion made here is reported as a note so drift stays visible even when
# the run succeeds.
# ---------------------------------------------------------------------------

TITLE_ALIASES: tuple[str, ...] = ("name", "constraint", "constraint_title", "heading", "label")
STATEMENT_ALIASES: tuple[str, ...] = ("description", "text", "content", "claim", "rule")
IMPACT_ALIASES: tuple[str, ...] = ("why_it_matters", "why", "rationale", "significance", "consequence")
EVIDENCE_KEY_ALIASES: tuple[str, ...] = ("citations", "sources", "references", "evidence_sources", "citation")
EVIDENCE_FILE_ALIASES: tuple[str, ...] = ("path", "source", "doc", "document")
EVIDENCE_LOCATION_ALIASES: tuple[str, ...] = ("section", "anchor", "loc", "line", "lines", "ref")
EVIDENCE_NOTE_ALIASES: tuple[str, ...] = ("explanation", "why", "shows", "detail", "description")
AFFECTS_ALIASES: tuple[str, ...] = ("related", "related_to", "affected", "impacts")
ENFORCED_BY_ALIASES: tuple[str, ...] = ("enforced_by", "enforces", "enforced-by")


def _promote(d: dict, canonical: str, aliases: tuple[str, ...]) -> str | None:
    existing = d.get(canonical)
    if isinstance(existing, str) and existing.strip():
        return None
    for alias in aliases:
        value = d.get(alias)
        if isinstance(value, str) and value.strip():
            d[canonical] = value
            return f'"{alias}" -> "{canonical}"'
    return None


def _coerce_token_list(raw: object) -> list[str]:
    """Coerces Affects/Enforced-by into a list of bare tokens. Accepts an
    actual list (each item stringified) or a comma-separated string."""
    if isinstance(raw, list):
        return [str(t).strip() for t in raw if str(t).strip()]
    if isinstance(raw, str) and raw.strip():
        return [t.strip() for t in raw.split(",") if t.strip()]
    return []


def _coerce_evidence_list(raw: object) -> list[object]:
    if isinstance(raw, list):
        return raw
    if isinstance(raw, dict):
        return [raw]
    if isinstance(raw, str) and raw.strip():
        return [part.strip() for part in raw.split(",") if part.strip()]
    return []


def _normalize_evidence_item(item: object, notes: list[str], label: str, idx: int) -> object:
    """Accepts a plain citation string (`"file:location"`, optionally with a
    trailing `-- note` or `| note`), or a dict using alias keys, and returns
    a plain `{"file", "location", "note"}` dict."""
    if isinstance(item, str):
        text = item.strip()
        note = ""
        for sep in (" -- ", " | ", " \u2014 "):
            if sep in text:
                text, _, note = text.partition(sep)
                text = text.strip()
                note = note.strip()
                break
        file_part, location = parse_citation(text)
        notes.append(f"{label}: evidence[{idx}] was a plain string, split into file/location")
        return {"file": file_part, "location": location, "note": note}

    if isinstance(item, dict):
        result = dict(item)
        if not (isinstance(result.get("file"), str) and result["file"].strip()):
            for alias in EVIDENCE_FILE_ALIASES:
                value = result.get(alias)
                if isinstance(value, str) and value.strip():
                    result["file"] = value
                    notes.append(f'{label}: evidence[{idx}] "{alias}" -> "file"')
                    break
        if not (isinstance(result.get("location"), str) and result["location"].strip()):
            for alias in EVIDENCE_LOCATION_ALIASES:
                value = result.get(alias)
                if isinstance(value, str) and value.strip():
                    result["location"] = value
                    notes.append(f'{label}: evidence[{idx}] "{alias}" -> "location"')
                    break
        if not (isinstance(result.get("note"), str) and result["note"].strip()):
            for alias in EVIDENCE_NOTE_ALIASES:
                value = result.get(alias)
                if isinstance(value, str) and value.strip():
                    result["note"] = value
                    notes.append(f'{label}: evidence[{idx}] "{alias}" -> "note"')
                    break
        return result

    return item


def _normalize_evidence_field(container: dict, notes: list[str], label: str) -> None:
    if not container.get("evidence"):
        for alias in EVIDENCE_KEY_ALIASES:
            if container.get(alias):
                container["evidence"] = container[alias]
                notes.append(f'{label}: "{alias}" -> "evidence"')
                break

    raw = container.get("evidence")
    if raw is not None and not isinstance(raw, list):
        coerced = _coerce_evidence_list(raw)
        notes.append(
            f'{label}: "evidence" was a {type(raw).__name__}, not a list -- '
            f"coerced into {len(coerced)} item(s)"
        )
        container["evidence"] = coerced

    if isinstance(container.get("evidence"), list):
        container["evidence"] = [
            _normalize_evidence_item(item, notes, label, j)
            for j, item in enumerate(container["evidence"])
        ]


def _normalize_claims(finding: dict, notes: list[str], label: str) -> None:
    """Coerces `claims` into a list if it was provided as a single dict --
    a plausible shape a subagent might produce for a two-source conflict
    before it learns better. Nothing here accepts the retired singular
    `conflict` shape; this skill has no released version to stay
    compatible with, so that shim was removed rather than carried
    forward."""
    claims = finding.get("claims")
    if isinstance(claims, dict):
        finding["claims"] = [claims]
        notes.append(f'{label}: "claims" was a single object, wrapped into a list')


def _derive_title_from_statement(statement: str, max_len: int = 80) -> str:
    """Derives a short title from a statement's first sentence when no
    title-like field was provided at all. Not a substitute for a real
    title -- extraction should still supply one -- but a missing title on
    an otherwise well-formed finding shouldn't be enough to lose the whole
    entry, especially since the statement it's derived from is already a
    required field."""
    text = statement.strip()
    m = re.match(r"^(.+?[.!?])(\s|$)", text)
    first_sentence = (m.group(1) if m else text).rstrip(".!?").strip()
    if len(first_sentence) <= max_len:
        return first_sentence
    truncated = first_sentence[:max_len].rsplit(" ", 1)[0]
    return truncated.rstrip(".,;: ")


def normalize_finding_shapes(findings: dict) -> list[str]:
    notes: list[str] = []

    for i, finding in enumerate(findings.get("constraints", [])):
        if not isinstance(finding, dict):
            continue
        label = finding.get("title") or finding.get("name") or f"constraints[{i}]"

        for canonical, aliases in (
            ("title", TITLE_ALIASES),
            ("statement", STATEMENT_ALIASES),
            ("impact", IMPACT_ALIASES),
        ):
            note = _promote(finding, canonical, aliases)
            if note:
                notes.append(f"{label}: {note}")

        if "affects" not in finding:
            for alias in AFFECTS_ALIASES:
                if finding.get(alias):
                    finding["affects"] = finding[alias]
                    notes.append(f'{label}: "{alias}" -> "affects"')
                    break
        if "enforced_by" not in finding:
            for alias in ENFORCED_BY_ALIASES:
                if finding.get(alias):
                    finding["enforced_by"] = finding[alias]
                    notes.append(f'{label}: "{alias}" -> "enforced_by"')
                    break
        finding["affects"] = _coerce_token_list(finding.get("affects"))
        finding["enforced_by"] = _coerce_token_list(finding.get("enforced_by"))

        confidence = str(finding.get("confidence", "")).strip().upper()
        is_conflicting = confidence == "CONFLICTING" or bool(finding.get("claims"))

        if is_conflicting:
            _normalize_claims(finding, notes, label)
            finding["confidence"] = "CONFLICTING"
        else:
            _normalize_evidence_field(finding, notes, label)
            finding["confidence"] = "CONFIRMED"

        if not (isinstance(finding.get("title"), str) and finding["title"].strip()):
            source_text = finding.get("statement")
            if not (isinstance(source_text, str) and source_text.strip()):
                claims = finding.get("claims")
                if isinstance(claims, list) and claims and isinstance(claims[0], dict):
                    source_text = claims[0].get("statement")
            if isinstance(source_text, str) and source_text.strip():
                derived = _derive_title_from_statement(source_text)
                if derived:
                    finding["title"] = derived
                    notes.append(f'{label}: no title provided, derived "{derived}" from statement')

    return notes


# ---------------------------------------------------------------------------
# Validation -- per finding. A finding that fails is skipped, not fatal.
# ---------------------------------------------------------------------------

def validate_finding(finding: object) -> list[str]:
    if not isinstance(finding, dict):
        return [f"finding is not a JSON object (got {type(finding).__name__})"]

    problems: list[str] = []
    keys = sorted(finding.keys())

    if not finding.get("title", "").strip():
        problems.append(f'missing or empty "title" (keys present: {keys})')

    confidence = finding.get("confidence")
    if confidence not in VALID_CONFIDENCE:
        problems.append(f'"confidence" must be CONFIRMED or CONFLICTING, got {confidence!r}')

    if confidence == "CONFLICTING":
        claims = finding.get("claims")
        if not isinstance(claims, list) or len(claims) < 2:
            problems.append('"claims" must be a list of at least 2 items for a CONFLICTING finding')
        else:
            for j, c in enumerate(claims):
                if not isinstance(c, dict) or not c.get("statement", "").strip():
                    problems.append(f'claims[{j}] is missing a "statement"')
                if not isinstance(c, dict) or not c.get("file", "").strip():
                    problems.append(f'claims[{j}] is missing a "file"')
    else:
        if not finding.get("statement", "").strip():
            problems.append(f'missing or empty "statement" (keys present: {keys})')
        if not finding.get("impact", "").strip():
            problems.append(
                f'missing or empty "impact" (keys present: {keys}) -- this is the '
                "field that keeps entries from being just metadata with no "
                "substance, see references/troubleshooting.md"
            )
        if not finding.get("evidence"):
            problems.append(
                f'"evidence" is missing or empty (keys present: {keys}) -- every '
                "constraint needs at least one citation, see references/troubleshooting.md"
            )
        else:
            for j, e in enumerate(finding["evidence"]):
                if not isinstance(e, dict) or not e.get("file", "").strip():
                    item_keys = sorted(e.keys()) if isinstance(e, dict) else type(e).__name__
                    problems.append(f'evidence[{j}] is missing a "file" value (got: {item_keys})')

    return problems


# ---------------------------------------------------------------------------
# ID assignment
# ---------------------------------------------------------------------------

def next_id(existing_ids: set[str], slug: str) -> str:
    """First-free-number, scoped per category, zero-padded to 3 digits.
    Never reuses a number even if a lower one frees up -- IDs are assigned
    once and never recycled within a run of this script."""
    tag = CATEGORY_ID_TAG[slug]
    prefix = f"CONSTR-{tag}-"
    used: set[int] = set()
    for eid in existing_ids:
        if eid.startswith(prefix):
            suffix = eid[len(prefix):]
            if suffix.isdigit():
                used.add(int(suffix))
    n = 1
    while n in used:
        n += 1
    return f"{prefix}{n:03d}"


# ---------------------------------------------------------------------------
# Parsing an existing CONSTRAINTS.md
# ---------------------------------------------------------------------------

HEADER_RE = re.compile(r"^CONSTR-([A-Z]+)-(\d{3})\s*" + MIDDLE_DOT + r"\s*(.+)$")
FIELD_LINE_RE = re.compile(r"^([A-Z][a-zA-Z-]*):\s*(.*)$")
EVIDENCE_NOTE_LINE_RE = re.compile(r"^-\s+`([^`]+)`\s*--\s*(.+)$")
CLAIM_HEADER_RE = re.compile(r"^\*\*Claim ([A-Z]):\*\*\s*(.+)$")
CLAIM_CITATION_RE = re.compile(r"^" + EM_DASH + r"\s*`([^`]+)`\s*$")


def parse_existing(text: str) -> dict[str, dict[str, Entry]]:
    """Returns categories[slug][id] = Entry."""
    categories: dict[str, dict[str, Entry]] = {slug: {} for slug, _ in CATEGORY_ORDER}
    sections = re.split(r"^## +(.+?)\s*$", text, flags=re.MULTILINE)
    for i in range(1, len(sections), 2):
        heading = sections[i].strip()
        slug = HEADING_TO_SLUG.get(heading)
        if slug is None:
            continue
        body = sections[i + 1] if i + 1 < len(sections) else ""
        for entry in _parse_entries(body, slug):
            categories[slug][entry["id"]] = entry
    return categories


def _parse_entries(body: str, slug: str) -> list[Entry]:
    entries: list[Entry] = []
    blocks = re.split(r"^### +(.+?)\s*$", body, flags=re.MULTILINE)
    for i in range(1, len(blocks), 2):
        header = blocks[i].strip()
        block_body = blocks[i + 1] if i + 1 < len(blocks) else ""
        entry = _parse_single_entry(header, block_body, slug)
        if entry is not None:
            entries.append(entry)
    return entries


def _parse_single_entry(header: str, block_body: str, default_slug: str) -> Entry | None:
    m = HEADER_RE.match(header)
    if not m:
        return None
    tag, num, title = m.groups()
    entry_id = f"CONSTR-{tag}-{num}"

    lines = block_body.strip("\n").split("\n") if block_body.strip("\n") else []

    idx = 0
    fields: dict[str, str] = {}
    while idx < len(lines) and lines[idx].strip():
        fm = FIELD_LINE_RE.match(lines[idx])
        if not fm:
            break
        fields[fm.group(1)] = fm.group(2).strip()
        idx += 1
    while idx < len(lines) and not lines[idx].strip():
        idx += 1
    rest = "\n".join(lines[idx:])

    confidence = fields.get("Confidence", "CONFIRMED").strip().upper()
    category = normalize_category(fields.get("Category", default_slug)) or default_slug
    affects = _coerce_token_list(fields.get("Affects", ""))
    enforced_by = _coerce_token_list(fields.get("Enforced-by", ""))

    if confidence == "CONFLICTING":
        claims = _parse_claims_body(rest)
        return Entry(
            id=entry_id, title=title, confidence="CONFLICTING", category=category,
            affects=affects, enforced_by=enforced_by, evidence=[], statement="",
            impact="", claims=claims,
        )

    evidence_groups = _parse_evidence_line(fields.get("Evidence", ""))
    statement, impact, evidence_notes = _parse_confirmed_body(rest)
    for i, ev in enumerate(evidence_groups):
        ev["note"] = evidence_notes[i] if i < len(evidence_notes) else ""

    return Entry(
        id=entry_id, title=title, confidence="CONFIRMED", category=category,
        affects=affects, enforced_by=enforced_by, evidence=evidence_groups,
        statement=statement, impact=impact, claims=[],
    )


def _parse_evidence_line(line: str) -> list[EvidenceItem]:
    line = re.sub(r"\s*\(\d+\s*refs?\)\s*$", "", line).strip()
    if not line:
        return []
    groups = [g.strip() for g in line.split(",") if g.strip()]
    result: list[EvidenceItem] = []
    for g in groups:
        file_part, location = parse_citation(g)
        result.append(EvidenceItem(file=file_part, location=location, note=""))
    return result


def _parse_confirmed_body(rest: str) -> tuple[str, str, list[str]]:
    paragraphs = [p for p in re.split(r"\n\s*\n", rest.strip("\n")) if p.strip()]
    statement = ""
    impact = ""
    notes: list[str] = []
    for p in paragraphs:
        stripped = p.strip()
        one_line = " ".join(line.strip() for line in stripped.splitlines())
        if one_line.startswith("**Why it matters:**"):
            impact = one_line[len("**Why it matters:**"):].strip()
        elif stripped.startswith("**Evidence notes:**"):
            for line in stripped.splitlines()[1:]:
                nm = EVIDENCE_NOTE_LINE_RE.match(line.strip())
                if nm:
                    notes.append(nm.group(2).strip())
        elif not statement:
            statement = one_line
    return statement, impact, notes


def _parse_claims_body(rest: str) -> list[Claim]:
    paragraphs = [p for p in re.split(r"\n\s*\n", rest.strip("\n")) if p.strip()]
    claims: list[Claim] = []
    for p in paragraphs:
        lines = [line.strip() for line in p.strip().splitlines() if line.strip()]
        if not lines:
            continue
        cm = CLAIM_HEADER_RE.match(lines[0])
        if not cm:
            continue
        letter, statement = cm.groups()
        file_part, location = "", ""
        if len(lines) > 1:
            citation_m = CLAIM_CITATION_RE.match(lines[1])
            if citation_m:
                file_part, location = parse_citation(citation_m.group(1))
        claims.append(Claim(letter=letter, statement=statement, file=file_part, location=location))
    return claims


# ---------------------------------------------------------------------------
# Merging findings on top of the parsed state
# ---------------------------------------------------------------------------

def _dedupe_evidence(evidence: list[EvidenceItem]) -> list[EvidenceItem]:
    seen: set[tuple[str, str]] = set()
    result: list[EvidenceItem] = []
    for item in evidence:
        key = (item["file"], item.get("location", ""))
        if key not in seen:
            seen.add(key)
            result.append(item)
    return result


def merge_findings(categories: dict[str, dict[str, Entry]], valid_findings: list[dict], target_path: Path) -> None:
    # Index existing entries by (category, normalized title) for matching,
    # and track every ID in use per category so new entries never collide.
    by_title: dict[tuple[str, str], Entry] = {}
    ids_by_category: dict[str, set[str]] = {slug: set() for slug, _ in CATEGORY_ORDER}
    for slug, entries in categories.items():
        for entry in entries.values():
            by_title[(slug, normalize_title(entry["title"]))] = entry
            ids_by_category[slug].add(entry["id"])

    for finding in valid_findings:
        slug = finding["category"]
        key = (slug, normalize_title(finding["title"]))
        existing = by_title.get(key)

        if finding["confidence"] == "CONFLICTING":
            claims = [
                Claim(
                    letter=chr(ord("A") + i),
                    statement=c.get("statement", ""),
                    file=relativize_path(c.get("file", ""), target_path),
                    location=c.get("location", ""),
                )
                for i, c in enumerate(finding["claims"])
            ]
            if existing is None:
                entry_id = next_id(ids_by_category[slug], slug)
                ids_by_category[slug].add(entry_id)
                entry = Entry(
                    id=entry_id, title=finding["title"], confidence="CONFLICTING",
                    category=slug, affects=finding["affects"], enforced_by=finding["enforced_by"],
                    evidence=[], statement="", impact="", claims=claims,
                )
                categories[slug][entry_id] = entry
                by_title[key] = entry
            else:
                existing["confidence"] = "CONFLICTING"
                existing["claims"] = claims
            continue

        new_evidence = [
            EvidenceItem(
                file=relativize_path(e["file"], target_path),
                location=e.get("location", ""),
                note=e.get("note", "")
            )
            for e in finding["evidence"]
        ]

        if existing is None:
            entry_id = next_id(ids_by_category[slug], slug)
            ids_by_category[slug].add(entry_id)
            entry = Entry(
                id=entry_id, title=finding["title"], confidence="CONFIRMED", category=slug,
                affects=finding["affects"], enforced_by=finding["enforced_by"],
                evidence=_dedupe_evidence(new_evidence), statement=finding["statement"],
                impact=finding["impact"], claims=[],
            )
            categories[slug][entry_id] = entry
            by_title[key] = entry
            continue

        # Corroboration: same title/category seen again. Merge evidence
        # (deduped), grow the ref count. Never let a hand-edited statement
        # or impact be silently clobbered by a re-scan.
        if existing["confidence"] != "CONFLICTING":
            existing["evidence"] = _dedupe_evidence(existing["evidence"] + new_evidence)
            if not existing["enforced_by"]:
                existing["enforced_by"] = finding["enforced_by"]
            if not existing["affects"]:
                existing["affects"] = finding["affects"]


# ---------------------------------------------------------------------------
# Rendering back to markdown
# ---------------------------------------------------------------------------

def render(categories: dict[str, dict[str, Entry]], date: str) -> str:
    lines: list[str] = ["# Constraints", ""]
    lines.append(
        "> Externally-imposed boundaries that shape what this project can "
        "build and how. This file is distinct from `openspec/config.yaml` "
        "(chosen stack and patterns), `AGENTS.md` (agent behavior), and "
        "`ARCHITECTURE.md` (current system structure): it records *why* "
        "certain choices in those documents are non-negotiable, when an "
        "external forcing function exists."
    )
    lines.append(">")
    lines.append(
        "> Maintained by the `constraints-extractor` skill. Hand-edits to "
        "any entry are preserved on the next run. Each entry's "
        "`CONSTR-<CATEGORY>-<NNN>` ID is its stable identifier: it is "
        "assigned once and never changes on retitle, and any cross-reference "
        "to this entry (from `AGENTS.md`, from another entry's Enforced-by, "
        "from anywhere) should point to the ID, never to the title text."
    )
    lines.append(">")
    lines.append(
        "> Confidence is one of two states: `CONFIRMED` (backed by at least "
        "one citation; the ref count in the Evidence line reflects how many "
        "independent sources agree) or `CONFLICTING` (two or more sources "
        "disagree and it needs human resolution)."
    )
    lines.append("")
    lines.append(f"Date of last update: {date}")
    lines.append("")

    for slug, heading in CATEGORY_ORDER:
        lines.append(f"## {heading}")
        lines.append("")
        entries = sorted(categories[slug].values(), key=lambda e: e["id"])
        if not entries:
            lines.append(EMPTY_MARKER)
            lines.append("")
            continue
        for entry in entries:
            lines.extend(_render_entry(entry))
            lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def _render_entry(entry: Entry) -> list[str]:
    out = [f"### {entry['id']} {MIDDLE_DOT} {entry['title']}", ""]
    out.append(f"Confidence: {entry['confidence']}")
    out.append(f"Category: {entry['category']}")

    if entry["confidence"] == "CONFLICTING":
        out.append(f"Claims: {len(entry['claims'])}")
        out.append("")
        for claim in entry["claims"]:
            out.append(f"**Claim {claim['letter']}:** {claim['statement']}")
            out.append(f"{EM_DASH} {format_citation(claim['file'], claim['location'])}")
            out.append("")
        out.pop()
        return out

    if entry["affects"]:
        out.append(f"Affects: {', '.join(entry['affects'])}")
    if entry["enforced_by"]:
        out.append(f"Enforced-by: {', '.join(entry['enforced_by'])}")

    evidence_str = ", ".join(format_citation(e["file"], e["location"]) for e in entry["evidence"])
    count = len(entry["evidence"])
    out.append(f"Evidence: {evidence_str} ({count} ref{'s' if count != 1 else ''})")
    out.append("")
    out.append(entry["statement"])
    out.append("")
    out.append(f"**Why it matters:** {entry['impact']}")
    out.append("")
    out.append("**Evidence notes:**")
    for e in entry["evidence"]:
        note = e.get("note") or "<!-- TODO: describe what this citation shows -->"
        out.append(f"- {format_citation(e['file'], e['location'])} -- {note}")

    return out


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", required=True, type=Path)
    parser.add_argument("--findings", required=True, type=Path)
    parser.add_argument(
        "--date",
        default=None,
        help="Override the 'Date of last update' stamp (defaults to leaving "
        "any existing value; use YYYY-MM-DD to set explicitly).",
    )
    args = parser.parse_args()

    if not args.findings.is_absolute():
        print(
            f"error: --findings must be an absolute path, got {args.findings}. "
            "Relative paths resolve against the repo being scanned, not /tmp.",
            file=sys.stderr,
        )
        return 1

    if not args.findings.exists():
        print(f"error: findings file not found: {args.findings}", file=sys.stderr)
        return 1

    try:
        findings = json.loads(args.findings.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"error: {args.findings} is not valid JSON: {exc}", file=sys.stderr)
        return 1

    if not isinstance(findings, dict) or "constraints" not in findings:
        got = list(findings.keys()) if isinstance(findings, dict) else type(findings).__name__
        print(
            "error: findings JSON has no top-level 'constraints' key -- got "
            f"{got}. Expected "
            '{"constraints": [...], "near_misses": [...]}, with each '
            "constraint carrying its own 'category' field (a flat list, "
            "not grouped by category). See references/troubleshooting.md.\n\n"
            "This is a document-level structural problem, not a per-entry "
            "one -- there's nothing to salvage, so nothing was written.",
            file=sys.stderr,
        )
        return 1

    shape_notes = normalize_finding_shapes(findings)

    valid_findings: list[dict] = []
    skipped: list[tuple[str, list[str]]] = []
    category_notes: list[str] = []

    for i, finding in enumerate(findings.get("constraints", [])):
        label = (
            finding.get("title") if isinstance(finding, dict) and finding.get("title") else None
        ) or f"constraints[{i}] (untitled)"
        problems = validate_finding(finding)

        if isinstance(finding, dict):
            raw_category = finding.get("category", "")
            resolved_category = normalize_category(raw_category)
            if resolved_category is None:
                valid_slugs = ", ".join(slug for slug, _ in CATEGORY_ORDER)
                problems.append(f"category {raw_category!r} not recognized (valid: {valid_slugs})")
            else:
                if resolved_category != raw_category:
                    category_notes.append(f'"{label}": category {raw_category!r} -> {resolved_category!r}')
                finding["category"] = resolved_category

        if problems:
            skipped.append((label, problems))
        else:
            valid_findings.append(finding)

    if args.target.exists():
        existing_text = args.target.read_text(encoding="utf-8")
        date_match = re.search(r"^Date of last update:\s*(.+?)\s*$", existing_text, re.MULTILINE)
        current_date = date_match.group(1) if date_match else "<!-- TODO: fill in -->"
    else:
        existing_text = TEMPLATE_RELATIVE_PATH.read_text(encoding="utf-8")
        current_date = "<!-- TODO: fill in -->"

    categories = parse_existing(existing_text)
    merge_findings(categories, valid_findings, args.target)

    date = args.date or current_date
    output = render(categories, date)

    args.target.parent.mkdir(parents=True, exist_ok=True)
    args.target.write_text(output, encoding="utf-8")

    total_entries = sum(len(v) for v in categories.values())
    near_miss_count = sum(
        1 for nm in findings.get("near_misses", []) if isinstance(nm, dict) and nm.get("title")
    )

    print(f"Wrote {args.target} -- {total_entries} constraints.")
    if skipped:
        print(f"Skipped {len(skipped)} finding(s) that failed validation (not written):")
        for label, problems in skipped:
            print(f"  {label}:")
            for p in problems:
                print(f"    - {p}")
        print("Fix these in the source and re-run to add them -- everything else was written.")
    if shape_notes:
        print("Auto-corrected field names/shapes (fix the source for next time):")
        for note in shape_notes:
            print(f"  {note}")
    if category_notes:
        print("Auto-corrected category names (fix the source for next time):")
        for note in category_notes:
            print(f"  {note}")
    if near_miss_count:
        print(
            f"{near_miss_count} near-miss(es) in the findings file were NOT "
            "written to CONSTRAINTS.md -- surface these in the preview "
            "conversation only."
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
