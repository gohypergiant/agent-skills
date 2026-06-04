@comprehensive-test @automation-ready
Feature: Real world AC not ready for conversion

  Background:
    Given these real world AC were shared with us by a PM
    And we're grateful to have them for this evaluation
    And we expect these to be "bad" for the Playwright skill to process
    But they are perfectly fine for humans to use

  Scenario 1
  GIVEN a floating card component is used in JERIC2O
  WHEN the developer specifies a fixed default location
  THEN the fixed card will open in the specified location

  Scenario 2
  GIVEN a floating card is open in JERIC2O
  WHEN either the right drawer or the left drawer opens
  THEN the floating card position will shift and avoid collision

  Scenario 3
  GIVEN a drawer is open in JERIC2O
  WHEN a floating card who's fixed default location is opened that would otherwise collide with the drawer
  THEN the floating card will open to a shifted location to avoid collision with the open drawer


Feature: Display Event Trajectories on the COP
  Background:
    Given Event trajectory data is available
    And trajectory data includes:
      | Field                        |
      | trajectory.start_latitude   |
      | trajectory.start_longitude  |
      | trajectory.end_latitude     |
      | trajectory.end_longitude    |
      | trajectory.start_altitude   |
      | trajectory.end_altitude     |
  Scenario: Display trajectory when an Event is selected
    Given an Event with trajectory data is displayed on the COP
    When the user selects the Event
    Then the corresponding trajectory should display on the map
    And the trajectory should represent the Event track history
  Scenario: Map trajectory using start and end coordinates
    Given an Event contains valid trajectory coordinate data
    When the trajectory is rendered on the COP
    Then the trajectory should begin at trajectory.start_latitude and trajectory.start_longitude
    And the trajectory should end at trajectory.end_latitude and trajectory.end_longitude
  Scenario: Render trajectory altitude information
    Given an Event contains trajectory altitude data
    When the trajectory is displayed in 3D mode
    Then the trajectory should use trajectory.start_altitude for the starting elevation
    And the trajectory should use trajectory.end_altitude for the ending elevation
  Scenario: Handle missing trajectory altitude data
    Given an Event contains start and end coordinates but missing altitude data
    When the trajectory is displayed
    Then the trajectory should still render on the COP
    And the system should use default or ground-level altitude behavior
    And the trajectory display should not fail
  Scenario: Do not display trajectory for Events without trajectory data
    Given an Event does not contain trajectory data
    When the user selects the Event
    Then no trajectory should be displayed
    And the system should not produce an error


Feature: Enable Ephemeral Builds

  Background:
    Given a feature or ticket is ready to build

  Scenario: Start an ephemeral automated build
    When the build starts
    Then a new ephemeral build environment is created
    And source code is pulled into the build environment
    And project dependencies are installed in the build environment
    And the build runs automatically
    And automated tests run automatically
    And build results are saved
    And build artifacts are saved

  Scenario: Delete the ephemeral environment after build completion
    Given the build has started in an ephemeral build environment
    When the build completes
    Then the ephemeral build environment is deleted completely
    And no running container exists for the completed build
    And no temporary build resources remain
