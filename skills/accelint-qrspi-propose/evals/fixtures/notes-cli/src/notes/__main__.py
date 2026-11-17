import argparse

from . import store
from .export import export_notes


def main(argv=None):
    p = argparse.ArgumentParser(prog="notes")
    sub = p.add_subparsers(dest="cmd", required=True)
    add = sub.add_parser("add")
    add.add_argument("text")
    sub.add_parser("list")
    ex = sub.add_parser("export")
    ex.add_argument("--format", choices=["md", "json"], default="md")
    ex.add_argument("--out", required=True)
    args = p.parse_args(argv)

    notes = store.load()
    if args.cmd == "add":
        notes.append({"text": args.text})
        store.save(notes)
    elif args.cmd == "list":
        for n in notes:
            print(n["text"])
    elif args.cmd == "export":
        export_notes(notes, args.format, args.out)


if __name__ == "__main__":
    main()
