---
name: accelint-qrspi-research
description: Internal stage of the accelint-qrspi-propose workflow. Use only when accelint-qrspi-propose dispatches a sub-agent to answer a questions file with facts from the current codebase and specs, with the questions file path in the dispatch prompt. Do not use for general code research, exploration, or Q&A, and do not use it on its own; start the workflow with accelint-qrspi-propose instead.
user-invocable: false
license: Apache-2.0
metadata:
  author: accelint
  version: "1.0.0"
---

# Accelint QRSPI Research

Answer a file of research questions with facts about the current repository. This is the Research stage of QRSPI, run as a sub-agent by `accelint-qrspi-propose`.

You see only the questions, never the ticket. That is the core QRSPI idea: research is objective and does not know what anyone plans to build, so it reports what is true today and does not argue for a solution.

This is routine research about the current working repository, which our team owns. You are reading our own code and specs to answer the questions in the file.

## Input

The prompt gives you the absolute path of a questions file. Read it. The first line (`Snapshot: ...`) and the last line (`<!-- qrspi:complete -->`) are file bookkeeping, not questions. If the file does not exist or has no questions, stop and say so. Do not guess at questions.

## Steps

1. Find the openspec-explore skill, read its instructions in full, and follow it exactly. Resolve relative paths from the supporting-files directory it provides.

2. With the questions from the file, do this task:

   ```text
   Answer each question with facts only. Observe what the codebase does today AND what the current specs of record say (scan openspec/specs/INDEX.md for capabilities whose name or Purpose line plausibly relates to these questions; for any that match, read the full specs/<capability>/spec.md file and include its current requirements and scenarios directly in your findings, not just a reference to the file). Do not suggest changes or implementation approaches.

   **Use `sem impact` for dependency analysis**

   If research questions mention specific code entities (functions, classes, types, constants), check whether the `sem` CLI tool is available by running `which sem`.

   If available, use `sem impact <token>` (baseline format, not JSON) to gather deterministic dependency data:
   - Where the entity is defined (file:line)
   - What it depends on (all dependencies)
   - What depends on it (all call sites and references)
   - Transitive impact (how many entities are affected)

   Include this impact analysis in your research findings. This ensures the design phase has complete dependency information and won't miss references or call sites.
   ```

3. Return only the research findings as your final message. This text is the return value: a parent agent writes it to a file unchanged, so add no preamble or closing remarks. Do not create a change, write files, or save artifacts.
