# Acceptance criteria guidelines

## File structure

- Individual tests: one file can contain multiple AC. One AC maps to one test. AC can be written either in bullet format in an `.md` file or in Gherkin format in a `.feature` file.
- Test suites: one file maps to one test suite, which turns into one test plan file and then one resulting Playwright test file. 

## General guidelines

- Sequencing: actions should be written in the order they should occur.
- Pattern: tests should always be written starting with the initial context (what is true when the test starts), followed by the action steps of the test (the events that take place), and finally ending with the expected outcomes. If you're tempted to add more events and expectations after the first set, write a second test instead.
- Phrasing: tests should be written in third-person present tense, and should generally follow the pattern  subject -> verb -> target. 
  - Bad: 
    - "open the settings page"
    - "I click the submit button"
    - "should see the tracks table"
  - Good: 
    - "the user is on the settings page"
    - "the user clicks the Submit button on the form"
    - "the tracks table shows up on the page"

### A note on procedure-driven vs behavior-driven test language: 

Historically, test writers have been encouraged to write tests with a focus on the behaviors the test is meant to execute and not the procedure for how to do it. This works great for many codebases, especially ones where humans are writing the underlying code for the test steps.

What this looks like: 
```
When a user logs in
```

However, in our case, we are defining AC that are meant to be completely and independently translated from AC to test code by an LLM. We must include explicit, imperative, action-oriented details about how the test should accomplish its task in order to avoid forcing the LLM to guess at the "how".

What this looks like:
```
When a user fills the email input field with 'test@example.com'
And a user fills the password input field with 'secure123'
And a user clicks the Submit button on the login form
```

## Avoid ambiguity

- Start URL: the default starting page is `/`. If a test needs a different starting page, state it at the start of your AC.
  - Example: "Given the user is on the settings page"
- Action verbs: use clear action verbs so that the agent can map to test steps (such as "click", "fill", "select", "hover", "reload", "press", "see"). Avoid vague verbs like "interact" or "use".
- Input values: include exact values for fills/selects.
  - Example: "the user fills the email input field with 'test@example.com'"
- Expected outcomes: state exactly what should happen and how to verify it.
  - Example: "success text that says 'Submitted' appears on a toast"
- Visibility changes: be explicit when something appears/disappears. The agent is looking for clue words to understand that visibility changes are expected (e.g., "visible", "appears", "shows", "see", "changes", "hides", and similar wording).
  - Example: "the tracks table shows up on the page"

## Mouse actions

When writing AC that involve mouse operations, distinguish between element-based and coordinate-based actions:

- **Element clicks** (most common): "the user clicks the Submit button on the form"
  - Uses test hooks to identify elements (see Targets below)
  - The agent translates this to a standard `click` action with a target
- **Coordinate clicks** (for precise positioning): "the user clicks at position 150, 200"
  - Uses x,y coordinates for clicking specific positions
  - The agent translates this to a `mouseClick` action
  - Optional: specify button type: "the user right-clicks at position 300, 400"
- **Double-clicks** (for coordinate-based actions): "the user double-clicks at position 150, 200"
  - Uses x,y coordinates for double-clicking specific positions
  - The agent translates this to a `doubleClick` action
  - Optional: specify button type: "the user double-clicks with the right button at position 300, 400"
- **Mouse movement** (for positioning): "the user moves the mouse to position 150, 250"
  - Positions the cursor at specific x,y coordinates without clicking
  - The agent translates this to a `mouseMove` action
- **Press and hold**: "the user presses the left mouse button"
  - Presses a mouse button at the current cursor position
  - The agent translates this to a `mouseDown` action
  - Always use `mouseMove` first to position the cursor
  - Optional: specify button type: "the user presses the right mouse button"
- **Release button**: "the user releases the mouse button"
  - Releases a held mouse button at the current cursor position
  - The agent translates this to a `mouseUp` action
  - Optional: specify button type: "the user releases the middle mouse button"
- **Drag operations** (for drawing): "the user drags the mouse from position 100, 100 to position 200, 200"
  - Combines move → press → move → release into a single action
  - The agent translates this to a `drag` action with start and end coordinates
  - Optional: specify button type: "the user drags with the right button from position 100, 100 to position 200, 200"
- **Scrolling** (for page navigation): "the user scrolls down 200 pixels"
  - Scrolls the page in a specified direction by a pixel amount
  - The agent translates this to a `scroll` action
  - Valid directions: `up`, `down`, `left`, `right`
  - Example: "the user scrolls right 150 pixels"

Valid buttons: `left` (default), `right`, `middle`

Use coordinate-based actions only when the AC explicitly requires precise positioning (drawing apps, canvas interactions, drag-and-drop with coordinates).

## Keyboard actions

When writing AC that involve keyboard interactions, use natural language to describe what keys are pressed:

- **Single key press**: "the user presses Enter" or "the user presses the g key"
- **Modifier combination**: "the user presses Shift+g" or "the user presses Control+Enter"

The agent will automatically translate modifier combinations into the proper sequence:
1. Hold down the modifier key 
2. Press the non-modifier key
3. Release the modifier key

Valid modifiers: `Shift`, `Control`, `a`

## Targets

To make your target unambiguous to the agent, use this pattern:

`<intent> <component> on the <area>`

Where:
- `<intent>` is the destination/meaning (noun).
- `<component>` is one of the component keywords (button, link, input, dropdown, checkbox, radio, text, div, component).
- `<area>` is one of the area keywords (nav, header, footer, form, drawer, card, toast, modal, table, page, area).

Examples:
- "From checkout, a user can submit the order by clicking the <u>place order button on the form</u>"
- "Given the user is on the home page, when the user clicks the <u>settings link in the header</u>, then the user arrives on the Settings page and see the <u>page heading text in the header</u> say 'Settings'"
- "When a user clicks the <u>Save button on the form</u>, then the user sees <u>success text in a toast</u>"

Notes:
- Avoid vague words like "option" or "item" without a component type.
- If the component isn't known, the agent will fall back to `component`.
- If the area isn't known, the agent will fall back to `area`.
- The pattern used "on the", but you could use "in a" or similar language as appropriate for readability.
- If there is a specific component or area that you think should be added to the list of keywords, start a discussion about adding it.

## Bullet-style AC files

The agent understands a `- ` bullet to signify a single AC, which maps to a single test. Any lines that don't start with a bullet will be ignored. One file can contain multiple AC. 

Notes or header lines in markdown format can appear anywhere in the file. Any lines that don't start with a bullet will be ignored by the agent, so any notes would be for humans who may read the AC file.

### Example

``` file.md
# Optional header
Optional text to note some details. 

- From the home page, a user can navigate to the Settings page by clicking the settings link in the header and should see the page heading text in the header say "Settings".
```

## Gherkin-style AC files

The Gherkin specific keywords that the agent understands are:
- `Feature:` - provides a high-level description. One feature per file.
- `Background:` - shared context for all scenarios in a file, in the form of one or more `Given` steps which will be executed before each and every scenario in the file. Should appear before the first scenario in a file.
- `Scenario:` - a test, which consists of one or more steps. A file can have many scenarios.
- `Scenario Outline:` - a test, but one where the same test is run multiple times with different combinations of inputs/outputs. Parameters in the scenario outline are represented with `<>`, such as `<page>`. Always paired with one or more `Examples:` blocks immediately after.
- `Examples:` - a table containing values to be run through the scenario outline. The header row should correspond to parameters in the scenario outline, while subsequent rows are the test values.
- `Given` - these steps describe the initial context of the system.
- `When` - these steps are used to describe an action or event.
- `Then` - these steps are used to describe an expected outcome.
- `And`, `But` - these keywords can be used to replace successive `Given`s, `When`s, or `Then`s for readability.

Within a scenario or scenario outline, any `Given` steps should come first, then any `When` steps, then the `Then` steps. Remember, if you're tempted to add more Whens and Thens after the first set, then what you really want is another test instead.

Comments can appear on any line in the file as long as the first non-space character on the line is `#`. 

Tags can be added in multiple places - right above the `Feature:` keyword, any `Scenario:` keyword, and any `Scenario Outline:` keywords. Tags above the `Feature:` keyword apply to all scenarios and scenario outlines in the file. Tags above a specific test only apply to that test.

Indenting is normally done like this:
```
@this-tag-is-unindented
Feature: This line is not indented

  # This comment is indented once.
  Background: Indented once
    Given all steps are indented twice

  @this-tag-is-indented-once
  Scenario Outline: This line is indented once
    Then this step is indented <times> too

  Examples:
    | times |
    | twice |
```

### Example

``` file.feature
@this-tag-applies-to-all-scenarios-in-the-file @another-one
Feature: Site navigation

  # Here's a comment.
  Background: 
    Given there is a logged-in non-admin user

  @scenario-level-tag @smoke
  Scenario: User navigates to the settings page
    Given the user is on the home page
    When the user clicks the settings link in the header
    Then the user is on the settings page
    And the page heading text in the header says "Settings"

  @regression @wip
  Scenario Outline: User can only access authorized pages
    Given the user is on the home page
    When the user clicks the <location> link in the header
    Then the user sees a <type> message
  
    Examples: 
      | location  | type    |
      | admin     | error   |
      | help      | success |
```