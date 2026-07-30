# English discipline checklist

Run this checklist before you deliver a rewrite, a draft, or a style audit.

## 1. Preserve the user's job to be done

Check first:

- Did the meaning stay intact?
- Did the audience fit stay intact?
- Did the requested tone stay intact?
- Did any explicit format or wording constraints stay intact?

If not, fix that first. No style improvement is worth breaking the user's intent.

## 2. Mechanical checks

Search the draft for these patterns outside code and quoted text.

| Search for | Why it may be a problem | Typical fix |
|---|---|---|
| `should`, `would`, `may`, `might`, `could` | vague or weak modality | use the modal ladder in `substitutions.md` |
| `has been`, `have been`, `had been` | blurred tense | prefer simple present or simple past |
| `is being`, `are being`, `was being` | progressive passive clutter | rewrite in active voice |
| `;` | sentence packing | split into two sentences |
| `e.g.`, `i.e.`, `etc.` | shorthand that weakens clarity | write it out or name the items |
| `simply`, `easily`, `seamlessly`, `robust` | filler or vague praise | delete or replace with a fact |
| repeated synonym sets | term drift | pick one term and standardize it |

## 3. Structure checks

- Is the point, result, or next action visible early enough?
- Are long sentences split?
- Does each sentence carry one main action or fact?
- Are multi-step instructions numbered when numbering makes the work easier to follow?
- Are paragraphs limited to one topic?
- Do conditions come before commands in procedures?
- Are warnings phrased as command first, risk second?

## 4. Truthfulness checks

- Did you remove a hedge that carried real uncertainty?
- Did you replace a precise technical term with a less accurate plain word?
- Did you delete nuance that the audience needs?

If yes, restore the truth even if the sentence gets longer.

## 5. Tone checks

- Is warmth preserved when the user asked for warmth?
- Is voice preserved when the prose is intentionally creative or persuasive?
- Did you remove only stale phrasing, not deliberate style?

## 6. Untouchables check

Verify that these stayed exact unless the user asked otherwise:

- code
- commands
- flags
- identifiers
- file paths
- quoted errors
- product names
- legal text

## 7. Actionability check

If the output is supposed to help someone act:

- Does the first line tell them what to do, or make the next action obvious?
- If there are multiple steps, are they numbered?
- Is the action path easy to scan?
- Is unrelated advice deferred until the main task is complete?
- Is visible progress stated clearly when the exchange spans multiple turns?

## 8. Final question

Ask:

- Is this easier to read?
- Is it easier to act on?
- Is it still the same message?

If all three are true, deliver it.


## STE-specific audit note

If the user asked for strict STE-style review, load only the relevant part of `ste-rules.md` that you need and report:

- rule number
- offending text
- compliant rewrite

Do not invent rule numbers. Use only the rule numbers present in the part of the reference that you actually loaded.

## Multi-pass editing note

For long drafts or large rewrites, prefer multiple passes:

1. preserve meaning and constraints
2. remove filler and split overloaded sentences
3. standardize terminology and modality
4. re-check tone, nuance, and actionability

This reduces accidental meaning drift and works better in constrained tool contexts.
