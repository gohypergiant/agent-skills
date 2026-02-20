@navigation
Feature: Site navigation

  @smoke 
  Scenario: User navigates to the settings page
    Given the user is on the home page
    When the user clicks the settings link in the header
    Then the user is on the settings page
    And the page heading text in the header says "Settings"

  @regression @wip
  Scenario: User navigates to the home page
    Given the user is on the settings page
    When the user clicks the home link in the header
    Then the user is on the home page
    And the page heading text in the header says "Home"