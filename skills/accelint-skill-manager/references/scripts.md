# 1.6 Scripts

## Overview

Contains executable code that agents can run. Scripts should:
- Be self-contained or clearly document dependencies
- Include helpful error messages
- Handle edge cases gracefully

**When to include**: Use scripts when the same code is being rewritten repeatedly or deterministic reliability is needed.

**Benefits**: Scripts are token efficient, deterministic, and may be executed without loading them into context.

### Recommendations

Bash scripts are preferred. When you use bash scripts:
- Use the `#!/bin/bash` shebang
- Use `set -e` for fail-fast behavior
- Write status messages to stderr: `echo "Message" >&2`
- Write machine-readable output such as JSON to stdout
- Include a cleanup trap for temp files
- Reference the script path as `skills/{skill-name}/scripts/{script}.sh`

After creating any script, audit it with the `bash-defensive-patterns` skill and apply any necessary changes.

---

Reference: https://agentskills.io/specification#scripts%2F