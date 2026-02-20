@smoke
Feature: Basic functionality

  Scenario: User changes circle color from settings
    Given the user is on the settings page
    When the user selects "Pink" in the color choice dropdown on the page
    Then the pink circle div on the page is visible
    And the plain circle div on the page is not visible

  Scenario: User submits name and sees welcome message
    Given the user is on the home page
    When the user fills the fname input on the page with "Harry Potter"
    And the user clicks the submit button on the page
    Then the fname output text on the page says "Hello, Harry Potter."
