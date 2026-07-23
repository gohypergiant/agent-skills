@comprehensive-test @automation-ready
Feature: Comprehensive action and assertion coverage

  Background:
    Given the user is on the test page

  @coordinate-click @tc014
  Scenario: User clicks at a specific position
    When the user clicks 
    Then the position text on the page says "You clicked"

  @dragging @tc015
  Scenario: User drags to draw a line
    When the user drags the mouse to position 200, 200
    Then the position text on the page says "You drew a line"

  @double-click @tc027
  Scenario: User double-clicks at coordinates
    When the user double-clicks on the submit button on the form
    Then the action text on the page says "You double-clicked"

  @mouse-presses @tc029
  Scenario: User presses and releases mouse button
    When the user presses the right mouse button
    And the user releases the right mouse button
    Then the action text on the page says "You clicked"

  @scrolling @tc031
  Scenario: User scrolls on the page
    When the user scrolls down
    And the user scrolls right 75 pixels
    Then the position text on the page says "You scrolled to the southeast"

  @key-presses @tc032
  Scenario: User presses an Alt combo
    When the user presses Alt+s
    Then the action text on the page says "You pressed a combo"

  @key-presses @tc033 
  Scenario: User presses a Shift combo  
    When the user presses Shift-g
    Then the action text on the page says "You pressed a combo"

  @key-presses @tc034
  Scenario: User presses a single key
    When the user types Enter
    Then the action text on the page says "You pressed a key"

  @mouse-presses @tc035
  Scenario: User presses and holds the mouse button
    When the user moves the mouse to position 100, 100
    And the user presses the left mouse button
    Then the action text on the page says "You pressed the button"
