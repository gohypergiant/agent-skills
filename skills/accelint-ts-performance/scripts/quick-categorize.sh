#!/usr/bin/env bash
# quick-categorize.sh - Quick lookup for performance issue categorization
# Usage: echo "issue description" | quick-categorize.sh
# or: quick-categorize.sh "issue description"
# Output: Category, expected gain, and reference files

set -euo pipefail

QUERY="${1:-$(cat)}"
QUERY_LOWER=$(echo "$QUERY" | tr '[:upper:]' '[:lower:]')

# Pattern matching database
# Format: pattern|category|gain|references

PATTERNS=(
  "nested.*loop|Algorithmic|10-1000x|reduce-looping.md, reduce-branching.md"
  "o\(n.*2\)|Algorithmic|10-1000x|reduce-looping.md, reduce-branching.md"
  "filter.*map|Algorithmic|2-10x|reduce-looping.md"
  "array.*chain|Algorithmic|2-10x|reduce-looping.md"
  "\.includes|Algorithmic|10-100x|reduce-looping.md"
  "\.find.*loop|Algorithmic|10-100x|reduce-looping.md"
  "linear search|Algorithmic|10-100x|reduce-looping.md"
  "set\.has|Algorithmic|10-100x|reduce-looping.md"
  "repeated.*computation|Caching|2-100x|memoization.md"
  "same.*calculation|Caching|2-100x|memoization.md"
  "loop.*invariant|Caching|2-100x|memoization.md"
  "property.*access|Caching|1.2-2x|cache-property-access.md"
  "memoiz|Caching|2-100x|memoization.md"
  "cache|Caching|2-100x|memoization.md, cache-property-access.md"
  "localstorage|Caching|5-20x|cache-storage-api.md"
  "sessionstorage|Caching|5-20x|cache-storage-api.md"
  "storage api|Caching|5-20x|cache-storage-api.md"
  "sequential.*await|I/O|2-10x|defer-await.md, batching.md"
  "await.*await|I/O|2-10x|defer-await.md, batching.md"
  "blocking.*async|I/O|2-10x|defer-await.md"
  "parallel|I/O|2-10x|defer-await.md, batching.md"
  "batch|I/O|2-50x|batching.md"
  "allocation|Memory|1.5-5x|avoid-allocations.md, object-operations.md"
  "spread.*loop|Memory|1.5-5x|avoid-allocations.md, object-operations.md"
  "object.*spread|Memory|1.5-5x|object-operations.md"
  "\.\.\..*loop|Memory|1.5-5x|avoid-allocations.md"
  "gc pressure|Memory|1.5-5x|avoid-allocations.md"
  "garbage collection|Memory|1.5-5x|avoid-allocations.md"
  "template literal|Memory|1.5-2x|avoid-allocations.md"
  "memory.*locality|Memory Locality|1.5-3x|predictable-execution.md"
  "cache miss|Memory Locality|1.5-3x|predictable-execution.md"
  "sequential.*access|Memory Locality|1.5-3x|predictable-execution.md"
  "unbounded|Safety|Prevents DoS|bounded-iteration.md"
  "while.*true|Safety|Prevents DoS|bounded-iteration.md"
  "runaway|Safety|Prevents DoS|bounded-iteration.md"
  "dos|Safety|Prevents DoS|bounded-iteration.md"
  "try.*catch|Micro-optimization|3-5x|performance-misc.md"
  "curry|Micro-optimization|1.1-1.5x|currying.md"
  "inline|Micro-optimization|1.05-2x|performance-misc.md"
  "hot path|Micro-optimization|1.05-2x|currying.md, performance-misc.md"
)

# Try to match patterns
FOUND=false
for pattern_line in "${PATTERNS[@]}"; do
  IFS='|' read -r pattern category gain refs <<< "$pattern_line"

  if echo "$QUERY_LOWER" | grep -qiE "$pattern"; then
    echo "Category: $category"
    echo "Expected Gain: $gain"
    echo "References: $refs"
    FOUND=true
    break
  fi
done

if [[ "$FOUND" == "false" ]]; then
  echo "No specific match found. General guidance:"
  echo ""
  echo "Priority order:"
  echo "1. Algorithmic (O(n²) → O(n)): 10-1000x → reduce-looping.md, reduce-branching.md"
  echo "2. Caching: 2-100x → memoization.md, cache-property-access.md"
  echo "3. I/O: 2-50x → defer-await.md, batching.md"
  echo "4. Memory: 1.5-5x → avoid-allocations.md, object-operations.md"
  echo "5. Micro-optimization: 1.05-2x → currying.md, performance-misc.md"
  echo ""
  echo "Use detect-anti-patterns.sh for automated detection."
  exit 1
fi
