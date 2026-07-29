# Plain-English substitutions and consistency sets

Use this reference during rewrite passes when the draft contains filler, inflated diction, synonym rotation, or vague modality.

These are context-sensitive editing moves, not automatic replacements.
Preserve requirement strength, permission, capability, uncertainty, and official technical terminology.
If a direct swap changes the meaning or sounds unnatural, rewrite the sentence instead.

## Slop-to-simple substitutions

If the original word adds no real fact, delete it instead of replacing it.
Use these substitutions only when they preserve the exact meaning and fit the writing mode.

| Prefer removing or rewriting | Prefer |
|---|---|
| leverage, utilize | use |
| in order to | to |
| prior to | before |
| ensure | make sure that, verify, confirm, or rewrite the sentence depending on the context |
| it is worth noting that | delete |
| importantly, crucially | delete unless the importance is explained |
| simply, just, easily, seamlessly, effortlessly | delete |
| robust, powerful, comprehensive | name the concrete property |
| functionality | feature, function |
| enables you to, allows you to | you can, or state the action/result directly |
| is designed to, aims to | say what it does |
| facilitate | help, make possible |
| delve into, dive into | read, examine |
| when it comes to | for |
| in the event that | if |
| due to the fact that | because |
| as needed, as necessary | state the condition |
| and/or | choose one, or write both explicitly |
| e.g., i.e., etc. | for example, that is, or name the items |
| gracefully handles | say what it does |
| out of the box | by default |
| under the hood | internally |
| streamline | make simpler, make faster |
| plethora, myriad | many |
| addresses the issue | state the exact action or result |

## Modal and uncertainty checks

Do not upgrade or flatten modality mechanically.
First identify whether the source expresses a requirement, recommendation, permission, capability, or uncertainty.

| You see | Prefer |
|---|---|
| should (requirement) | must only if the source clearly expresses a true requirement and stronger force does not change meaning |
| should (recommendation) | make the recommendation direct, or state the fact |
| may / might / could (possibility) | keep the uncertainty if it is real; use can only for capability or well-supported general possibility |
| may (permission) | can only if permission and capability are equivalent in context |
| would (padding or avoidable hypothetical) | rewrite the sentence |

Quick checks:

- **requirement**: the reader is obligated to do it
- **recommendation**: the reader is advised to do it
- **permission**: the reader is allowed to do it
- **capability**: something is able to happen or be done
- **uncertainty**: the fact is not confirmed, not guaranteed, or conditional

Keep uncertainty when it is real and important.
In procedures, prefer direct imperative instructions over modal-heavy phrasing.

## Consistency sets

Pick one term per concept and keep it stable across the passage.

### Validation set
Choose one based on the actual job of the sentence:

- check = inspect or test
- make sure that = confirm a condition before or after an action
- verify = confirm against a source, rule, or expected value
- confirm = establish that something is true or settled
- validate = prove that something meets a formal rule, schema, or acceptance criterion

### Configuration set
Choose one:

- config
- configuration
- settings
- options

### Execution set
Choose one based on the actual context:

- run = general default for commands, scripts, tests, or processes
- execute = use when the domain already uses it or the action is formally defined that way
- invoke = use for APIs, functions, handlers, or explicitly technical call semantics
- launch = use for starting an app, job, or process when "start" or "run" would be less exact

### Problem set
Choose based on actual meaning:

- error = specific error condition or message
- failure = operation did not succeed
- problem / issue = broader non-specific case

### Deletion set
Do not collapse distinct technical meanings carelessly:

- delete
- remove
- drop
- destroy

Use one per meaning, then keep it consistent.

## Stale phrase filter

Watch for phrases that often survive because they sound polished:

- "best-in-class"
- "state-of-the-art"
- "user-friendly"
- "intuitive"
- "scalable"
- "flexible"
- "seamless"

These are not banned because they are long. They are weak because they often hide the actual claim. Replace them with evidence or a concrete behavior.
