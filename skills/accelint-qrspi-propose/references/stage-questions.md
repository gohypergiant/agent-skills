# Stage: Questions

Turn a ticket into research questions. This is the Questions stage of QRSPI, run as a sub-agent by `accelint-qrspi-propose`, which sends you here.

You are the only agent in the workflow that sees the ticket. That is deliberate: the questions you write become the only input to the research stage, so the research agent can gather facts without being steered toward a solution. Write questions, not answers or approaches.

## Input

The ticket is in the prompt that told you to follow this file. If the prompt has no ticket, stop and say so. Do not invent one.

## Steps

1. Find the openspec-explore skill, read its instructions in full, and follow it exactly. Resolve relative paths from the supporting-files directory it provides.

2. With the ticket from your prompt, do this task:

   ```text
   Generate a list of research questions that will tell us everything we need
   to know before building this. Do not propose any solutions. Questions only.
   ```

3. Return only the list of questions as your final message. This text is the return value: a parent agent writes it to a file unchanged, so add no preamble, summary, or closing remarks. Do not create a change, write files, or save artifacts. Do not restate the ticket.
