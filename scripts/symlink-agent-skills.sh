#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"

target_dir="$repo_root/.agents/skills"

mkdir -p "$target_dir"

for skill in "$repo_root"/skills/*; do
  [ -d "$skill" ] || continue

  skill_name="$(basename "$skill")"
  link_path="$target_dir/$skill_name"
  relative_target="../../skills/$skill_name"

  if [ -L "$link_path" ]; then
    ln -sfn "$relative_target" "$link_path"
    echo "linked $skill_name -> $relative_target"
    continue
  fi

  if [ -e "$link_path" ]; then
    echo "warning: skipping $skill_name because $link_path exists and is not a symlink" >&2
    continue
  fi

  ln -s "$relative_target" "$link_path"
  echo "linked $skill_name -> $relative_target"
done
