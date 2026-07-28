# Plain-English substitutions and consistency sets

Use this reference during rewrite passes when the draft contains filler, inflated diction, synonym rotation, or vague modality.

## Slop-to-simple substitutions

If the original word adds no real fact, delete it instead of replacing it.

| Prefer removing or rewriting | Prefer |
|---|---|
| leverage, utilize | use |
| in order to | to |
| prior to | before |
| ensure | make sure that |
| it is worth noting that | delete |
| importantly, crucially | delete unless the importance is explained |
| simply, just, easily, seamlessly, effortlessly | delete |
| robust, powerful, comprehensive | name the concrete property |
| functionality | feature, function |
| enables you to, allows you to | you can |
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
| addresses the issue | corrects the fault, removes the error |

## Modal ladder

| You see | Prefer |
|---|---|
| should (requirement) | must |
| should (recommendation) | make the recommendation direct, or state the fact |
| may / might / could (possibility) | can |
| may (permission) | can |
| would (padding or avoidable hypothetical) | rewrite the sentence |

Keep uncertainty when it is real and important.

## Consistency sets

Pick one term per concept and keep it stable across the passage.

### Validation set
Choose one:

- check
- make sure that
- verify
- confirm
- validate

### Configuration set
Choose one:

- config
- configuration
- settings
- options

### Execution set
Choose one:

- run
- execute
- invoke
- launch

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
