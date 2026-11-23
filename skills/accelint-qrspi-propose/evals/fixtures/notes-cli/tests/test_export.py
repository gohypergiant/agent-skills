from notes.export import export_notes


def test_export_md(tmp_path):
    out = tmp_path / "n.md"
    export_notes([{"text": "a"}], "md", out)
    assert out.read_text() == "- a"
