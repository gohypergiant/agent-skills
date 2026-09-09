# Portable Interactive Decision Guidance

## Purpose, scope, and evidence standard

Use this guidance when a workflow needs an explicit user choice before it can take a branch-dependent action. It is designed for reusable skills that must remain harness-agnostic across interactive, asynchronous, headless, and model-mediated environments.

This document separates two kinds of statements:

- **Normative portable policy** is a workflow-author requirement. It specifies the decision semantics a skill needs; it is not a claim that a product enforces them.
- **Documented platform observation** is limited to the cited product, documentation version, configuration, and execution mode. It does not establish behavior in another wrapper, deployment, model, custom extension, or future release.

Every factual platform claim has a bracketed evidence identifier whose trace records a primary source, exact location, verbatim support, retrieval date, and scope limit. The sources below were retrieved on **2026-09-09 UTC**. The Pi evidence is installation-specific; its installed version and source checksum are recorded in [E16].

## Research conclusion

A harness-agnostic skill can reliably specify **what decision state is required**, but prose alone cannot reliably cause every host or model to stop, render a dialog, preserve a cancellation reason, or route a branch. Documented host behavior differs materially: a question may wait in an SDK callback, auto-continue after a timeout, allow work to continue while awaiting a reply, or be unavailable in a non-interactive mode. [E1] [E2] [E3] [E5] [E6] [E11] [E12] [E16]

The portable unit is therefore a **decision-state contract**, not an instruction to call a particular question tool. A harness-specific adapter—when one exists—collects and normalizes host input. The skill states only the decision identifier, accepted branch values, effects, blocked work, validation rule, and unresolved outcomes. A model or host must not infer a branch from conversational plausibility, a tool permission, a partial selection, or the absence of a response.

## Normative portable policy

The requirements in this section are workflow-author choices. They are deliberately independent of a particular harness, model, tool, or user-interface API.

### 1. Decision contract

For each branch-dependent gate, the workflow **MUST** define:

```text
decision_id: <stable identifier>
question: <what must be selected and why>
accepted_values: <finite stable values>
effects: <one branch and side-effect boundary per accepted value>
blocked_work: <operations prohibited until validation>
invalid_input: <ask again or report unresolved>
decline: <defined decline branch or unresolved>
cancel_or_dismiss: unresolved
timeout: unresolved
noninteractive_or_unavailable: unresolved_noninteractive
```

The workflow **MUST** state the decision, why it matters, the allowed values, the effect of each value, the work blocked until a valid selection, and the outcome for absence, decline, cancellation, timeout, dismissal, ambiguity, and invalid input.

Use stable, complete branch values such as `restructure`, `append`, and `dry_run`. Do not route on natural-language summaries such as “go ahead,” “sounds good,” or “the first one” until the adapter maps the answer to exactly one accepted value. This prevents a free-text answer, multi-select result, partially selected timed-out dialog, or permissive implementation convention from silently selecting a branch. Native mechanisms documented by Claude Code, Gemini CLI, OpenCode, and Aider permit one or more of those ambiguous input forms. [E1] [E5] [E7] [E14]

### 2. Separate semantic decisions from permissions

A **semantic decision** selects a workflow branch, for example `append` rather than `restructure`. A **permission** authorizes an action, for example allowing a tool call or file edit. They are separate inputs and **MUST NOT** be treated as interchangeable.

A permission result such as `once`, `always`, `reject`, an approval to run a command, or a change from planning to execution mode does not identify a policy or workflow branch. OpenCode documents `once`, `always`, and `reject` as permission outcomes; Claude's Agent SDK describes tool permissions and clarifying questions as separate user-input cases; Cline documents Plan and Act as execution-capability modes. [E2] [E8] [E18]

### 3. Inspect, ask, hold, validate, route

1. **Inspect first.** Resolve the question from the user request or an authoritative project artifact when the governing workflow explicitly permits that source to decide it. Do not ask users to repeat independently inspectable facts.
2. **Explain.** State the evidence, why a decision remains open, each accepted value, each branch effect, and the blocked work.
3. **Ask.** Use an available native input mechanism only when it can faithfully represent the decision; otherwise ask in the conversation.
4. **Hold.** Until a valid decision record exists, do not dispatch, authorize, prepare, or perform branch-dependent work. A displayed question is not itself a hold.
5. **Validate.** Accept only one complete value from `accepted_values`, with no unhandled cancellation, timeout, dismissal, or transport failure.
6. **Route.** Restate the validated value and run only its associated branch.

The explicit hold is necessary because documented hosts can continue activities while a user reply is pending, or apply a follow-up only after current work completes. [E11] [E12] The skill may permit narrowly defined pre-gate work only when it cannot commit, prepare, or bias one branch.

### 4. State machine

Use this state machine for every required gate:

```text
open
  -> answered_valid(value)       # the only state that can route a branch
  -> invalid                     # ask again; no branch-dependent work
  -> declined                    # defined decline branch or unresolved
  -> cancelled                   # unresolved
  -> timed_out                   # unresolved
  -> unavailable_noninteractive  # unresolved
```

`answered_valid(value)` exists only when all of the following are true:

1. exactly one accepted value was received;
2. the host did not report cancellation, dismissal, timeout, or an unresolved transport failure; and
3. the decision record associates that value with the `decision_id`.

Treat silence, a dialog dismissal, a timeout, a tool permission, repository evidence that only supports a recommendation, an ambiguous reply, and a URL-navigation consent as **not selected**. The workflow may use a default only when an authoritative governing source explicitly defines it or the action is non-committing and reversible. Label the default and its authority.

### 5. Parent and subagent responsibilities

The parent agent **SHOULD** own the user-facing semantic decision and validate the decision record before routing. A discovery subagent **SHOULD** return evidence, confidence, recommended options, and unresolved questions; it **MUST NOT** select a policy or begin branch-dependent work.

This division is a portable workflow control, not a claim that all subagents lack input capability. It is additionally supported for Claude Agent-tool subagents, where `AskUserQuestion` is documented as unavailable. [E2]

### 6. Non-interactive and interrupted runs

If no valid decision is already recorded and the active execution mode cannot reliably obtain one, the workflow **MUST** produce `unresolved_noninteractive` and stop before branch-dependent mutation. Do not assume that a question tool has the same result in every headless mode: the documentation establishes materially different availability and configuration conditions across surveyed hosts. [E3] [E6] [E9] [E10] [E16]

For an interrupted, remote, or time-limited session, resume by showing the same `decision_id` and contract again. Do not infer a decision from earlier conversational context. This applies especially where steering is asynchronous or an agent session has a documented time limit. [E12] [E13]

### 7. Adapter boundary

A harness adapter may use a native dialog, conversational turn, SDK callback, extension UI, or MCP elicitation. It **MUST**:

1. check that the mechanism is available in the active mode and configuration;
2. render the decision contract without changing branch values or effects;
3. normalize host outcomes to the state machine above;
4. preserve distinct `decline`, `cancel`, and `timeout` information when the host supplies it;
5. validate input before persisting `answered_valid(value)`; and
6. enforce the hold before granting branch-dependent work.

The skill itself need not name the adapter. This keeps the skill portable while making the needed enforcement point explicit.

### 8. Example gate

> **Decision `existing-instructions-treatment`**: An existing instruction file has a structure this workflow does not classify. Choose one: **`restructure`** (map the content to the template), **`append`** (preserve it and add a template block), or **`dry_run`** (produce no filesystem changes). I will not synthesize a branch-specific draft, start a branch-specific interview, or write files until a valid choice is recorded.

`append` routes to the append branch. “Not sure,” “go ahead,” an unanswered dialog, or a permission approval leaves the gate unresolved.

## Policy rationale trace

| Normative control | Documented observations that motivate the control | Boundary |
| --- | --- | --- |
| Require a complete stable value before routing. | Claude Code supports typed alternatives and can submit selected options on timeout; Gemini choice questions can support multi-select; OpenCode accepts custom answers; Aider documents that “go ahead” in code mode executes a discussed plan. [E1] [E5] [E7] [E14] | The validation rule is workflow policy, not a vendor requirement. |
| Do not route on silence, dismissal, cancellation, timeout, or ambiguity. | Claude Code can continue after a configured timeout; Gemini documents dismissal; Pi's timed `confirm()` returns `false` for a result that can represent cancellation or timeout; MCP distinguishes `cancel` from `accept`. [E1] [E5] [E16] [E17] | Products do not jointly impose this rule; the workflow does. |
| Do not assume a question creates a hold. | Cursor documents continued reading, editing, and command execution while awaiting an answer. Copilot cloud agent applies steering after its current tool call. [E11] [E12] | The required hold is author-imposed. |
| Define a non-interactive outcome. | Claude Code can remove person-dependent tools in unattended runs; Gemini headless mode has no interactive terminal UI; Pi print and JSON modes cannot prompt; `codex exec` runs without the interactive TUI. [E3] [E6] [E10] [E16] | These sources do not define one uniform failure or return value. |
| Keep discovery agents out of policy selection. | Claude Agent-tool subagents cannot use `AskUserQuestion`. [E2] | This is narrow evidence; parent ownership remains a portable design choice. |

## Documented platform observations and adaptations

The **adaptation** for each platform is normative portable policy. The supporting evidence establishes only the adjacent platform observation.

### Claude Code and Claude Agent SDK

**Documented observations.** Claude Code describes `AskUserQuestion` as a multiple-choice mechanism that accepts an `Other` or notes-field answer. It says questions remain open until answered by default; with `askUserQuestionTimeout`, it closes the dialog, submits already selected options, and continues on Claude's judgment. The Agent SDK documents a different host integration: `canUseTool` pauses execution until the host returns, may remain pending indefinitely, and is cancelled when the query is cancelled. The SDK also says host-authored questions belong in the application's own logic, and Agent-tool subagents cannot use `AskUserQuestion`. [E1] [E2]

**Adaptation.** In interactive Claude Code, use `AskUserQuestion` only when available and validate the returned selection. Treat an idle timeout or partial selection as unresolved unless it maps to exactly one complete accepted value. An SDK host can implement a blocking adapter through `canUseTool`, but the portable skill must not assume that behavior in every Claude surface. Keep semantic branch selection with the parent agent.

**Non-interactive observation and adaptation.** With `--permission-prompts none`, Claude Code removes tools that require a human answer, including `AskUserQuestion`; unhandled MCP elicitation is cancelled. Define `unresolved_noninteractive` rather than expecting input to be available. [E3]

### Gemini CLI

**Documented observations.** Gemini CLI documents `ask_user` for multiple-choice, free-form, and yes/no questions. It says the tool pauses until answers are provided or the dialog is dismissed, and returns answers to the model as an `llmContent` JSON string indexed by question position. Choice questions support multi-select. Gemini's headless reference states that headless mode has no interactive terminal UI, but does not define what `ask_user` does there. [E5] [E6]

**Adaptation.** Use a single-select question for a single-route decision. Map the indexed answer only to an explicit stable branch value. Treat dismissal, an invalid position/value, and unknown headless behavior as unresolved. Do not assume the tool is disabled, blocking, or returns a particular value in headless mode.

### OpenCode

**Documented observations.** OpenCode documents a `question` tool for preferences, requirements, ambiguity, decisions, and implementation direction; users can select an option or type a custom answer. Its tools and permissions are configurable. Permission outcomes include `once`, `always`, and `reject`, and per-agent permissions can override configuration. The cited documentation does not define question dismissal semantics, a response schema, or waiting behavior in every execution mode. [E7] [E8]

**Adaptation.** Use `question` only when the active configuration permits it. Validate custom answers against the decision contract and retain a conversational or unresolved fallback. Do not use a permission outcome as a semantic branch value.

### Pi extension API

**Documented observations.** The installed Pi extension documentation describes `ctx.ui` dialogs and blocking user-facing prompt lifecycle events. On timeout, `select()` and `input()` return `undefined`, while `confirm()` returns `false`; its example treats the latter as cancellation or timeout. It documents `AbortSignal` as a way to distinguish timeout from user cancellation. `ctx.hasUI` is false in print and JSON modes; JSON UI methods are no-ops and print-mode extensions cannot prompt. [E16]

**Adaptation.** This is extension-API capability, not evidence that every Pi session exposes a general semantic-question tool. Use a typed UI only where the active extension and `ctx.hasUI` support it. Map `undefined`, cancellation, and timeout to unresolved. Treat raw `confirm: false` as an explicit “No” only when the adapter independently preserves the distinction required by the decision contract.

### Codex CLI

**Documented observations.** Codex configuration includes granular settings that can let MCP elicitation prompts and `request_permissions` prompts surface instead of being auto-rejected. The configuration reference does not establish a general built-in semantic-question tool. `codex exec` is documented as non-interactive and without the interactive TUI; its default sandbox is read-only. [E9] [E10]

**Adaptation.** Do not infer a native general question API from approval or MCP settings. Use MCP elicitation only when a connected server requests it and the client capability plus local configuration permit it. In `codex exec`, use a pre-recorded valid decision or stop at `unresolved_noninteractive` before branch-dependent mutation.

### Cursor Agent

**Documented observation.** Cursor says the agent can ask clarifying questions while it continues reading files, making edits, or running commands; it incorporates the answer when received. [E11]

**Adaptation.** Do not consider asking to be a hold. Explicitly prohibit all branch-dependent operations until a valid decision record exists. Allow only specified pre-gate work that cannot commit, prepare, or bias a branch.

### GitHub Copilot cloud agent

**Documented observations.** GitHub documents that a cloud-agent steering input is implemented after the current tool call, cloud-agent sessions use an ephemeral environment, have a 59-minute hard limit, and are shared by default with people who have repository access. [E12] [E13]

**Adaptation.** Treat steering as an asynchronous conversational channel, not a synchronous blocking choice tool. State the gate as a task boundary, require a separately validated selection before the branch, define resume behavior, and do not include credentials or sensitive decision material unless that visibility is appropriate.

### Aider

**Documented observations.** Aider documents `/ask` as an in-chat command for codebase questions without file edits. It starts in code mode by default and says “go ahead” in code mode executes the discussed plan. The cited documentation does not establish `/ask` as an agent-callable structured-decision API. [E14] [E15]

**Adaptation.** Use the conversation to obtain a stable explicit value. Do not treat an unqualified “go ahead” as a portable branch selection when several values are possible.

### Cline

**Documented observations.** Cline documents Plan mode as able to explore and discuss but unable to modify files or execute commands; Act mode retains the conversation history and can modify files and execute the plan. [E18]

**Adaptation.** Treat the mode distinction as an execution-capability boundary, not as a semantic-decision return type. A switch to Act mode does not by itself select a policy-bearing branch; require the decision contract separately.

## MCP elicitation

**Documented observations.** MCP specification `2025-11-25` defines form and URL elicitation and does not mandate a user interface. Clients that support elicitation must advertise the capability and at least one mode; servers must not request an unsupported mode. It defines distinct `accept`, `decline`, and `cancel` responses. Form mode must not request passwords, API keys, access tokens, payment credentials, or similarly sensitive values; URL mode is required for those interactions. URL-mode `accept` means consent to begin the out-of-band interaction, not that it completed. [E17]

**Adaptation.** MCP is optional; never require it in a portable skill. When an integration uses it, check advertised capability and supported mode at runtime, preserve `accept`/`decline`/`cancel`, validate form data before routing, and never place secrets in form-mode elicitation. Do not treat URL-mode acceptance as completion of an authorization flow or required decision.

**Source conflict.** Claude Code's MCP documentation currently gives a username/password form prompt as an example, while the MCP `2025-11-25` specification says servers **MUST NOT** request passwords or listed credentials in form mode. [E4] [E17] Portable guidance follows the protocol restriction; the product example is not evidence that collecting secrets in a form is permitted by the specification.

## Evidence gaps and non-generalization boundaries

The following remain unresolved because the cited primary documentation does not establish the needed fact:

| Topic | Evidence establishes | It does not establish |
| --- | --- | --- |
| Gemini CLI headless `ask_user` | Headless mode has no interactive terminal UI. [E6] | Whether `ask_user` is disabled, blocks, errors, or returns a defined dismissal result. |
| OpenCode `question` | Purpose, option/custom-answer behavior, and permission configuration. [E7] [E8] | Dismissal semantics, formal response schema, and all-mode waiting behavior. |
| Codex CLI semantic questions | Granular MCP/permission-prompt configuration. [E9] | A general built-in semantic-question API, its schema, or its wait behavior. |
| Cursor question result | Work can continue while a reply is pending. [E11] | Response schema, cancellation semantics, and an automatic hold boundary. |
| Copilot cloud-agent hold | Steering is applied after the current tool call. [E12] | A synchronous blocking decision API. |
| Aider integrations | `/ask` is an in-chat command. [E15] | The availability or absence of extensions, integrations, or future structured-input features. |
| MCP in a particular host | Requirements for clients that implement elicitation. [E17] | Whether a specific client currently advertises, enables, or renders elicitation. |
| Any model's compliance | The sources describe host and protocol mechanics, not model reliability. | Whether a model will consistently preserve a gate without host-side validation and enforcement. |

## Empirical evidence trace

| ID | Primary source and exact location | Verbatim support | Retrieval date and scope |
| --- | --- | --- | --- |
| **E1** | [Claude Code — Tools reference](https://code.claude.com/docs/en/tools-reference), **“AskUserQuestion tool behavior”** and **“Question auto-continue timeout”** | “Claude uses `AskUserQuestion` to ask you multiple-choice questions when it needs a decision or a clarification.” “Answer by picking an option, or type your own text through the `Other` row or the notes field.” “Questions stay open until you answer them.” “After a question sits that long with no input, the dialog closes on its own: it submits any options you'd already selected and tells Claude you may be away from your keyboard, so Claude proceeds on its own judgment and can re-ask later.” | 2026-09-09 UTC. Interactive Claude Code behavior. The timeout applies when `askUserQuestionTimeout` is configured. |
| **E2** | [Claude Agent SDK — Handle approvals and user input](https://code.claude.com/docs/en/agent-sdk/user-input), opening section, **“Handle clarifying questions”**, and **“Limitations”** | “Both trigger your `canUseTool` callback, which pauses execution until you return a response.” “The callback can stay pending indefinitely. Execution remains paused until your callback returns, and the SDK only cancels the wait when the query itself is cancelled.” “You can't add your own questions to this flow; if you need to ask users something yourself, do that separately in your application logic.” “`AskUserQuestion` is not currently available in subagents spawned via the Agent tool.” | 2026-09-09 UTC. Agent SDK host behavior, not every Claude Code surface. |
| **E3** | [Claude Code — Headless mode](https://code.claude.com/docs/en/headless), **“Turn off permission prompts in unattended runs”** and **“Permission modes for non-interactive runs”** | “With `--permission-prompts none`, Claude Code removes the tools that need an answer from a person, such as [`AskUserQuestion`] … so Claude can't call them.” “Any MCP elicitation request that no … `Elicitation` hook … answers is cancelled.” “`AskUserQuestion` … [is] denied even when an allow rule matches.” | 2026-09-09 UTC. The first behavior requires `--permission-prompts none`; the cited flag requires Claude Code v2.1.259 or later. |
| **E4** | [Claude Code — MCP](https://code.claude.com/docs/en/mcp), **“Respond to MCP elicitation requests”** | “MCP servers can request structured input from you mid-task using elicitation.” “Claude Code displays an interactive dialog and passes your response back to the server.” “Form mode: Claude Code shows a dialog with form fields defined by the server (for example, a username and password prompt).” “To auto-respond to elicitation requests without showing a dialog, use the `Elicitation` hook.” | 2026-09-09 UTC. Product-specific UI behavior. The password example conflicts with the protocol rule in E17. |
| **E5** | [Gemini CLI — Ask User Tool](https://geminicli.com/docs/tools/ask-user), **“Ask User Tool”** and **“Behavior”** | “The `ask_user` tool lets Gemini CLI ask you one or more questions to gather preferences, clarify requirements, or make decisions.” “Pauses execution until the user provides answers or dismisses the dialog.” “Returns the user's answers to the model.” “`llmContent`: A JSON string containing the user's answers, indexed by question position.” | 2026-09-09 UTC. Interactive tool documentation; it does not state a mode matrix or dismissal payload semantics. |
| **E6** | [Gemini CLI — Headless mode reference](https://geminicli.com/docs/cli/headless), opening section and **“Technical reference”** | “Headless mode provides a programmatic interface to Gemini CLI, returning structured text or JSON output without an interactive terminal UI.” “Headless mode is triggered when the CLI is run in a non-TTY environment or when providing a query with the `-p` (or `--prompt`) flag.” | 2026-09-09 UTC. Does not state what `ask_user` does in headless mode. |
| **E7** | [OpenCode — Tools](https://opencode.ai/docs/tools), **“question”** and **“Configure”** | “Ask the user questions during execution.” “Users can select from the provided options or type a custom answer.” “Use the `permission` field to control tool behavior. You can allow, deny, or require approval for each tool.” | 2026-09-09 UTC. Does not define dismissal behavior, formal response schema, or every mode's wait behavior. |
| **E8** | [OpenCode — Permissions](https://opencode.ai/docs/permissions), **“Actions”**, **“What ‘Ask’ Does”**, and **“Agents”** | “`\"allow\"` — run without approval”; “`\"ask\"` — prompt for approval”; “`\"deny\"` — block the action.” “`once` — approve just this request”; “`always` — approve future requests”; “`reject` — deny the request.” “You can override permissions per agent.” | 2026-09-09 UTC. These are action-permission outcomes, not documented semantic branch values. |
| **E9** | [Codex — Configuration reference](https://developers.openai.com/codex/config-reference/), entries **`approval_policy`**, **`approval_policy.granular.mcp_elicitations`**, and **`approval_policy.granular.request_permissions`** | “Controls when Codex pauses for approval before executing commands.” “When `true`, MCP elicitation prompts are allowed to surface instead of being auto-rejected.” “When `true`, prompts from the `request_permissions` tool are allowed to surface.” | 2026-09-09 UTC. Establishes configuration of particular prompt categories, not a general semantic-question API or response schema. |
| **E10** | [Codex — Non-interactive mode](https://developers.openai.com/codex/noninteractive/), **“Non-interactive mode”** | “Non-interactive mode lets you run Codex from scripts … without opening the interactive TUI. You invoke it with `codex exec`.” “By default, `codex exec` runs in a read-only sandbox.” | 2026-09-09 UTC. Does not establish every configured prompt or elicitation outcome in `codex exec`. |
| **E11** | [Cursor — Agent overview](https://cursor.com/docs/agent/overview), **“Tools”** | “Ask clarifying questions during a task. While waiting for your response, the agent continues reading files, making edits, or running commands. Your answer is incorporated as soon as it arrives.” | 2026-09-09 UTC. Does not define a response schema or cancellation result. |
| **E12** | [GitHub Docs — Managing agent sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents), **“Review session logs”** and **“Steer an agent session”** | “Copilot has its own ephemeral development environment, so it can run automated tests and linters to validate changes before pushing.” “Copilot implements your input after it finishes its current tool call.” | 2026-09-09 UTC. Copilot cloud-agent sessions only, not Copilot IDE or CLI modes. |
| **E13** | [GitHub Docs — About Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent), **“Limitations in Copilot cloud agent's software development workflow”** | “Each Copilot cloud agent session has a maximum execution time of 59 minutes. This is a hard limit that cannot be extended or bypassed. If a task exceeds this limit, the session will time out and stop.” | 2026-09-09 UTC. Cloud-agent session limit, not an input-tool result definition. |
| **E14** | [Aider — Chat modes](https://aider.chat/docs/usage/modes.html), **“Chat modes”** and **“Ask/code workflow”** | “`code` - Aider will make changes to your code to satisfy your requests.” “By default, aider starts in ‘code’ mode.” “Saying something as simple as ‘go ahead’ in code mode will have aider execute on the plan you’ve been discussing.” | 2026-09-09 UTC. Aider workflow guidance, not a portable branch-selection grammar. |
| **E15** | [Aider — In-chat commands](https://aider.chat/docs/usage/commands.html), **“Slash commands”** | “Aider supports commands from within the chat, which all start with `/`.” “`/ask` \| Ask questions about the code base without editing any files.” | 2026-09-09 UTC. Does not establish an agent-callable structured-decision facility. |
| **E16** | Local Pi documentation: [`extensions.md`](file:///Users/brandon.pierce/.local/share/fnm/node-versions/v24.19.0/installation/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md), **“ui_prompt_start / ui_prompt_end”**, **“Timed Dialogs with Countdown”**, **“Manual Dismissal with AbortSignal”**, and **“Mode Behavior”** | “Notification-only lifecycle events for blocking user-facing extension UI prompts.” “`select()` returns `undefined`”; “`confirm()` returns `false`”; “For more control (e.g., to distinguish timeout from user cancel), use `AbortSignal`.” “JSON … UI methods are no-ops”; “Print … Extensions run but can't prompt.” | 2026-09-09 UTC. Installation-specific extension API: `@earendil-works/pi-coding-agent` 0.85.1; `extensions.md` SHA-256 `39c54b91faabd76a17ab07f7ae85b274e941f36aacfaa6fe304281f697671faf`. Not evidence that every Pi session has a general question tool. |
| **E17** | [MCP specification 2025-11-25 — Elicitation](https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation), **“User Interaction Model”**, **“Capabilities”**, **“Response Actions”**, and **“URL Mode Elicitation Requests”** | “Implementations are free to expose elicitation through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.” “Servers **MUST NOT** use form mode elicitation to request sensitive information such as passwords, API keys, access tokens, or payment credentials.” “Clients that support elicitation **MUST** declare the `elicitation` capability.” “Cancel (`action: `cancel``): User dismissed without making an explicit choice.” “The response with `action: `accept`` indicates that the user has consented to the interaction. It does not mean that the interaction is complete.” | 2026-09-09 UTC. Protocol-version requirements for implementations that support elicitation; not proof that any individual host implements it. URL mode is introduced in this specification version. |
| **E18** | [Cline — Plan & Act Mode](https://docs.cline.bot/features/plan-and-act), **“Plan Mode”** and **“Act Mode”** | “Plan mode … can read your codebase, run searches, and discuss strategy, but cannot modify any files or execute commands.” “Once you have a plan, switch to Act mode. Cline retains the full context from your planning session and can now modify files, run commands, and execute your strategy.” | 2026-09-09 UTC. Execution-mode capability only; not a semantic-decision return type or cancellation contract. |

## Source maintenance

- Re-fetch every cited public source before publishing a platform-specific assertion. Confirm the exact heading and quote, then record the actual retrieval date supplied by the environment.
- Keep the Pi `file:` URL only as installation-specific primary evidence. Re-check the package version, source checksum, and cited headings after a Pi update.
- Preserve the distinction between documented observation, evidence-supported rationale, and normative workflow policy.
- Do not convert an evidence gap into a negative capability claim. When a host's behavior is unknown, use the adapter's `unresolved` path rather than guessing.
