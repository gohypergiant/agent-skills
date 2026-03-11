# Verification Command Patterns

Common verification command patterns for different project types. The audit-process file MUST document exact verification commands for your project.

## Node.js Projects

**Standard setup:**
```bash
cd <project-root>; npm test
cd <project-root>; npm run build
cd <project-root>; npm run lint
```

**With specific test runner:**
```bash
cd <project-root>; npm run test:unit
cd <project-root>; npm run test:integration
cd <project-root>; npm run build
```

## Bun Projects

**Standard setup:**
```bash
cd <project-root>; bun run test
cd <project-root>; bun run build
cd <project-root>; bun run lint
cd <project-root>; bun run bench  # if applicable
```

**Direct test command:**
```bash
cd <project-root>; bun test
cd <project-root>; bun run build
cd <project-root>; bun run lint
```

## Monorepo Packages

**Workspace-relative commands:**
```bash
cd <workspace-root>/packages/<package-name>; npm test
cd <workspace-root>/packages/<package-name>; npm run build
cd <workspace-root>/packages/<package-name>; npm run lint
```

**With workspace scripts:**
```bash
cd <workspace-root>; npm run test --workspace=<package-name>
cd <workspace-root>; npm run build --workspace=<package-name>
```

## TypeScript Projects with Direct Commands

**Using tsx or ts-node:**
```bash
cd <project-root>; tsx --test src/**/*.test.ts
cd <project-root>; tsc --noEmit
cd <project-root>; eslint src/
```

## Projects with Coverage Requirements

**With coverage thresholds:**
```bash
cd <project-root>; npm test -- --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
cd <project-root>; npm run build
cd <project-root>; npm run lint
```

## Important Guidelines

- **Always use EXACT commands from audit-process file** - Never improvise or run one-off commands
- **Include working directory** - Use `cd <project-root>; command` format to be explicit
- **Document all verification steps** - If project needs specific setup (env vars, database), document it
- **Don't assume standard commands** - Some projects use non-standard script names
- **Test the commands** - Verify commands work before starting audit

## Custom Project Examples

If your project uses non-standard commands, document them clearly:

```bash
# Custom test command with specific environment
cd <project-root>; NODE_ENV=test npm run test:all

# Build with specific target
cd <project-root>; npm run build:production

# Lint with auto-fix disabled
cd <project-root>; npm run lint -- --fix=false
```

Always prefer explicit, reproducible commands over shortcuts.
