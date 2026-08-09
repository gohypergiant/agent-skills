@comprehensive-test @automation-ready @tc025 @tc036

  Background:
    Given the user is on the test page
    Then the user clicks the ready button on the page

  @visibility-changes missing-at-symbol @smoke @tc001
  Scenario: Multiple visibility state changes
    When the user clicks the toggle-interface button on the page
    Then the settings panel div on the drawer appears
    And the welcome text on the modal appears
    And the tutorial text on the card disappears

  @mouse-single-and-double-click @tc007
  Scenario: Coordinate-based double-click
    When the user clicks at position 250, 50
    And the user double-clicks at position 250, 100
    Then the distance text on the modal says 'Distance between these points is 50'
    When the user clicks at position 300, 150

  @forms @tc021
  Scenario: User submits feedback form successfully
    When the user fills the comment input on the form with 'Great product'
    And the user clicks the submit button on the form, the confirmation text on the toast says 'Feedback received'

  @forms @tc023
  Scenario Outline: User login with different credentials
    When the user fills the username input on the form with '<username>'
    And the user fills the password input on the form with '<password>'
    And the user clicks the login button on the form
    Then the message text on the page says '<message>'

  @forms @tc024
  Scenario Outline: User login with admin and guest credentials
    When the user fills the username input on the form with '<username>'
    And the user fills the password input on the form with '<password>'
    And the user clicks the login button on the form
    Then the message text on the page says '<message>'

    Examples:
      | user     | pass     | message          |
      | admin    | pass123  | Welcome admin    |
      | guest    | guest99  | Welcome guest    |

  @forms @tc026
  Scenario: User submits feedback form
    And the user fills the comment input on the form with 'Great product'
    And the user clicks the submit button on the form
    Then the confirmation text on the toast says 'Feedback received'
