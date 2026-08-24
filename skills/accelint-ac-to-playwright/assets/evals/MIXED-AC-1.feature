@mixed-ac @slice-1
Feature: Account management scenarios of mixed conversion readiness

  Background:
    Given the user is on the account page

  missing-at-symbol
  Scenario: User updates the display name
    When the user fills the display-name input on the form with 'Commander Vale'
    And the user clicks the Save button on the form
    Then the confirmation text in a toast says 'Profile updated'

  @notifications @smoke
  Scenario: User enables email notifications
    When the user clicks the notifications checkbox on the form
    And the user clicks the Save button on the form
    Then the status text in the header says 'Notifications enabled'

  # The step below uses a vague action verb that maps to no Playwright action.
  @appearance
  Scenario: User switches the color theme
    When the user uses the theme dropdown on the form
    Then the theme text on the page says 'Dark mode on'

  # The email value below is described instead of given as a quoted literal.
  @recovery
  Scenario: User requests a password reset
    When the user clicks the forgot-password link on the form
    And the user fills the email input on the form with a valid email address
    And the user clicks the send-reset button on the form
    Then the confirmation text in a toast says 'Reset email sent'

  @sessions
  Scenario: User reviews active sessions
    When the user clicks the sessions link in the nav
    And the user clicks the refresh button on the page

  @billing
  Scenario: User changes the billing plan
    When the user clicks the billing link in the nav
    And the user clicks the upgrade option
    Then the plan text on the card says 'Premium'

  @export
  Scenario: User exports account data
    When the user clicks the export button on the form
    Then the page looks correct

  @signout
  Scenario: User signs out
    When the user clicks the sign-out button in the nav
    Then the user is on the login page
    And the goodbye text on the page says 'Signed out'
    When the user clicks the sign-in link on the page
