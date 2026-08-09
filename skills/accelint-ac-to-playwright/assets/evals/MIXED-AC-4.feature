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

  @hover @tc013
  Scenario: User hovers to reveal tooltip
    When the user hovers over position 300, 50
    Then the tooltip text on the page appears
    And the tooltip text on the page says "This field is required"

  @dropdown @tc016
  Scenario: User subscribes and then views their subscription page
    When the user selects 'Standard Plan' from the subscription dropdown on the form
    And the user clicks the confirm button on the form
    And the user is on the subscriptions page
    Then the plan text in the table says "Subscription: Standard Plan"

  @dropdown @tc017
  Scenario: User selects from dropdown
    When the user selects Standard Plan from the subscription dropdown on the form
    And the user clicks the confirm button on the form
    Then the confirmation text on the page says "You selected Standard Plan"
