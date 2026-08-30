Feature: 2.0 Habit Management
    As a habit-builder
    I want to add habits quickly, correct my mistakes clearly, and put habits aside without losing them
    So that tracking a habit never feels like more effort than the habit itself


# --------------------------------------------------------------------------------------------------
# Adding Habits
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-02-AZYrPMQ] The web application shall create a new active habit when the user submits a non-empty habit name
    Given the user has typed "Drink 8 glasses of water" into the add-habit input
    When the user submits the add-habit form
    Then a new habit card should appear in the Active habits view with the name "Drink 8 glasses of water"
    And the new card should show a streak of 0 and an unchecked "done today" state
    And the add-habit input should be cleared

Scenario: [TOR-02-JpqY5bM] The web application shall reject an empty habit name with an inline error naming the problem and the next action, and shall log the rejection at WARN level
    Given the add-habit input is empty
    When the user submits the add-habit form
    Then an inline error message reading "Habit name cannot be empty. Enter a name to add this habit." should be displayed
    And no new habit card should be added to the Active habits view
    And the browser console should log a WARN-level message referencing the empty habit name submission

Scenario: [TOR-02-ndFJ4Ap] The web application shall treat a whitespace-only habit name the same as an empty habit name
    Given the add-habit input contains only space characters
    When the user submits the add-habit form
    Then the same inline error message used for an empty habit name should be displayed
    And no new habit card should be added to the Active habits view

Scenario: [TOR-02-K6frDEV] The web application shall trim leading and trailing whitespace from a submitted habit name before displaying it
    Given the user has typed "  Morning run  " into the add-habit input
    When the user submits the add-habit form
    Then the new habit card should display the name "Morning run" with no leading or trailing whitespace


# --------------------------------------------------------------------------------------------------
# Archiving & Unarchiving
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-02-KlyaxwN] The web application shall move a habit out of the active list when the user archives it
    Given an active habit named "Learn Spanish" exists
    When the user clicks the Archive control on the "Learn Spanish" card
    Then "Learn Spanish" should no longer appear in the Active habits view
    And "Learn Spanish" should appear when the user switches to the Archived habits view

Scenario: [TOR-02-Mg4RM5f] The web application shall restore a habit to the active list when the user unarchives it
    Given a habit named "Learn Spanish" is archived
    When the user switches to the Archived habits view and clicks the Unarchive control on the "Learn Spanish" card
    Then "Learn Spanish" should no longer appear in the Archived habits view
    And "Learn Spanish" should appear when the user switches back to the Active habits view


# --------------------------------------------------------------------------------------------------
# Filtering Active vs. Archived
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-02-0pLwEQO] The web application shall show the Active habits view by default on load
    Given the user has both active and archived habits stored
    When the app loads and no filter has yet been explicitly chosen this session
    Then the displayed view should be "Active", not "Archived"

Scenario: [TOR-02-HJLw37V] The web application shall visibly indicate which filter view is currently selected
    Given the user is viewing the Active habits view
    When the user clicks the "Archived" filter control
    Then the "Archived" filter control should be visibly marked as the selected view
    And the "Active" filter control should no longer be visibly marked as selected

Scenario: [TOR-02-oIU87Ri] The web application shall exclude active habits from the Archived view
    Given the user has at least one active habit and at least one archived habit
    When the user switches to the Archived habits view
    Then only archived habits should be listed
    And none of the active habits should appear
