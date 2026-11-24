# Stage: Questions

Turn a ticket into research questions. This is the Questions stage of QRSPI, run as a sub-agent by `accelint-qrspi-propose`, which sends you here.

You are the only agent in the workflow that sees the ticket. That is deliberate: the questions you write become the only input to the research stage, so the research agent can gather facts without being steered toward a solution. Write question not answers or approaches.

## Input

The ticket is in the prompt that told you to follow this file. If the prompt has no ticket, stop and say so. Do not invent one.

## Steps

1. Find the openspec-explore skill and read its instructions in full. Use it only to learn the codebase well enough to write good questions. Resolve relative paths from the supporting-files directory it provides.

Where it conflicts with step 2 or step 3, those steps win. In particular, skip its user dialogue, diagrams, change proposals, and offers to save insights.

2. With the ticket from your prompt, do this task:

```text
Generate research questions for this ticket. A researcher will answer them by
investigating the codebase, docs, and libraries. The researcher never sees the
ticket, so the questions are their only input. Each question must make sense
on its own and must be answerable without knowing what we plan to build.

Questions are descriptive, never normative. Ask how things work today, not
what should change. Cover what exists and where, how modules, services, and
components are structured and interact, current implementation details,
existing patterns and constraints, edge cases and complexities, and how
libraries and dependencies behave (the researcher may need to search the web
or library docs for these).

Aim each question at where the answer is. Name the package, service, repo, or
doc: "In packages/ui, how does ...?", "How do the WorkOS docs say a user is
updated?" Refer to the existing parts the ticket touches, never to the goal.
Do not use the ticket's own wording ("the remaining candidates", "the
proposed rules"). Name the files, rules, or components directly.

Do not:
- propose solutions, improvements, or approaches
- ask what the codebase needs or what should change
- use "how would we ...", "how should ...", or "where should we ..."
- leak the task, the feature name, or the intended design into any question

Cover every area the ticket could touch, not just the code it names: the
implementation, its tests and fixtures, docs and specs that describe it,
other code that consumes it, repo conventions (release, validation, style
guides), and external libraries. Write as many questions as that takes.
Keep each question to one area: if answering it means investigating
unrelated places, split it.

No one will reply to you during this stage. Explore only as far as you need
to decide what to ask. If something is unclear, make it a question. If
exploring already showed you an answer, still ask the question: the
researcher will confirm it with evidence.

Before you finish, reread each question. If it reveals what we are building,
rewrite it.
```

3. Return only the list of questions as your final message. This text is the return value: a parent agent writes it to a file unchanged, so add no preamble, summary, or closing remarks. Do not create a change, write files, or save artifacts. Do not restate the ticket.
