# Artifact patterns for skill prose

Use this reference when you need positive guidance for how to shape a specific kind of behavior-defining prose.

This file is about **artifact-specific writing patterns**. Use it after you already know the safety rules from the root `SKILL.md` and the specialized references.

Do not use this file as a second copy of the core contract. Use it to choose the right prose shape for the artifact you are editing.

## 1. Frontmatter descriptions

Goal: keep trigger logic compact, explicit, and stable.

Use this pattern when you are deciding how to shape the description, not when you are checking trigger-family safety in detail. For trigger-preservation rules, load `frontmatter-descriptions.md`.

Shape descriptions so they:

- name the task clearly
- keep scope-defining nouns and verbs explicit
- keep boundary language visible
- avoid marketing filler

Useful order:

1. what the skill does
2. when to use it
3. boundary or non-goal when needed

## 2. Workflow prose

Goal: make the action path easy to follow without changing order.

Use this pattern when you are deciding how to present the workflow, not when you are checking exactness, gates, or timing drift in detail. For those safety checks, load `workflow-guardrails.md`.

Shape workflow prose so it:

- leads with the action or timing boundary
- keeps one step or decision per line when possible
- keeps approval gates and stop points explicit
- keeps rationale near the rule when the rationale prevents misuse

## 3. Guardrails and hard stops

Goal: make the limit direct, exact, and hard to weaken by paraphrase.

Use this pattern when you are shaping the prose. For obligation-level normalization, load `rfc-2119.md`.

Shape guardrails so they:

- state the prohibition or requirement directly
- preserve the original obligation level
- name the protected behavior or risk when that helps compliance
- keep exceptions explicit rather than implied

## 4. Rationale paragraphs

Goal: explain why a rule exists without burying the rule itself.

Shape rationale so it:

- follows or sits next to the rule it supports
- names the failure mode the rule prevents
- stays descriptive rather than turning into a second procedure
- keeps policy meaning intact even when tightened

## 5. Examples

Goal: keep examples only when they do real behavior work.

Keep examples when they:

- define scope
- mark a boundary case
- show exact output shape
- prevent a common misread

Remove or tighten examples only when they are redundant and not doing scope or behavior work.

## 6. Audit findings

Goal: help the user act without smuggling in a rewrite.

Shape findings so they:

- lead with the highest-risk issue
- identify the source text or section clearly
- explain the behavior risk
- distinguish trigger risk, workflow risk, guardrail risk, and exactness risk
- include replacement wording only when the user asked for examples
