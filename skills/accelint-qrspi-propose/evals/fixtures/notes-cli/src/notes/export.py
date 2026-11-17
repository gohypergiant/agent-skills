import json
from pathlib import Path


def export_notes(notes, fmt, out):
    """Write notes to `out` in the given format. Always overwrites `out`."""
    if fmt == "json":
        body = json.dumps(notes, indent=2)
    elif fmt == "md":
        body = "\n".join(f"- {n['text']}" for n in notes)
    else:
        raise ValueError(f"unknown format: {fmt}")
    Path(out).write_text(body)
    return out
