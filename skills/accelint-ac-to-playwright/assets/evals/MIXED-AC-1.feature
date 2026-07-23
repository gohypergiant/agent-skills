@comprehensive-test @automation-ready
Feature: Comprehensive action and assertion coverage

  Background:
    Given the user is on the test page

  @keyboard-modifier-combo @tc001
  Scenario: Keyboard modifier combination
    When the user presses Shift+e
    Then the text on the header says 'Edit mode activated'

  @mouse-drag @tc005
  Scenario: Mouse drag operation
    When the user drags the mouse from position 100, 100 to position 300, 300
    Then the success text on the notification says 'Zoom area has been set'

  @page-reload @tc008
  Scenario: Page reload action
    When the user clicks the refresh in the nav
    And the page reloads
    Then the status text in the header says 'Page refreshed'

  @hover-action @tc010
  Scenario: Hover interaction
    When the user hovers over the info button on the card
    Then the card tooltip text says 'Additional information'
