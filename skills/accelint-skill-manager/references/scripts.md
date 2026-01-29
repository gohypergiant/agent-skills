# 1.6 Scripts

## Overview

Contains executable code that agents can run. Scripts should:
- Be self-contained or clearly document dependencies
- Include helpful error messages
- Handle edge cases gracefully

**When to include**: When the same code is being rewritten repeatedly or deterministic reliability is needed

**Benefits**: Token efficient, deterministic, may be executed without loading into context

### Recommendations

Bash scripts are preferred. When using bash scripts:
- Use `#!/bin/bash` shebang
- Use `set -e` for fail-fast behavior
- Write status messages to stderr: `echo "Message" >&2`
- Write machine-readable output (JSON) to stdout
- Include a cleanup trap for temp files
- Reference the script path as `skills/{skill-name}/scripts/{script}.sh`

---

Reference: https://agentskills.io/specification#scripts%2F