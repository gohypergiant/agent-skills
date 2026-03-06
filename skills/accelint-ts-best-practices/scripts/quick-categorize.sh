#!/usr/bin/env bash
# Quick lookup for categorizing best practice violations
# Usage:
#   echo "issue description" | ./scripts/quick-categorize.sh
#   ./scripts/quick-categorize.sh "issue description"
#
# Returns category, severity, and reference files for the issue

set -euo pipefail

# Read input from pipe or argument
if [[ $# -eq 0 ]]; then
  read -r issue
else
  issue="$*"
fi

# Convert to lowercase for case-insensitive matching
issue_lower=$(echo "$issue" | tr '[:upper:]' '[:lower:]')

# Category lookup based on keywords
case "$issue_lower" in
  *"any"*|*"unknown"*|*"generic"*)
    category="Type Safety"
    severity="Critical"
    gain="Enables type safety and refactoring confidence"
    references="any.md"
    ;;
  *"enum"*)
    category="Type Safety"
    severity="High"
    gain="Eliminates runtime overhead, use 'as const' instead"
    references="enums.md"
    ;;
  *"interface"*|*"type"*)
    category="Type Safety"
    severity="Medium"
    gain="Consistency and simpler type composition"
    references="type-vs-interface.md"
    ;;
  *"null"*|*"undefined"*|*"zero value"*)
    category="Return Values"
    severity="High"
    gain="Eliminates defensive null checks throughout codebase"
    references="return-values.md"
    ;;
  *"unbounded"*|*"while true"*|*"infinite loop"*)
    category="Safety"
    severity="Critical"
    gain="Prevents runaway resource consumption"
    references="bounded-iteration.md"
    ;;
  *"input validation"*|*"validate"*|*"sanitize"*)
    category="Safety"
    severity="High"
    gain="Prevents injection attacks and runtime errors"
    references="input-validation.md"
    ;;
  *"error"*|*"exception"*|*"throw"*|*"try catch"*)
    category="Safety"
    severity="Medium"
    gain="Improves error handling and debuggability"
    references="error-handling.md, error-messages.md"
    ;;
  *"assertion"*|*"assert"*)
    category="Safety"
    severity="Medium"
    gain="Catches programmer errors early in development"
    references="assertions.md"
    ;;
  *"mutate"*|*"mutation"*|*"parameter"*|*"side effect"*)
    category="State Management"
    severity="High"
    gain="Prevents hidden side effects and maintains pure functions"
    references="state-management.md"
    ;;
  *"const"*|*"let"*|*"immutab"*)
    category="State Management"
    severity="Low"
    gain="Signals immutability and reduces cognitive load"
    references="state-management.md"
    ;;
  *"boolean"*|*"is"*|*"has"*|*"prefix"*)
    category="Code Quality"
    severity="Low"
    gain="Improves type clarity and readability"
    references="naming-conventions.md"
    ;;
  *"naming"*|*"name"*|*"qualifier"*)
    category="Code Quality"
    severity="Low"
    gain="Enables efficient autocomplete and code discovery"
    references="naming-conventions.md"
    ;;
  *"function"*|*"parameter"*|*"return type"*)
    category="Code Quality"
    severity="Medium"
    gain="Improves maintainability and type safety"
    references="functions.md"
    ;;
  *"control flow"*|*"if"*|*"brace"*|*"block"*)
    category="Code Quality"
    severity="Medium"
    gain="Prevents silent bugs when adding statements"
    references="control-flow.md"
    ;;
  *"magic number"*|*"constant"*|*"literal"*)
    category="Code Quality"
    severity="Low"
    gain="Improves maintainability and self-documentation"
    references="misc.md"
    ;;
  *"duplicate"*|*"duplication"*|*"dry"*)
    category="Code Quality"
    severity="Medium"
    gain="Reduces maintenance burden and bug surface"
    references="code-duplication.md"
    ;;
  *)
    category="Unknown"
    severity="Medium"
    gain="Review pattern for specific impact"
    references="See AGENTS.md for rule overview"
    ;;
esac

# Output results
cat <<EOF
Category: $category
Severity: $severity
Expected Gain: $gain
References: $references
EOF
