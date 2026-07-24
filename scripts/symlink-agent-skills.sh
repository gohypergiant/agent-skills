#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"

target_dirs=(
  "$repo_root/.agents/skills"
  "$repo_root/.claude/skills"
)

for target_dir in "${target_dirs[@]}"; do
  mkdir -p "$target_dir"

done

for skill in "$repo_root"/skills/*; do
  [ -d "$skill" ] || continue

  skill_name="$(basename "$skill")"
  relative_target="../../skills/$skill_name"

  for target_dir in "${target_dirs[@]}"; do
    link_path="$target_dir/$skill_name"

    if [ -L "$link_path" ]; then
      ln -sfn "$relative_target" "$link_path"
      echo "linked $link_path -> $relative_target"
      continue
    fi

    if [ -e "$link_path" ]; then
      echo "warning: skipping $skill_name because $link_path exists and is not a symlink" >&2
      continue
    fi

    ln -s "$relative_target" "$link_path"
    echo "linked $link_path -> $relative_target"
  done
done
