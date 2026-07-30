# Examples by writing type

Use this reference when a concrete pattern will help before drafting, rewriting, or auditing text.

These examples are intentionally short. Use them to anchor judgment, not to force a template onto unrelated prose. Favor the core default method first: state the point early, use direct wording, keep terms stable, and apply stronger structure only when it helps the reader.

## Procedural rewrite

**Before:** You should restart the service if the config has been changed.

**After:** If the config changed, restart the service.

Why this helps:
- puts the condition first
- removes weak modality
- shortens the sentence without losing the action

## Procedural rewrite with numbered steps

**Before:** Open the config file, change the timeout value, save the file, and run the command again.

**After:**
1. Open the config file.
2. Change the timeout value.
3. Save the file.
4. Run the command again.

Why this helps:
- keeps one action per step
- makes progress easy to track
- reduces the chance of skipping a step

## Descriptive rewrite

**Before:** The reporting workflow is designed to provide users with improved visibility into shipment delays.

**After:** The reporting workflow shows users where shipments are delayed.

Why this helps:
- replaces abstraction with a concrete result
- removes inflated phrasing
- keeps the same meaning

## Incident or status update rewrite

**Before:** We have identified an issue that may have impacted some users during the deployment window.

**After:** During the deployment window, some users could not complete requests.

Why this helps:
- states the effect directly
- removes hedged corporate phrasing
- keeps uncertainty bounded to what is actually unknown

## Support or operational reply

**Before:** It looks like there may be an authentication-related issue that could be affecting your ability to sign in. Please try clearing your browser cookies and cache.

**After:** Clear your browser cookies, then sign in again. The current session data may be invalid.

Why this helps:
- leads with the next action
- keeps the cause short and usable
- removes apology-style padding

## Error explanation pattern

**Before:** The process failed due to an issue with the uploaded file.

**After:** The upload failed because the file format is not supported. Upload a CSV or JSON file.

Why this helps:
- names the failure
- gives the cause if known
- ends with a clear next action

## Email or internal communication rewrite

**Before:** I just wanted to reach out and let you know that we are still waiting on the API key from the vendor, so the integration work is a little blocked right now.

**After:** We are still waiting on the vendor's API key, so the integration is blocked.

Why this helps:
- moves the update to the front
- removes throat-clearing
- preserves the relationship-neutral tone

## Voice-preserving rewrite

**Before:** We are absolutely thrilled to announce that our tiny team finally shipped the update we have been dreaming about for months.

**After:** We are thrilled to share the update our small team has worked toward for months.

Why this helps:
- keeps warmth and momentum
- removes inflation, not personality
- preserves promotional intent without over-flattening the line

## Audit example

**Source:** In order to ensure that users are able to successfully complete onboarding, the system should provide guidance that is intuitive and user-friendly.

**Audit finding:**
- **Category:** filler and weak modality
- **Offending text:** "In order to ensure," "should provide guidance," "intuitive and user-friendly"
- **Better rewrite:** "To help users finish onboarding, the system must give clear guidance."
- **Note:** If this is product copy instead of a requirement, replace `must` with a factual statement about current behavior.

## Audit example with severity ordering

**Summary:** The passage buries the required action, uses weak modality, and mixes explanation with instruction.

**Highest-risk issue:** The reader may miss the required step because the command is hidden inside a long sentence.

**Finding:**
- **Category:** procedural structure
- **Offending text:** "You may want to rotate the key after the deploy if the old secret is still active in production."
- **Better rewrite:** "If the old secret is still active in production, rotate the key after the deploy."
- **Note:** This keeps the condition, removes weak modality, and makes the action explicit.

## Hybrid technical rewrite

**Before:** This guide helps teams get aligned on architecture decisions while providing a comprehensive overview of the system in a way that is approachable for both engineers and stakeholders.

**After:** This guide helps teams align on architecture decisions. It gives engineers and stakeholders a clear system overview.

Why this helps:
- keeps the persuasive value
- splits the abstract promise into direct claims
- stays readable without flattening the purpose

## Casual request where heavy structure would be wrong

**User asks:** "can you clean this up but keep it friendly?"

**Good response shape:**
- keep the warmth
- remove filler and repetition
- make the point easier to scan
- do not force numbered steps unless the text is actually procedural

This reminder helps avoid over-applying technical or ADHD-oriented structure to simple human communication.

## Reusable example patterns

Patterns that work well in this reference:
- before/after pairs for the same sentence or paragraph
- one instruction per step
- condition first, then action
- state the failure, the cause, and the next action
- show why a rewrite is better, not just that it is shorter

Avoid copying examples too literally when they depend on:
- product-specific names
- commands or file paths from another project
- timestamps, metrics, or incidents from another system


## When to use this file

Use this file when:
- the request is ambiguous and a concrete pattern will help select the right mode
- the text mixes clarity goals with voice-sensitive constraints
- a procedural or support rewrite needs a quick anchor before drafting
- the model is over-correcting toward rigidity and needs examples of when to stay light
- you want examples of the difference between the core default method and stronger structure