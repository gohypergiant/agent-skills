# context-drift

Audit or repair drift across a repository's load-bearing context files: `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `CONSTRAINTS.md`, `JARGON.md`, `EPISTEMIC-MAP.md`, `README.md`, and `openspec/config.yaml`. The skill preserves detail and keeps the boundary between these files clear.

Three output modes:
- **Audit** — issue list only, no edits
- **Change-plan** — issue list plus a proposal table, no edits yet
- **Interactive apply** — proposal-by-proposal diff previews with an accept/deny/discuss gate

## Installation

Install this skill using the skills CLI:

```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill context-drift
```

```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill context-drift
```

## Usage

Usage examples:

```
Audit this repo for context drift across AGENTS.md and ARCHITECTURE.md
```

```
Walk me through context drift fixes one proposal at a time
```

```
Our README restates the whole architecture doc, is that a problem?
```

The skill works out which files are in scope and consults the owner skill for each one. It classifies every issue it finds and stops at an approval gate before it writes anything.

## How it works

### This skill is a coordinator, not the authority

`context-drift` does not decide what belongs in each file on its own. For every file in scope, it loads the matching owner skill. It uses that skill's own rules as the authority on ownership, correct pointer behavior, and how much detail a move must preserve:

| File | Owner skill |
| --- | --- |
| `AGENTS.md` / `CLAUDE.md` | `accelint-onboard-agents` |
| `openspec/config.yaml` | `accelint-onboard-openspec` |
| `ARCHITECTURE.md` | `accelint-architecture-doc` |
| `CONSTRAINTS.md` | `constraints-extractor` |
| `EPISTEMIC-MAP.md` | `epistemic-mapper` |
| `JARGON.md` | `jargon-extractor` |
| `README.md` | `accelint-readme-writer` |

If two owner skills disagree on where something belongs, `context-drift` surfaces the conflict instead of picking a side.

### Step 1: Scope and defaults

The skill never stops to ask about scope, apply mode, cleanup breadth, or missing files. It applies a stated default for each case and announces which defaults it used:

- **Apply mode**: audit and build a change plan, unless the user asked to just verify
- **Scope**: the full canonical set above, narrowed to whatever files actually exist, unless the user named specific files
- **Cleanup breadth**: lossless moves only, unless the user asked for broader cleanup
- **Missing destination files**: report that one is missing, create it only with approval

A bare invocation — the skill loading with no other task text in the turn — counts as the request. The skill starts Step 2 immediately instead of asking what to work on.

### Step 2: Read every in-scope file and consult the owner skills

The skill reads every in-scope file in full, then hands it to the owner skill for a judgment on ownership and correct detail level. The owner skill runs as a parallel subagent when subagents are available, or inline when they are not.

### Step 3: Classify each issue

The skill assigns one drift type to every finding before it proposes a fix:

| Drift type | Typical fix |
| --- | --- |
| Exact duplication | Keep one copy, point to it from the other file |
| Paraphrased duplication | Consolidate into one statement |
| Wrong-home content | Move it to the file that owns that layer |
| Conflict | Surface both versions, do not pick a side |
| Missing-home candidate | Report that the destination file does not exist yet |
| Missing pointer | Add a pointer instead of a restatement |

Two checks run before the skill calls anything a duplicate:

- **Depth check** — a short summary and the full reference it summarizes are not duplicates just because they cover the same subsystem. The skill must point to passages in both files that are informationally equivalent, not just adjacent in topic, before it classifies something as duplication. `README.md` is the file most likely to look like a duplicate of something else while it does its own job: giving a human a quick orientation.
- **Glossary check** — `JARGON.md` is expected to share subject matter with every other file, since centralizing short definitions is its entire purpose. The direction that matters is the other way: `JARGON.md` must stay terse. If a `JARGON.md` entry grows to match the depth of the file that owns that detail, the fix shortens the `JARGON.md` entry, not the other file.

### Step 4: Stop at verify, or build a change plan

If the user asked to verify only, the skill stops here with the issue list. Otherwise it converts each finding into a specific move: source location, destination location, and where the same operational detail will live afterward. A move that cannot point to a destination for the content it removes is not lossless yet. The skill will not propose a move like that.

### Step 5: Present one proposal at a time, then wait

This gate applies to every proposal regardless of mode — there is no path from a finding straight to a file edit. For each proposal, the skill shows a one-paragraph rationale, a diff preview for every file the move touches, and ends on an explicit accept/deny/discuss prompt. If no one answers in that turn, it stops there. It does not treat silence as approval.

### Step 6: Hand accepted proposals to the owner skills

The skill never edits a canonical file directly, even for a change that looks mechanical. Once a proposal is accepted, the skill invokes the owner skill for every file the proposal touches. It passes along the approved content, so the actual edit lands through the skill that owns that document's structure.

## Features

**Owner-skill authority**
- Loads the matching owner skill for every file in scope
- Treats that skill's rules as the authority on placement, pointer behavior, and lossless detail
- Surfaces disagreements between owner skills instead of resolving them unilaterally

**Default-driven, not question-driven**
- Applies a stated default for apply mode, scope, cleanup breadth, and missing-file handling
- Announces which defaults it used so the assumption stays visible
- Treats a bare invocation as the request and starts working immediately

**Lossless by default**
- Classifies every finding into one of six drift types before it proposes a fix
- Requires a stated destination for anything that leaves a file
- Checks depth and purpose, not just topic, before it calls something a duplicate

**Approval gate that cannot be skipped**
- One proposal at a time, with a diff preview for every affected file
- Stops on silence instead of self-approving
- Routes every accepted edit through the file's owner skill, never a direct edit from this skill

## Examples

**Audit mode:**
```
Audit this repo for context drift across AGENTS.md and ARCHITECTURE.md only, and just tell me what's wrong -- don't make any changes yet.
```
→ Scopes to the two named files, consults their owner skills, stops after the issue list

**Interactive apply mode:**
```
Walk me through context drift fixes for this repo one proposal at a time so I can approve or reject each one.
```
→ Runs the full audit, then presents one proposal with a diff preview and an accept/deny/discuss prompt before it moves to the next

**Conflict detection:**
```
AGENTS.md says our API auth uses OAuth2, but CONSTRAINTS.md says we're locked into a legacy API-key scheme for a vendor integration. Can you check our context docs for drift?
```
→ Classifies this as a conflict, surfaces both statements, and asks which one is accurate instead of silently picking one

**Bare invocation:**
```
(the skill loads with no further task text in the turn)
```
→ Treats the invocation as the request, announces the defaults in use, and starts the audit against the current repository

## Testing

The skill includes 5 eval scenarios in `evals/evals.json`: a bare-invocation check, a scoped verify-only audit, an interactive-apply walkthrough, a wrong-home classification, and a conflict-detection case.

## Version

Current version: 1.0.0

See `CHANGELOG.md` for release history.

## License

Apache-2.0
