import json
from pathlib import Path

DEFAULT_PATH = Path.home() / ".notes.json"


def load(path=DEFAULT_PATH):
    if not Path(path).exists():
        return []
    return json.loads(Path(path).read_text())


def save(notes, path=DEFAULT_PATH):
    Path(path).write_text(json.dumps(notes, indent=2))
