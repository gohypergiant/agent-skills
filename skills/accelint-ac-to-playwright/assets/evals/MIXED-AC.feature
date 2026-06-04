@comprehensive-test @automation-ready
Feature: Comprehensive action and assertion coverage

  Background:
    Given the user is on the test page

  @visibility-changes missing-at-symbol @whoops @smoke
  Scenario: Multiple visibility state changes
    When the user clicks the toggle-interface button on the page
    Then the settings panel div on the drawer appears
    And the welcome text on the modal appears
    And the tutorial text on the card disappears

  @keyboard-modifier-combo @whoops
  Scenario: Keyboard modifier combination
    When the user presses Shift+e
    Then the text on the header says 'Edit mode activated'

  @keyboard-hold-sequence @whoops
  Scenario: Keyboard hold and release sequence
    When the user holds down the Shift key
    And the user uses the item button on the page
    And the user releases the Shift key
    Then the selection text on the page says 'Multi-select enabled'

  @basic-interactions @whoops @smoke
  Scenario: Element-based actions and basic assertions
    When the user clicks the login button on the form
    And the user fills the email input on the form with a valid email address
    And the user fills the password input on the form with 'secure123'
    And the user selects 'Premium Plan' from the plan dropdown on the form
    And the user presses Enter
    Then the user is on the success page
    And the user sees success text on the page that says 'Submitted successfully'

  @mouse-drag @whoops
  Scenario: Mouse drag operation
    When the user drags the mouse from position 100, 100 to position 300, 300
    Then the success text on the notification says 'Zoom area has been set'

  @mouse-click-sequence @whoops
  Scenario: Mouse position, press, and release sequence
    When the user moves the mouse to position 150, 200
    And the user presses the left mouse button
    And the user presses the 'p' key
    And the user releases the left mouse button
    Then the point is marked successfully

  @mouse-single-and-double-click @whoops
  Scenario: Coordinate-based double-click
    When the user clicks at position 250, 50
    And the user double-clicks at position 250, 100
    Then the distance text on the modal says 'Distance between these points is 50'
    When the user clicks at position 300, 150

  @scrolling
  Scenario: User scrolls on the page
    When the user scrolls down 200 pixels
    And the user scrolls right 75 pixels
    Then the position text on the page says "You scrolled to the southeast"

  @page-reload
  Scenario: Page reload action
    When the user clicks the refresh link in the nav
    And the page reloads
    Then the status text in the header says 'Page refreshed'

  @hover-action
  Scenario: Hover interaction
    When the user hovers over the info button on the card
    Then the tooltip text on the card says 'Additional information'
