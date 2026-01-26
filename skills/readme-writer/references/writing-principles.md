# Writing Principles

Guidelines for creating thorough, human-sounding documentation.

**REQUIRED SUB-SKILL:** Use `humanizer` to review generated content for AI writing patterns.

This document covers README-specific writing principles. The `humanizer` skill provides comprehensive patterns for removing AI-generated text artifacts. Use both together.

---

## 1. Be Absurdly Thorough

When in doubt, include it. More detail is always better for documentation.

**❌ Incorrect: assumes too much knowledge**
```markdown
## Installation

Install the package and configure it.
```

**✅ Correct: explains everything**
```markdown
## Installation

Install the package using your preferred package manager:

```bash
pnpm add @acme/toolkit
```

If you're using TypeScript, you're all set — types are included. For JavaScript projects, the package works with both CommonJS and ESM.
```

---

## 2. Use Code Blocks Liberally

Every command should be copy-pasteable. Don't describe commands in prose when you can show them.

**❌ Incorrect: describes instead of shows**
```markdown
Run the build script using pnpm to compile the TypeScript files.
```

**✅ Correct: shows the actual command**
```markdown
Build the project:

```bash
pnpm build
```

This compiles TypeScript to JavaScript in the `dist/` directory.
```

---

## 3. Show Example Output

When helpful, show what the user should expect to see. This confirms they're on the right track.

**❌ Incorrect: no indication of success**
```markdown
```bash
pnpm test
```
```

**✅ Correct: shows expected output**
```markdown
```bash
pnpm test
```

You should see output like:

```
 ✓ src/parser.test.ts (12 tests) 45ms
 ✓ src/validator.test.ts (8 tests) 23ms

 Test Files  2 passed (2)
      Tests  20 passed (20)
```
```

---

## 4. Explain the Why

Don't just say "run this command" — explain what it does and why someone would need it.

**❌ Incorrect: what without why**
```markdown
Set the `DEBUG` environment variable:

```bash
export DEBUG=true
```
```

**✅ Correct: includes motivation**
```markdown
For verbose logging during development, enable debug mode:

```bash
export DEBUG=true
```

This prints detailed information about each step, which is helpful when tracking down issues but too noisy for production.
```

---

## 5. Assume Fresh Machine

Write as if the reader has never seen this codebase. Don't assume they know your conventions.

**❌ Incorrect: assumes familiarity**
```markdown
After cloning, run the usual setup commands.
```

**✅ Correct: spells it out**
```markdown
After cloning the repository:

```bash
git clone https://github.com/acme/toolkit.git
cd toolkit
pnpm install
```

This installs all dependencies. The first install may take a few minutes.
```

---

## 6. Use Tables for Reference

Environment variables, CLI options, configuration options, and script references work great as tables.

**❌ Incorrect: hard to scan**
```markdown
The `format` option can be "json" or "yaml". The `output` option specifies where to write results. The `verbose` option enables detailed logging.
```

**✅ Correct: scannable table**
```markdown
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | `"json" \| "yaml"` | `"json"` | Output format |
| `output` | `string` | `"./out"` | Output directory |
| `verbose` | `boolean` | `false` | Enable detailed logging |
```

---

## 7. Keep Commands Current

Detect the actual package manager and use it consistently. Never assume npm.

**❌ Incorrect: wrong package manager**
```markdown
# Project uses pnpm (has pnpm-lock.yaml)

npm install
npm run build
```

**✅ Correct: matches project tooling**
```markdown
# Project uses pnpm (has pnpm-lock.yaml)

pnpm install
pnpm build
```

### Package Manager Detection

Check for lockfiles in this order:

1. `pnpm-lock.yaml` → use `pnpm`
2. `yarn.lock` → use `yarn`
3. `bun.lockb` → use `bun`
4. `package-lock.json` → use `npm`

---

## 8. Write Like a Human

Sound like someone who genuinely wants to help, not a robot generating documentation.

**❌ Incorrect: robotic**
```markdown
The function accepts a configuration object parameter. The configuration object must contain the required fields. An error will be thrown if required fields are missing.
```

**✅ Correct: conversational**
```markdown
Pass in a config object with your settings. At minimum, you need `apiKey` and `endpoint` — the function will let you know if anything's missing.
```

### Avoid These Patterns

- **Overly formal**: "It should be noted that..." → "Note that..."
- **Passive voice**: "The file is read by the parser" → "The parser reads the file"
- **Unnecessary hedging**: "This may potentially help" → "This helps"
- **Corporate speak**: "Leverage the functionality" → "Use"
- **Filler phrases**: "In order to" → "To"

### Aim For

- Direct, active voice
- Second person ("you") when addressing the reader
- Contractions where natural (it's, you'll, don't)
- Concrete examples over abstract descriptions
- Personality without being unprofessional

---

## 9. Include a Table of Contents

For READMEs over ~200 lines, add a TOC at the top after the heading area.

**✅ Good TOC format**
```markdown
## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [createClient](#createclient)
  - [parseConfig](#parseconfig)
- [Examples](#examples)
- [License](#license)
```

Keep TOC entries to 2 levels deep maximum. Deeper nesting makes the TOC harder to scan than the document itself.

---

## 10. Remove AI Writing Patterns

After drafting content, apply the `humanizer` skill to catch patterns this guide doesn't cover. Key patterns to watch for in README context:

### Significance Inflation

**❌ AI pattern:**
```markdown
This package serves as a pivotal tool in the JavaScript ecosystem, marking a crucial advancement in configuration management.
```

**✅ Human version:**
```markdown
This package parses config files. It supports JSON, YAML, and TOML.
```

### Promotional Language

**❌ AI pattern:**
```markdown
Nestled within the Node.js ecosystem, this groundbreaking library offers seamless, intuitive, and powerful configuration management.
```

**✅ Human version:**
```markdown
A config parser for Node.js projects.
```

### Superficial -ing Phrases

**❌ AI pattern:**
```markdown
The validate function checks your config, ensuring compliance with your schema while highlighting any issues.
```

**✅ Human version:**
```markdown
The validate function checks your config against a schema and returns any errors.
```

### Vague Attributions

**❌ AI pattern:**
```markdown
Industry experts agree this approach improves developer productivity.
```

**✅ Human version:**
```markdown
In our benchmarks, this reduced config load time by 40%.
```

(Or just remove the claim entirely if you don't have specific data.)

### Rule of Three

**❌ AI pattern:**
```markdown
The package is fast, flexible, and fully featured.
```

**✅ Human version:**
```markdown
The package is fast. See benchmarks below.
```

### Generic Conclusions

**❌ AI pattern:**
```markdown
The future looks bright for this project as we continue our journey toward excellence.
```

**✅ Human version:**
```markdown
See the roadmap in CONTRIBUTING.md for planned features.
```

---

## 11. Add Personality (Not Just Remove Patterns)

Avoiding AI patterns is only half the job. Sterile, voiceless writing is just as obvious.

### Signs of soulless writing:
- Every sentence is the same length
- No opinions, just neutral reporting
- No first-person perspective when appropriate
- Reads like a press release

### How to add voice:

**Have opinions when relevant:**
```markdown
# ❌ Sterile
The library provides configuration parsing functionality.

# ✅ Has a pulse
Config files are a pain. This library makes them less painful.
```

**Acknowledge tradeoffs:**
```markdown
# ❌ Too neutral
The library supports multiple formats.

# ✅ Honest
We support JSON, YAML, and TOML. We don't support INI because frankly it's a mess to parse reliably.
```

**Use "you" and "we" naturally:**
```markdown
# ❌ Distant
The user should run the install command.

# ✅ Direct
Run the install command.
```

**Vary rhythm:**
```markdown
# ❌ Monotonous
This function parses configs. It returns an object. It throws on invalid input.

# ✅ Varied
Parse a config file. You get back a typed object, or an error if something's wrong.
```
