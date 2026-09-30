# Agent Skills

A repository of reusable agent skills and the docs site that publishes them.

The source of truth lives in `skills/`. The published documentation lives in `docs/content/docs/`. Local harness integrations read the same skills through symlinks in `.agents/skills/`.

## Quick Start

### For your project

Skills follow the [Agent Skills](https://agentskills.io/) format and can be installed using the skills CLI.

**npm:**
```bash
npx skills add gohypergiant/agent-skills
```

**pnpm:**
```bash
pnpm dlx skills add gohypergiant/agent-skills
```

- Only select skills that are relevant for your project
- We recommend "Project" for the installation scope
- We recommend "Symlink" for the installation method

### Browse the published docs locally

The documentation app lives in `docs/` and uses pnpm.

```bash
cd docs
pnpm install
pnpm dev
```

Then open http://localhost:3000.

### Rebuild local skill symlinks

```bash
bash scripts/symlink-agent-skills.sh
```

Run this after adding a new directory under `skills/`, or any time `.agents/skills/` has gone stale.

## What is this repository?

This repo is for creating, maintaining, and publishing agent skills.

Each skill is a directory under `skills/` with its own `SKILL.md` and, in most cases, companion files such as `CHANGELOG.md`, `AGENTS.md`, `README.md`, references, scripts, or assets. The `docs/` app turns that material into a browsable Fumadocs site.

If you want the user-facing introduction to skills, start with the docs site content instead of this root README:

- `docs/content/docs/index.mdx`
- `docs/content/docs/getting-started.mdx`

## Why this repo exists

Skills are easier to maintain when the source files, local harness wiring, and published docs stay close together.

This layout gives you a few practical benefits:

- edit canonical skill content in `skills/`
- expose those same directories to local agent harnesses through `.agents/skills/`
- publish matching documentation from `docs/content/docs/`
- keep repo-specific authoring rules in one place with `AGENTS.md`

If you're here to add or revise a skill, this repo is the working area. If you're here to learn how to use a skill, the docs app is the better entry point.

## Repository Layout

```text
agent-skills/
├── skills/                      # Source of truth for maintained skills
├── .agents/skills/              # Symlinks pointing back to skills/
├── docs/                        # Next.js + Fumadocs documentation app
│   ├── content/docs/            # Published docs content
│   └── package.json             # Docs scripts and dependencies
├── scripts/
│   └── symlink-agent-skills.sh  # Rebuild .agents/skills symlinks
├── AGENTS.md                    # Repo rules for skill authors and agents
├── CLAUDE.md                    # Additional agent-facing context
├── CONTRIBUTING.md
└── README.md
```

## Internal Skills

This repository leverages the following third party agent skills internally:

- [humanizer](https://skills.sh/softaworks/agent-toolkit/humanizer)
- [ask-questions-if-underspecified](https://skills.sh/trailofbits/skills/ask-questions-if-underspecified)
- [skill-judge](https://skills.sh/softaworks/agent-toolkit/skill-judge)
- [bash-defensive-patterns](https://skills.sh/wshobson/agents/bash-defensive-patterns)

We recommend installing these globally using skills.sh since they are applicable to multiple projects.

## Skill Development Workflow

To scaffold and establish a new skill you can invoke the `accelint-skill-manager` skill like so:

```
/accelint-skill-manager <description of skill>. Can you help me refine and complete it?
```

After creating or significantly modifying a skill, run this 4-step audit loop before considering the work done.

### Step 1 — Initial skill-judge audit

Run the `skill-judge` skill against the completed skill. Apply all suggested improvements before proceeding.

### Step 2 — accelint-skill-manager audit

Run `/clear` to reset context, then run the `accelint-skill-manager` skill against the skill. Apply all structural and content suggestions before proceeding.

### Step 3 — Final skill-judge audit

Run `/clear`, then run `skill-judge` again. Apply remaining suggestions. Target **grade A or higher (>=108/120)**.

### Step 4 — Frontmatter verification checklist

- [ ] `name` is lowercase, no uppercase letters, no consecutive hyphens, ≤64 chars, matches directory name
- [ ] `description` answers WHAT + WHEN + KEYWORDS, is non-empty, ≤1024 chars
- [ ] `metadata.version` is bumped (major for substantial changes, minor for small fixes)

### Optional: Step 5 — Exhaustive skill-creator optimization

**⚠️ High-cost, high-rigor step. Use for production-critical skills only.**


Run `/clear`, then run `/skill-creator "Optimize [skill-name]. Run full test suite with benchmarks and iterate until grade A."`. Follow the skill-creator workflow to review outputs, provide feedback, and approve iterations.

## API

This repository is content-first rather than library-first, so the public surface is the directory structure and the scripts you work with.

### Skill directories in `skills/`

These are the maintained skills currently in the repo:

- `accelint-ac-to-playwright`
- `accelint-architecture-doc`
- `accelint-archive-synthesis`
- `accelint-design-foundation`
- `accelint-nextjs-best-practices`
- `accelint-onboard-agents`
- `accelint-onboard-openspec`
- `accelint-persona-review`
- `accelint-prompt-manager`
- `accelint-qrspi-apply`
- `accelint-qrspi-archive`
- `accelint-qrspi-propose`
- `accelint-react-best-practices`
- `accelint-react-testing`
- `accelint-readme-writer`
- `accelint-security-best-practices`
- `accelint-skill-manager`
- `accelint-tanstack-query-best-practices`
- `accelint-ts-audit-all`
- `accelint-ts-best-practices`
- `accelint-ts-documentation`
- `accelint-ts-performance`
- `accelint-ts-testing`

**Current count:** 23 skill directories under `skills/`.

### `scripts/symlink-agent-skills.sh`

Rebuilds `.agents/skills/` so local harness discovery points at the current skill sources.

What the script does:

| Step | Behavior |
|------|----------|
| Resolve repo root | Finds the repository root from the script location |
| Ensure target dir exists | Creates `.agents/skills/` if needed |
| Iterate skills | Walks each directory under `skills/` |
| Refresh links | Creates or updates `../../skills/<skill-name>` symlinks |
| Protect conflicts | Skips existing non-symlink paths with a warning |

Expected link shape:

```text
.agents/skills/<skill-name> -> ../../skills/<skill-name>
```

### Docs app scripts in `docs/package.json`

The docs app exposes these main scripts:

| Script | Command | What it does |
|--------|---------|--------------|
| `dev` | `pnpm dev` | Starts the Next.js docs app locally |
| `build` | `pnpm build` | Builds the production docs bundle |
| `start` | `pnpm start` | Serves the production build |
| `types:check` | `pnpm run types:check` | Regenerates MDX types, runs Next typegen, and checks TypeScript |

## Examples

### Start the docs site

```bash
cd docs
pnpm install
pnpm dev
```

Use this when you want to preview changes under `docs/content/docs/` or verify that new documentation renders correctly.

### Type-check the docs app

```bash
cd docs
pnpm run types:check
```

This is the most complete verification command exposed by the docs app. It runs `fumadocs-mdx`, `next typegen`, and `tsc --noEmit`.

### Rebuild local harness symlinks

```bash
bash scripts/symlink-agent-skills.sh
```

If you added a new skill under `skills/`, this makes it visible through `.agents/skills/` without copying files around.

### Inspect a skill directory

A typical skill directory includes files like these:

```text
skills/<skill-name>/
├── SKILL.md
├── CHANGELOG.md
├── AGENTS.md
├── README.md
├── references/
├── scripts/
└── assets/
```

Not every skill uses every optional file, but `SKILL.md` is the anchor.

## Further Reading

- `docs/content/docs/index.mdx` — main docs landing page
- `docs/content/docs/getting-started.mdx` — installation and usage guidance
- `docs/content/docs/*/index.mdx` — per-skill published docs
- `skills/accelint-skill-manager/assets/skill-template/` — starting point for new skills

## License

Apache 2.0. See [LICENSE](./LICENSE).

## Architecture & Development Guides

For deeper technical and contributor context:

- [AGENTS.md](./AGENTS.md) — repo rules for creating and maintaining skills
- [CLAUDE.md](./CLAUDE.md) — additional agent-facing instructions

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contributor setup.

Most changes here fall into one of these buckets:

1. update or add a skill under `skills/`
2. update the published docs under `docs/content/docs/`
3. maintain local development tooling such as `scripts/symlink-agent-skills.sh`
