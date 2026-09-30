#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
source_dir="$repo_root/.agents/agents"

# Codex custom agents use TOML definitions and cannot reuse these Markdown files.
target_dirs=(
  "$repo_root/.claude/agents"
  "$repo_root/.pi/agents"
  "$repo_root/.github/agents"
)

if [ ! -d "$source_dir" ]; then
  echo "warning: source agent directory does not exist: $source_dir" >&2
  exit 0
fi

for target_dir in "${target_dirs[@]}"; do
  mkdir -p "$target_dir"
done

link_agent() {
  local target_dir="$1"
  local link_name="$2"
  local relative_target="$3"
  local link_path="$target_dir/$link_name"

  if [ -L "$link_path" ]; then
    ln -sfn "$relative_target" "$link_path"
    echo "linked $link_path -> $relative_target"
    return
  fi

  if [ -e "$link_path" ]; then
    echo "warning: skipping $link_name because $link_path exists and is not a symlink" >&2
    return
  fi

  ln -s "$relative_target" "$link_path"
  echo "linked $link_path -> $relative_target"
}

for agent in "$source_dir"/*.md; do
  [ -f "$agent" ] || continue

  agent_name="$(basename "$agent" .md)"
  relative_target="../../.agents/agents/$agent_name.md"

  link_agent "$repo_root/.claude/agents" "$agent_name.md" "$relative_target"
  link_agent "$repo_root/.pi/agents" "$agent_name.md" "$relative_target"
  link_agent "$repo_root/.github/agents" "$agent_name.agent.md" "$relative_target"
done
