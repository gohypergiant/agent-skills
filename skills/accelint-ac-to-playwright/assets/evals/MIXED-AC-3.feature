@comprehensive-test @automation-ready
Feature: Comprehensive action and assertion coverage

  Background:
    Given the user is on the test page

  @keyboard-hold-sequence
  Scenario: Keyboard hold and release sequence
    When the user holds down the Shift key
    And the user uses the item button on the page
    And the user releases the Shift key
    Then the selection text on the page says 'Multi-select enabled'

  @mouse-click-sequence
  Scenario: Mouse position, press, and release sequence
    When the user moves the mouse to position 150, 200
    And the user presses the left mouse button
    And the user presses the 'p' key
    And the user releases the left mouse button
    Then the point is marked successfully
