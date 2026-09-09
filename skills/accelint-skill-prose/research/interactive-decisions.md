# Portable Interactive Decision Guidance

## Purpose

Use this guidance when a workflow needs the user to make a decision before the agent can safely continue.

Do not require a specific question tool. Different agent harnesses support different interaction models. Instead, define the required outcome:

1. Ask the user a clear question.
2. Explain the available choices and their effects.
3. Wait for an explicit answer when the decision is a required gate.
4. Do not start work that depends on the choice until the user answers.
5. Route the workflow from the user’s selected option.

Use the active harness’s native question UI when it is available. Otherwise, present the same question in the conversation and wait for the user’s next message.

A skill can require this behavior, but it cannot guarantee that every harness has a blocking question tool. The skill must therefore state what work is blocked while the answer is pending.

---

## Core rules

### Ask for a decision, not permission

A user decision and a tool permission are different.

- **Decision:** “Should I restructure, append, or dry run?”
- **Permission:** “May I edit this file?”

A tool-permission approval does not select a workflow branch. Do not treat it as one.

### Use an explicit choice

Give the user clear options. Each option should have:

- a stable name or value;
- a short explanation of what will happen;
- no hidden default;
- a clear next step after selection.

For example, use stable values such as:

- `restructure`
- `append`
- `dry_run`

A native question UI can render these as selectable options. In normal chat, the user can reply with the option name or describe their preference in their own words.

### Do not infer a choice

Do not treat any of the following as a user selection:

- silence;
- a dismissed question dialog;
- an unanswered question that times out;
- a tool-permission approval;
- an ambiguous reply;
- repository evidence alone.

If the answer is unclear, ask a short follow-up question.

### Block branch-dependent work

Until the user chooses, do not begin work that depends on the decision.

For an `AGENTS.md` import workflow, blocked work includes:

- restructuring the existing file;
- appending a generated block;
- creating a merged draft;
- starting a branch-specific interview;
- writing files.

Read-only work required before the decision gate may still continue. For example, reading an existing file to classify its state is allowed when the workflow requires it before the user chooses a branch.

### Keep user decisions with the parent agent

Subagents should gather evidence and return it to the parent agent.

Subagents should not:

- choose a workflow branch;
- infer standing policy from repository evidence;
- ask the user a decision question;
- continue with branch-dependent work while a decision is unresolved.

The parent agent owns the user conversation and asks the final question with the relevant evidence.

---

## Interaction protocol

### 1. Identify the decision

Ask whether the workflow needs a user decision or whether repository evidence already answers the question.

Do not ask the user to repeat information that is already known.

### 2. Explain the choice

State:

- what the agent found;
- why a decision is needed;
- the available options;
- the effect of each option.

### 3. Ask the question

Use a native structured question tool when the harness supports one. Otherwise, present the question in normal conversation.

The wording and options should stay the same across harnesses.

### 4. Wait or stop

If the decision is a required gate, do not begin branch-dependent work until the user selects an option.

If the harness is non-interactive, identify the decision as unresolved and stop at that gate unless:

- the user’s original request already made the selection explicit; or
- that specific workflow step explicitly defines a non-interactive exception.

Do not invent an exception that the workflow does not define.

### 5. Confirm and route

After the user answers:

1. Restate the selected option.
2. Name the next workflow step.
3. Begin only that branch.

For example:

> You chose **Append**. I will continue with Step 6c and preserve the existing content while preparing a template-aligned block below it.

---

# Examples from `accelint-onboard-agents`

## Example 1: Choose how to use an existing instruction file

Use this after detecting an existing `AGENTS.md` or `CLAUDE.md`.

> This file already follows the canonical template. Would you like to:
>
> - **Work with the existing file** — refresh the current guidance; or
> - **Start fresh** — use the current file only as a reference and regenerate the structure?
>
> I will not begin refresh or regeneration until you choose.

### Required behavior

- If the user chooses **Start fresh**, route to Mode 1: Create.
- If the user chooses **Work with the existing file**, continue to the applicable import or refresh path.
- Do not silently select the recommended option.

---

## Example 2: Choose an import branch

Use this after identifying an existing file with a structure the skill does not recognize.

> This `AGENTS.md` has existing content with a structure I do not recognize. How would you like to proceed?
>
> **Restructure** — I will import the existing content, map it onto this skill’s template sections, flag material that belongs in a canonical companion document instead, run a targeted interview to fill gaps, and produce a merged file ready to replace the current one.
>
> **Append** — I will run the full interview and append a template-aligned `AGENTS.md` block below the existing content without modifying what is already there.
>
> **Dry run** — I will run the full interview and show exactly what I would have generated, with no changes to the filesystem.
>
> Choose **Restructure**, **Append**, or **Dry run**. I will not start a branch until you choose.

### Required behavior

- **Restructure** routes to Step 6b.
- **Append** routes to Step 6c.
- **Dry run** routes to Step 6d.
- Do not begin restructuring, appending, draft synthesis, or a branch-specific interview while the choice is unresolved.
- Do not use “Append” as an assumed default.

---

## Example 3: Confirm a Smart Default

Use repository evidence to make the question easier, not to create policy without confirmation.

> I found a PNPM workspace. Should the generated guidance tell agents to use workspace-aware commands when package selection matters?

Other examples:

> I found GitHub Actions workflows. Should the generated guidance name specific required CI checks before work is considered complete?

> I found Conventional Commit signals. Should the generated guidance require Conventional Commits, and are there repository-specific scopes or footer rules to include?

> I found a spec-driven workflow. Which parts should become durable agent behavior in `AGENTS.md`, and which parts should remain in canonical project documentation?

### Required behavior

- State the evidence first.
- Ask the user to confirm, reject, or refine the proposed rule.
- Do not treat the evidence as final policy unless the workflow says it is sufficient.

---

## Example 4: Ask before moving content to a companion document

Use this when existing content does not belong in `AGENTS.md` or `CLAUDE.md`.

> This section describes the system’s deployment architecture rather than agent behavior. It belongs in `ARCHITECTURE.md`, with a short reference in `AGENTS.md`. Should I make that move?

Other examples:

> This section defines an external compliance boundary. It belongs in `CONSTRAINTS.md`, with an agent-facing reference here. Should I move it?

> This section lists internal acronyms and terminology. It belongs in `JARGON.md`, with only the behavior-relevant guidance retained here. Should I move it?

### Required behavior

Explain:

1. what the content describes;
2. why it does not belong in the current file;
3. where it would go;
4. what would remain in the agent instruction file.

Do not silently relocate content across the behavior and project-documentation boundary.

---

## Example 5: Ask a targeted refresh question

Use this after gathering evidence about drift, contradictions, or unresolved TODOs.

> I found a new migration directory and an unresolved TODO about migration safety. Should the guidance require approval before creating, editing, or applying migrations?

Other examples:

> I found new release tooling and no versioning guidance in the current file. Should the agent use the repository’s release workflow before changing versions or publishing packages?

> I found a contradiction between the current instruction file and the CI workflow. Which source should govern the completion checks: the documented policy or the current CI configuration?

### Required behavior

- Name the evidence that caused the question.
- Ask only about the affected decision.
- Do not restart the full interview when a focused question is enough.

---

## Example 6: Keep discovery subagents out of the decision loop

Use subagents to gather facts, then have the parent agent ask the user about policy.

### Subagent instruction

> Inspect the repository for commit conventions. Return the evidence, its source, and your confidence. Do not ask the user questions. Do not infer standing policy.

### Parent-agent question

> Discovery found `commitlint.config.ts` and recent Conventional Commit messages. Should the generated guidance require Conventional Commits?

### Required behavior

The subagent reports evidence. The parent agent compares that evidence with:

1. direct user answers;
2. documented repository policy;
3. the existing instruction file;
4. template defaults.

The parent agent then asks a focused question only if the answer remains unresolved.

---

## Example 7: Request final preview approval

Use this before writing the generated `AGENTS.md` or `CLAUDE.md`.

> Here is the full labeled preview. Does this look right? Are there any sections to correct or expand before I write the file?

### Required behavior

In an interactive run:

- show the full preview;
- collect feedback;
- do not write the file until the approval gate is satisfied.

In an explicitly non-interactive run:

- still show the full preview;
- state that human confirmation could not be collected in-session;
- do not claim the result was human-confirmed;
- follow the workflow’s explicit non-interactive rule.

This final-preview exception does **not** automatically apply to earlier branch-selection gates. Each gate needs its own defined behavior.

---

# Harness guidance

## Harnesses with native question tools

Use the native question tool when it is available and appropriate:

- **Claude Code:** [`AskUserQuestion`](https://code.claude.com/docs/en/tools-reference.md)
- **Gemini CLI:** [`ask_user`](https://geminicli.com/docs/tools/ask-user)
- **OpenCode:** [`question`](https://opencode.ai/docs/tools)
- **Pi:** use an available extension or session tool that exposes user input, such as a selector, confirmation dialog, text input, or custom UI. Pi extensions document [`ctx.ui.select`, `ctx.ui.confirm`, `ctx.ui.input`, and `ctx.ui.custom`](file:///Users/brandon.pierce/.local/share/fnm/node-versions/v24.19.0/installation/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md).

Use the same decision, options, and blocked-work rules regardless of the UI.

## Harnesses without a documented native semantic-question tool

Use normal conversation when the harness does not provide a suitable native question tool.

This includes environments such as:

- Codex CLI without an applicable MCP integration;
- GitHub Copilot cloud agent;
- Aider;
- custom or headless agent harnesses.

Present the choices clearly. Then wait for the next user message or stop at the required gate.

## Asynchronous harnesses

Some harnesses can ask a question while continuing to work.

Cursor documents this behavior: while waiting for an answer, its agent can continue reading files, making edits, and running commands. See the [Cursor Agent overview](https://cursor.com/docs/agent/overview.md).

For these harnesses, a question alone is not enough. The skill must also say:

> Do not begin branch-dependent work while the answer is pending.

The agent may continue only with safe work that the workflow explicitly allows before the decision gate.

---

# Optional MCP integration

[MCP elicitation](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation) provides structured user input with explicit `accept`, `decline`, and `cancel` outcomes.

It can be useful when:

- an MCP server owns the question workflow;
- the MCP client advertises elicitation support;
- the harness is configured to allow elicitation prompts.

Do not make MCP elicitation a requirement for a portable skill. Not all MCP clients support it, and not all harnesses have a connected MCP server that uses it.

Codex CLI documents optional MCP elicitation prompts through its [configuration reference](https://developers.openai.com/codex/config-reference/), but does not document a general built-in semantic-question tool.

---

# Evidence

- [Claude Code tools reference](https://code.claude.com/docs/en/tools-reference.md) — `AskUserQuestion` gathers requirements and clarifies ambiguity. It normally remains open until answered, but can auto-continue after a configured timeout.
- [Claude Code Agent SDK user input](https://code.claude.com/docs/en/agent-sdk/user-input.md) — structured user input and the limitation that Agent-tool subagents cannot use `AskUserQuestion`.
- [Gemini CLI `ask_user`](https://geminicli.com/docs/tools/ask-user) — choice, text, and yes/no questions; execution pauses until the user answers or dismisses the dialog.
- [OpenCode tools](https://opencode.ai/docs/tools) — the `question` tool supports requirements, ambiguity, preference, and implementation-direction questions.
- [Pi extensions](file:///Users/brandon.pierce/.local/share/fnm/node-versions/v24.19.0/installation/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md) — extension UI methods for user interaction, including blocking prompts.
- [Cursor Agent overview](https://cursor.com/docs/agent/overview.md) — the agent can continue working while waiting for a user answer.
- [Codex CLI configuration reference](https://developers.openai.com/codex/config-reference/) — optional MCP elicitation prompts.
- [GitHub Copilot cloud agent overview](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) — background agent workflow and follow-up interaction.
- [Aider in-chat commands](https://aider.chat/docs/usage/commands.html) — `/ask` is a user command, not a documented agent-callable structured-question tool.
- [MCP elicitation specification](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation) — structured user input and explicit accept, decline, and cancel outcomes.
