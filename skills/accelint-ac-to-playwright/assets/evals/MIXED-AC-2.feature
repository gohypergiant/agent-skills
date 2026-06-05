@comprehensive-test @automation-ready
Feature: Comprehensive action and assertion coverage

  Background:
    Given the user is on the test page

  @scrolling
  Scenario: User scrolls on the page
    When the user scrolls down
    And the user scrolls right 75 pixels
    Then the position text on the page says "You scrolled to the southeast"
