#!/usr/bin/env bash
# Usage: setup.sh <empty-target-dir>
# Copies the notes-cli fixture, makes it a git repo, and initializes OpenSpec.
set -euo pipefail
target="${1:?usage: setup.sh <empty-target-dir>}"
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$target"
cp -R "$here/notes-cli/." "$target/"
cd "$target"
git init -q
openspec init --tools none . >/dev/null
git add -A
git -c user.name=eval -c user.email=eval@example.com commit -qm "fixture"
echo "$target"
