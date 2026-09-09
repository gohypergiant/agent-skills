# Serial Instructions in Agent Skill Files: Evidence Review

**Purpose:** support authors of agent `SKILL.md` files who need an agent to carry out a procedure in order.

**Research date:** 2026-09-09
**Scope:** static natural-language instructions that an LLM reads while performing a multi-step task. This review does **not** evaluate a particular skill, model, harness, or markup convention.

## Executive conclusion

No public controlled study found in this review tests whether bullets, numbered lists, headings, checkboxes, XML, or a “Step 0” checklist produces the best **serial execution** in agent skill files. Therefore, do not present any of those format choices, numeric thresholds, or a format reliability ranking as established empirical fact. [G1; E6–E7]

The strongest directly relevant evidence is that models tested on sequential instructions lose accuracy at later positions in a dependency chain; separately, models tested on many simultaneous constraints lose compliance as instruction density and prompt conflict increase. [E1–E3]

Accordingly, write the fewest independent requirements that preserve the procedure, make real data or approval dependencies explicit, and verify critical outcomes outside the model whenever a deterministic check is available. The first two recommendations are evidence-informed design inferences; the last is a control-boundary inference, not a controlled comparison of prose styles. [R1–R3]

## How to read the evidence

- **Direct evidence** reports what a study or official document actually tested or prescribed.
- **Inference** is a limited design conclusion from direct evidence; it is not a measured causal result.
- **Local hypothesis** is useful only after the owning team evaluates it on its own model, harness, tools, and task distribution.
- References such as **[E1]** point to the claim-to-evidence ledger. Every factual claim about model behavior or provider guidance in this document has one of these traces.

## What the evidence establishes

### 1. Sequential dependencies are a genuine failure mode

The peer-reviewed SIFo benchmark evaluates sequences of two to six instructions in which later results depend on earlier operations. Across its tested models and four constructed benchmark tasks, accuracy by step declines monotonically as sequence position increases; the authors report a significant decline at the second instruction. [E1]

This supports a narrow conclusion: a skill that relies on the result of one operation before another should state that dependency and should not assume that a capable model will preserve a long chain unaided. It does **not** establish that any particular Markdown structure, checklist, or label fixes the issue. [E1]

#### Decomposition and explicit result handoff can help in bounded reasoning tasks

In least-to-most prompting, a model first decomposes a problem into easier subproblems, then receives the prior subproblem-and-answer pairs while solving the next subproblem. The peer-reviewed study reports 99.7% accuracy for `code-davinci-002` on the SCAN length split with this method, and lower results from its tested chain-of-thought and standard few-shot baselines. [E12]

This is direct evidence for a tailored few-shot reasoning intervention, not for a general `SKILL.md` template: the method uses task-specific demonstrations, older GPT-3-era models, and problem-solving tasks rather than tool execution. The authors report that decomposition prompts do not generalize well between domains. A skill author may locally test decomposition plus explicit state handoff for a genuinely dependent reasoning task; they should not add decomposition stages to independent, simple, or externally validated work without evidence that it helps. [E12]

### 2. More simultaneous requirements increase compliance risk

IFScale tests up to 500 independent keyword-inclusion instructions in a report-writing task. Its best frontier result at the maximum density was 68% accuracy, and its analysis reports a bias toward earlier instructions. [E2]

SCALEDIF, an arXiv preprint that tests up to ten instructions, attributes an important part of performance decline as instructions are added to tension and conflict between them. [E3]

At lower constraint counts, FollowBench evaluates one through five constraints across 820 instructions. It reports that its tested proprietary models consecutively satisfy about three constraints, while evaluated open models satisfy about two; the benchmark still measures output constraints, not tool workflows. [E8]

The conservative skill-writing implication is to remove redundant requirements and resolve contradictions rather than piling additional reminders onto an already dense workflow. This is an inference from constraint-following benchmarks, not proof that every extra sentence in a skill harms a modern coding agent. [E2–E3; E8]

### 3. Position can matter, but there is no universal ordering rule

In PBIF, an arXiv study of multi-constraint instruction following, changing constraint order caused performance variation; the authors found better results for their hard-to-easy ordering across the tested architectures and sizes. The study says its constraints are usually parallel and identifies sequential constraints as future work. [E4]

In a different task class, *Lost in the Middle* found a U-shaped relationship between the location of needed information and performance in multi-document question answering and key-value retrieval: several tested models did best when needed information was near the start or end and degraded in the middle. [E5]

These studies justify testing placement of genuinely critical instructions in a long prompt. They do **not** justify a universal rule such as “always put hard requirements first,” because the studies use different models, tasks, and definitions of difficulty. [E4–E5]

### 4. Prompt format is consequential but not a known serial-execution solution

Two formatting studies show that meaning-preserving format changes can affect outcomes. Sclar et al. found large format sensitivity in few-shot evaluations of selected open models, with the largest reported spread reaching 76 accuracy points for LLaMA-2-13B. [E6]

Rungta et al. tested plain text, Markdown, YAML, and JSON on selected GPT-3.5/GPT-4 versions and multiple non-agent benchmarks; they found no format that won universally, and explicitly did not test HTML or XML. [E7]

Neither study measures tool-using agents executing a `SKILL.md`, nor compares bullets, step headings, checkboxes, or XML step tags for workflow compliance. Do not infer a general ranking such as “XML is more obedient than Markdown” or “step headings are high reliability” from this evidence. [G2; E6–E7]

### 5. Long context creates a retrieval and salience risk, not a checklist proof

The long-context study above found that additional context can be hard for some models to use reliably, and that placement changes can materially alter results. [E5]

This makes compact, locally relevant instructions a reasonable hypothesis to test. It does **not** demonstrate that repeating a checklist in each agent reply, adding a `Step 0`, limiting a skill to a fixed line count, or moving prose into reference files improves compliance. Some providers and the Agent Skills standard recommend selected variants, but those are guidance rather than causal evaluations; use a local experiment before making them a reliability rule. [G3; E5; P1–P2]

### 6. Stateful tool-agent workflows add a distinct execution risk

$\tau$-bench evaluates agents that converse with a simulated user, call database APIs, and receive a domain-policy document as their system prompt. Its rule-based reward compares the final database state with an annotated target state and checks required user-facing information; its authors also note that matching the reward may still miss a policy violation such as acting before explicit confirmation. [E9]

In the paper’s manual review of 36 agent-caused failures from 115 one-trial $\tau$-retail trajectories of a GPT-4o function-calling agent, 25% were incorrect decisions attributed to failing to apply domain rules, and 19% were partial resolutions of compound requests. One reported failure executed a one-time exchange for one item before collecting every item the user wanted to exchange, making the later item impossible to exchange. [E9]

The same study’s policy-removal ablation was model- and domain-sensitive: GPT-4o `pass^1` declined by 4.4 points in retail and 22.4 points in airline, while GPT-3.5 Turbo declined by 5.5 and 1.2 points. This shows that a policy document can affect success in the evaluated setting; it does not isolate its wording, format, or salience from the domain knowledge it supplies. [E9]

This is direct evidence that a policy document plus tool access does not by itself reliably preserve prerequisites in the evaluated setting. It does **not** test `SKILL.md` prose, Markdown structure, or coding-agent tools. The conservative implication is to evaluate a skill that drives state changes with an outcome assertion and, when a prerequisite or prohibited transition is itself safety- or policy-semantic, a trace assertion—not only with a judged final response. Place irreversible prerequisites in a validator, tool, or workflow guard when the architecture permits. This is a control-boundary inference, not a measured formatting intervention. [E9; D3; D9]

ToolSandbox independently demonstrates one way to express this distinction in an evaluation. Its stateful tool benchmark defines required milestones and forbidden “minefields”; milestone dependencies form a DAG, and a trajectory passes the ordering requirement when its matched milestones form a topological sort. The evaluator can inspect database snapshots, tool traces, and intermediate state while allowing multiple valid trajectories. [E10]

Do **not** turn that evaluator design into a universal exact-trace rule. Use an order predicate when the dependency, authorization, or safety property truly requires it; otherwise, permit independent actions, recovery paths, and other source-valid routes to the outcome. ToolSandbox provides an evaluation mechanism, not evidence that putting a DAG, checklist, or dependency prose in a skill causes better execution. [E10; D10]

### 7. Instruction authority is a capability boundary, not an in-document formatting rule

The Instruction Hierarchy study trained GPT-3.5 Turbo to resolve conflicts among system, user, and tool-content instructions. Its trained approach improved a system-prompt-extraction safety evaluation by 63% and held-out jailbreak robustness by more than 30%; the paper reports that its training data outperformed a prompt-only hierarchy baseline. [E11]

This study supports treating conflicts with untrusted user or tool content as a model-and-harness authority problem that must be evaluated. It does **not** show that labels such as “Priority 1,” headings, or a `SKILL.md` order robustly enforce authority in an untrained agent. Protect privileged instructions with the message roles, tool permissions, and external policy controls that the actual harness supports. [E11; D11]

## Evidence-informed authoring pattern

Use this pattern when steps have an actual dependency. It is deliberately format-neutral: the observable control is the dependency and check, not the heading level.

```markdown
### Validate the migration
Run `scripts/validate-migration.sh`.

- Exit code 0: record the result and continue to **Apply the migration**.
- Any other exit code: repair the reported problem and repeat **Validate the migration**.
- Do not apply the migration until validation succeeds.
```

This pattern does not make an LLM deterministic. It makes the prerequisite, success condition, failure route, and release condition inspectable. [D1]

For a short, independent sequence, use the least elaborate structure that makes order legible to both authors and the active harness. There is no empirical basis for a universal cutoff such as three, four, eight, or twelve steps. [G1; E6–E7]

For branching work, state which path is selected, which path is skipped, and where successful paths rejoin. This is a specification-quality recommendation: it removes ambiguity from the written procedure, but no identified experiment measures its effect on skill-file execution. [D2]

For safety-, approval-, or data-integrity-critical work, move the condition into a validator, script, workflow engine, or harness guard when the architecture allows it. The condition can then be evaluated by that mechanism rather than being only a natural-language request; the agent can still fail to invoke the mechanism, so the harness should enforce invocation where possible. [D3]

## Recommendations, evidence traces, and confidence

| ID | Recommendation | Claim class | Evidence trace | Confidence and limit |
|---|---|---|---|---|
| R1 | Make each true input/output dependency explicit; give the later action a concrete prerequisite and a failure route. | Evidence-informed inference | SIFo uses dependent, ordered operations and reports declining later-step accuracy. [E1] | **Moderate.** It targets the observed failure class, but E1 did not compare wording variants. |
| R2 | Reduce redundant, competing, and independent instructions before adding emphasis or reminders. | Evidence-informed inference | FollowBench and IFScale report lower multi-constraint compliance at their tested densities; SCALEDIF identifies conflict/tension as an important factor. [E2–E3; E8] | **Moderate.** Benchmarks do not establish a safe sentence count for a skill. |
| R3 | Use an executable check for a critical condition and do not let a prose statement substitute for the check. | Control-boundary inference | Deterministic programs evaluate their encoded predicate; SIFo shows that sequential natural-language execution is not robust. [D3; E1] | **High for the narrow mechanism; unmeasured for overall agent success.** The harness must still make the agent run or honor the check. |
| R4 | Evaluate the chosen format and instruction placement against the intended model and harness before standardizing it. | Evidence-informed inference | Format and placement effects vary across models and tasks. [E4–E7] | **High.** It recommends measurement rather than a winner. |
| R5 | Keep a progress tracker only when the current harness reliably exposes and updates it, then test whether it improves completion on representative tasks. | Local hypothesis | No located controlled study tested reply-copied checklists or task tools as an intervention for serial `SKILL.md` execution. [G4] | **Low until locally measured.** A tracker may add context and stale-state failure modes. |
| R6 | When a skill drives tools or state changes, evaluate target state and repeated-run reliability. Add action-order or forbidden-transition predicates only when a source-defined dependency, authorization, or safety property makes the path semantically material. | Evidence-informed evaluation design | $\tau$-bench compares annotated and final database states, distinguishes action and user-output reward components, and uses repeated-trial `pass^k`; ToolSandbox scores state/trace milestones in dependency order while allowing alternative valid trajectories. [E9–E10] | **Moderate.** The benchmarks use simulated tool environments, not coding agents or `SKILL.md` variations. The material-path test is an inference. |
| R7 | For a genuinely dependent reasoning task, test a decomposition that carries each verified sub-result into the next subtask; do not add that structure to independent or externally validated work by default. | Evidence-informed inference | Least-to-most prompting decomposes and sequentially reuses sub-results, outperforming its tested baselines on selected reasoning tasks. [E12] | **Low to moderate.** The source uses tailored few-shot examples and older models; it is not a tool-agent or skill-file study. |
| R8 | Treat conflicts between trusted instructions and untrusted user or tool content as a model/harness capability to evaluate and enforce, not as an outcome guaranteed by priority labels in a skill. | Evidence-informed inference | Instruction Hierarchy improves conflict handling through model training and reports that this training outperforms a prompt-only hierarchy baseline. [E11] | **Moderate.** The study is a GPT-3.5 Turbo training intervention for security evaluations, not a test of current coding agents or `SKILL.md` wording. |

## Findings: unsupported universal rules

The evidence reviewed here does not support treating the following statements as research conclusions. A team may adopt one as a local convention only after a direct, reproducible evaluation on its model and harness:

| Statement | Why it is unsupported by the reviewed evidence |
|---|---|
| “Numbered step headings are the default/best format.” | No located experiment compares headings with other serial formats in agent skill files. [G1] |
| “A checklist is the important part” or “only a checklist carries state.” | No located intervention study measures checklist copying or state retention in this setting. [G4] |
| Fixed cutoffs such as 2–3, 4–8, 9+, or 12+ steps. | The reviewed work uses benchmark-specific sequence lengths and does not derive authoring thresholds. [E1–E3; E8; G1] |
| “Use XML for nested branches” or “XML is equal/better for order.” | The reviewed format studies do not test XML and do not measure this workflow outcome. [E6–E7] |
| “Keep `SKILL.md` under 500 lines,” “one workflow per file,” or “use bold on two steps at most.” | P1 and P2 recommend a 500-line limit, but no reviewed empirical source tests that threshold or the other conventions for serial agent execution. [G1; P1–P2] |
| “Put hard steps first.” | PBIF supports a hard-to-easy result in its benchmark, while long-context evidence finds both primacy and recency effects; neither establishes this universal rule. [E4–E5] |
| “Test with a smaller model; success there predicts a larger model will succeed.” | Format sensitivity and model-specific results argue against assuming such transfer without direct measurement. [E6–E7] |
| “One successful run proves that a serial agent workflow is reliable.” | In $\tau$-bench, the chance that the same GPT-4o function-calling agent solved all eight repeated retail trials fell below 25% despite average one-run success above 60%. This is a benchmark-specific result, but it directly rejects that conclusion for the evaluated workflow. [E9] |
| “Every valid serial workflow has one exact tool-call trace.” | ToolSandbox models required dependencies as a milestone DAG and accepts trajectories whose matched milestones form a topological sort, expressly allowing different valid orders where dependencies do not constrain them. [E10] |
| “Decomposition is the best default for every multi-step skill.” | Least-to-most improves selected few-shot reasoning tasks, but its authors state that decomposition prompts do not generalize well across domains. It does not test tool workflows or skill files. [E12] |
| “A priority heading in an instruction document robustly defeats untrusted content.” | Instruction Hierarchy evaluates a trained model and finds its training data outperforms a prompt-only hierarchy baseline. It does not test headings or generic skill-file labels. [E11] |

## A minimal local evaluation protocol

If the organization needs a house standard, evaluate it rather than adopting an untested format preference.

1. Define the actual task family: linear tool workflows, approval gates, branches, recovery loops, or cross-file audits. **Do not mix them into one score.** [D4]
2. Create a fixture for each family with machine-checkable completion, order, and forbidden-action assertions. For a stateful tool workflow, assert the target state; add an action-order or forbidden-transition predicate only where the workflow makes that path semantically material. A final state alone can omit a policy violation, while a fixed trace can reject valid independent or recovery paths. [E9–E10; D5]
3. Hold semantic content, tools, model, temperature, context budget, and harness constant while varying one structure at a time: for example, numbered steps versus headings, or a tracker versus no tracker. [E6–E7; D6]
4. Run repeated trials and report exact completion, order violations, omitted required steps, forbidden early actions, retry behavior, token use, and wall-clock time. Do not report only self-authored success summaries. [D7]
5. Re-run the suite after changing the model, harness, task tool, system prompt, or context-management policy; format effects are not reliably transferable across models. [E6–E7]
6. Promote a convention only if it improves the relevant outcome without an unacceptable trade-off. Record the fixture, model and version, prompt, harness version, dates, sample size, and raw results. [D8]

## Claim-to-evidence ledger

| ID | Source and evidence type | Exact evidence | What it supports | Scope and limitation |
|---|---|---|---|---|
| E1 | Chen et al., **peer-reviewed**, *The SIFo Benchmark* (Findings of EMNLP 2024), [§4–§5.4](https://aclanthology.org/2024.findings-emnlp.92/) | The paper describes 2–6 sequential instructions whose later actions depend on earlier state. It reports: “all models show a monotonic decline in performance as the position of an instruction in a sequence increases,” and the authors report a significant decline at step two. | Sequential dependencies and later steps are difficult for the tested models. | Four constructed benchmark tasks; models include GPT-4, Claude-3 Opus, and selected open models available in 2024. It does not test agent tools or skill-file formats. |
| E2 | Jaroslawicz et al., **arXiv preprint**, *How Many Instructions Can LLMs Follow at Once?* (2025), [abstract](https://arxiv.org/abs/2507.11538) | IFScale contains 500 keyword-inclusion instructions for business-report writing; the abstract reports that “even the best frontier models only achieve 68% accuracy at the max density of 500 instructions,” plus bias toward earlier instructions. | Very high independent-instruction density can sharply reduce compliance in that benchmark. | Keyword inclusion is not a serial agent workflow; the work is a preprint. |
| E3 | Elder et al., **arXiv preprint**, *Boosting Instruction Following at Scale* (2025), [abstract](https://arxiv.org/abs/2510.14842) | The authors state that their SCALEDIF analysis finds “an important factor” in degradation from added instructions is “tension and conflict.” | Prompt conflict is a plausible contributor to multi-instruction failure. | Up to ten instructions; the paper evaluates a post-generation method and its own benchmark, not skill files. |
| E4 | Zeng et al., **arXiv preprint**, *Order Matters* (2025), [§4.2 and §7](https://arxiv.org/abs/2502.17204) | The authors report performance fluctuations when constraint order changes and better results for a “hard-to-easy” order across their tested architectures and sizes. They state that their constraints are usually parallel and that sequential constraints need further study. | Constraint order can affect multi-constraint compliance. | “Hard” and “easy” are benchmark-defined; the study does not establish causal workflow-step order or apply to all models. |
| E5 | Liu et al., **peer-reviewed**, *Lost in the Middle* (TACL 2024), [§2–§5](https://arxiv.org/html/2307.03172v3) | The study reports a U-shaped curve in multi-document QA and key-value retrieval: needed information near the beginning or end often performs better than in the middle. It reports a >20% GPT-3.5-Turbo drop in one multi-document setting. | Long-context information use and placement can affect results. | QA/retrieval tasks and older model versions; not a study of instruction following in contemporary coding agents. |
| E6 | Sclar et al., **peer-reviewed**, *Quantifying Language Models’ Sensitivity to Spurious Features in Prompt Design* (ICLR 2024), [abstract](https://arxiv.org/abs/2310.11324) | The authors report up to 76 accuracy points of format spread for LLaMA-2-13B and weak correlation of format performance between models. | Meaning-preserving formatting can be model- and task-sensitive. | Primarily few-shot task evaluation of selected open models; it does not test serial skill workflows. |
| E7 | Rungta et al., **arXiv preprint**, *Does Prompt Formatting Have Any Impact on LLM Performance?* (2024), [§2–§7](https://arxiv.org/html/2411.10541v1) | The study holds content constant across plain text, Markdown, YAML, and JSON. It reports statistically significant best/worst-format differences on most tested model/task pairs, no universal winner, and explicitly lists untested HTML/XML as a limitation. | Format effects need local evaluation; no universal winner follows from this study. | GPT-3.5/GPT-4 Azure versions and non-agent benchmarks; preprint; XML omitted. |
| E8 | Jiang et al., **peer-reviewed**, *FollowBench* (ACL 2024), [§1 and §4.2](https://arxiv.org/abs/2310.20410) | The benchmark contains 820 curated instructions with one through five constraints. The paper reports tested proprietary models consecutively satisfy approximately three constraints, compared with roughly two for the evaluated open models. | Compliance can decline at lower multi-constraint counts in the tested output-constraint tasks. | Constraint count is confounded with type and difficulty; it is not a serial tool-workflow or skill-format study. |
| E9 | Yao et al., **arXiv preprint**, [$\tau$-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/html/2406.12045v1), [§3–§5.2](https://arxiv.org/html/2406.12045v1) | The agent receives the domain policy as its system prompt; the benchmark compares final database state and necessary user outputs with annotated outcomes, while noting its reward can miss some policy violations. With GPT-4o function calling, the paper reports 61% retail and 35% airline `pass^1`, and retail `pass^8` below 25%. Its analysis of 36 agent-caused retail failures assigns 25% to wrong decisions and 19% to partial compound-request resolution; an example performs a one-time exchange before gathering all exchange items. Removing the policy decreased GPT-4o `pass^1` by 4.4 points in retail and 22.4 points in airline; the effect for GPT-3.5 Turbo was 5.5 and 1.2 points, respectively. | Stateful, policy-driven tool agents can violate prerequisites and complete partial work despite a natural-language policy; policy effectiveness and repeated-run reliability are model- and domain-dependent. | Customer-service domains, simulated users, specific 2024 models, and a rule-based reward the authors acknowledge is not sufficient to detect every policy violation. Policy removal changes domain knowledge as well as policy text; it does not isolate format, salience, or skill-file effects. |
| E10 | Wong et al., **arXiv preprint**, [*ToolSandbox: A Stateful, Conversational, Interactive Evaluation Benchmark for LLM Tool Use Capabilities*](https://arxiv.org/html/2408.04682), [§2.3 and Appendix A.7](https://arxiv.org/html/2408.04682) | The benchmark evaluates mutable world state and agent/tool trajectories with required milestones and forbidden minefields. Milestone dependencies form a DAG; it finds mappings whose chronological sequence is a topological sort. Milestones can compare database snapshots, tool traces, and execution results, and the paper explicitly allows different valid trajectories. | Tool-agent evaluations can test source-defined temporal dependencies and forbidden events without forcing a single full trajectory. | Simulated tool environment, human-authored milestone design, and 2024 models; this is an evaluator design, not an intervention comparing agent instructions or skill-file formats. |
| E11 | Xiao et al., **arXiv preprint**, [*The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions*](https://arxiv.org/html/2404.13208v1), [abstract and §1–§4](https://arxiv.org/html/2404.13208v1) | The authors train GPT-3.5 Turbo to resolve conflicts across system, user, and tool-content messages. They report a 63% improvement in system-prompt-extraction defense and more than 30% held-out jailbreak improvement, and state that their training approach outperforms their prompt-only hierarchy baseline. | Robust handling of instruction authority can be a model-training and harness problem with measurable outcomes. | Security-focused training intervention on GPT-3.5 Turbo; it does not test headings, `SKILL.md` files, serial workflow formatting, or current agent models. |
| E12 | Zhou et al., **peer-reviewed**, [*Least-to-Most Prompting Enables Complex Reasoning in Large Language Models*](https://arxiv.org/html/2205.10625v3) (ICLR 2023), [§2–§3.3](https://arxiv.org/html/2205.10625v3) | The method decomposes a problem, then solves subproblems sequentially with earlier subproblem-and-answer pairs in the next prompt. On SCAN’s length split, the paper reports 99.7% accuracy for `code-davinci-002`, outperforming its tested chain-of-thought and standard few-shot baselines; it also says decomposition prompts do not generalize well across domains. | Explicit decomposition and prior-result handoff can improve selected dependent reasoning tasks. | Tailored few-shot prompts, GPT-3-era models, and symbolic/reasoning benchmarks; no tool execution, safety gate, or skill-file study. |
| G1 | Research-gap statement | This review of E1–E12 found no controlled comparison of bullets, numbering, headings, checkboxes, phase grouping, or XML for serial execution of agent skill files. | The document must not rank these as empirically validated. | An absence claim is bounded to this review’s public-source search; it is not proof that no unpublished evaluation exists. |
| G2 | Research-gap statement | E6 compares plausible prompt formats but not XML; E7 compares plain text/Markdown/YAML/JSON and explicitly omits XML. Neither tests the listed workflow structures. | XML/Markdown reliability rankings are unsupported here. | Same bounded-search limitation as G1. |
| G3 | Research-gap statement | E5 varies context length and placement, not checklist repetition, task trackers, fixed line limits, or reference-file depth. | Those conventions are not validated by the long-context finding. | It does not prove the conventions are ineffective. |
| G4 | Research-gap statement | No located source isolates task trackers or reply-copied checklists as an intervention and measures serial `SKILL.md` compliance. | Checklist/state claims require local evaluation. | Same bounded-search limitation as G1. |
| D1 | Reasoning trace, not an empirical result | The example makes the transition condition and retry route explicit in the written contract. | Why the example improves inspectability. | It makes no measured claim about compliance. |
| D2 | Reasoning trace, not an empirical result | Naming selected/skipped/rejoin paths removes the unstated routing decision from the prose. | Why explicit branch routing is a specification practice. | It makes no measured claim about model behavior. |
| D3 | Reasoning trace, not an empirical result | A validator or workflow engine evaluates an encoded condition according to its implementation, while a prose requirement is interpreted by the agent. | Why external checks are a stronger control boundary. | The check can be wrong, bypassed, or uninvoked; enforcement design remains necessary. |
| D4–D8 | Evaluation-design reasoning, not empirical results | These steps isolate the variable, use observable outcomes, and preserve run metadata. | A reproducible way to replace unsupported general rules with local evidence. | The protocol itself must be tailored and validated for the organization’s risk and task mix. |
| D9 | Control-boundary reasoning, not an empirical result | A final response can claim success without revealing the actual state transition or a forbidden early action; an observable state/trace predicate can test the encoded condition. | Why R6 asks for state and trace assertions. | The chosen predicate can still be incomplete or wrong, and E9 does not test this intervention in coding-agent skills. |
| D10 | Evaluation-design reasoning, not an empirical result | An exact trace treats every alternative as a failure; a dependency-aware predicate distinguishes required ordering from independent or valid recovery actions. | Why R6 restricts path assertions to semantically material paths. | Defining material dependencies remains a source- and risk-specific design decision. |
| D11 | Control-boundary reasoning, not an empirical result | A prose priority marker relies on the model interpreting text as authority; message roles, tool permissions, and external policy controls can encode authority outside the untrusted content. | Why R8 does not treat a priority heading as enforcement. | The available controls and their actual enforcement depend on the harness. |

## Provider and standard guidance (not empirical effectiveness evidence)

Vendor documentation and the Agent Skills standard are useful for product mechanics and supported authoring conventions. They do not constitute controlled evidence that a convention improves serial `SKILL.md` execution. Their loading, composition, and validation mechanics are harness-specific, so do not transfer them as universal workflow-order rules. Keep those evidence classes separate. [G5; P1–P5]

| ID | Guidance source | Direct guidance | What it does and does not establish |
|---|---|---|---|
| P1 | [Agent Skills specification](https://agentskills.io/specification) | The body has “no format restrictions,” lists step-by-step instructions as a recommended section, and recommends progressive disclosure, a body under 5,000 tokens, and a main `SKILL.md` under 500 lines. | It documents a portable convention and loading model. It does not compare serial formats or validate the numeric limits as compliance thresholds. |
| P2 | [Anthropic, *Skill authoring best practices*](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) | It recommends clear sequential steps and, “for particularly complex workflows,” a checklist that Claude copies and checks off. It also recommends a plan-validate-execute pattern and scripts for deterministic operations. | It is provider guidance and product-specific advice, not a published controlled comparison of checklists, headings, or scripts for generic skill files. |
| P3 | [Anthropic, *Claude prompting best practices*](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | It recommends numbered lists **or bullet points** when order/completeness matters, and describes XML tags as a way to separate instructions, context, examples, and inputs. | It supports using explicit structure with Claude. It neither ranks those forms for serial workflow execution nor shows that XML has special instruction authority. |
| P4 | [OpenAI Codex, *Custom instructions with AGENTS.md*](https://developers.openai.com/codex/guides/agents-md/) | Codex builds an instruction chain by concatenating instruction files from the project root to the working directory; files nearer the working directory appear later and override earlier guidance. It stops adding files at the configurable `project_doc_max_bytes` limit, 32 KiB by default. | It documents Codex-specific instruction composition, precedence, and truncation behavior. It does not measure whether a procedural ordering or format improves compliance. |
| P5 | [Model Context Protocol, *Tools* specification (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) | Servers with an output schema **MUST** return conforming structured results; clients **SHOULD** validate them. The specification also says servers **MUST** validate tool inputs and that clients **SHOULD** provide actionable execution errors to models for retry. | It supplies a protocol-level validation and error-feedback contract when an MCP tool carries a workflow check. It does not ensure that an agent invokes the tool at the required time or prescribe skill-file structure. |
| G5 | Evidence-boundary statement | This review does not treat a vendor recommendation, a blog post, or an anecdote as proof that a checklist, XML tag, numbered heading, task tool, or line limit improves serial `SKILL.md` execution. | Provider guidance can be adopted for its stated product scope, but must be labelled as such. |

## Practical bottom line

Prefer **explicit dependencies, observable completion conditions, named failure routes, and external checks for high-consequence transitions**. [R1–R3]

Treat **numbering, headings, checklists, XML, phases, wording position, and document-length limits as testable implementation choices**, not as a settled reliability hierarchy. [R4–R5; G1–G4]
