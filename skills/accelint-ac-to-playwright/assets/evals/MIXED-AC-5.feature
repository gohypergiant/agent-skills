@comprehensive-test @automation-ready
Feature: Comprehensive action and assertion coverage

  Background:
    Given the user is on the test page

  @visibility-changes missing-at-symbol @smoke
  Scenario: Multiple visibility state changes
    When the user clicks the toggle-interface button on the page
    Then the settings panel div on the drawer appears
    And the welcome text on the modal appears
    And the tutorial text on the card disappears

  @mouse-single-and-double-click
  Scenario: Coordinate-based double-click
    When the user clicks at position 250, 50
    And the user double-clicks at position 250, 100
    Then the distance text on the modal says 'Distance between these points is 50'
    When the user clicks at position 300, 150