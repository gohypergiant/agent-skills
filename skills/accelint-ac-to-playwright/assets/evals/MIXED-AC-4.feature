@comprehensive-test @automation-ready
Feature: Comprehensive action and assertion coverage

  Background:
    Given the user is on the test page

  @basic-interactions @smoke @tc004
  Scenario: Element-based actions and basic assertions
    When the user clicks the login button on the form
    And the user fills the email input on the form with a valid email address
    And the user fills the password input on the form with 'secure123'
    And the user selects 'Premium Plan' from the plan dropdown on the form
    And the user presses Enter
    Then the user is on the success page
    And the user sees success text on the page that says 'Submitted successfully'
