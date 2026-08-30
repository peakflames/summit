Feature: 3.0 Daily Check-In & Streaks
    As a habit-builder
    I want a single tap to record today's progress and an honest, prominent streak count
    So that I feel immediate momentum when I'm consistent and see the truth when I'm not


# --------------------------------------------------------------------------------------------------
# Marking Done
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-03-UZhr9Mh] The web application shall set a habit's streak to 1 when it is marked done for the first time
    Given a habit with streak 0 that has never been marked done
    When the user clicks the done-today control on that habit's card
    Then the habit's streak should display as 1
    And the habit's card should show a "done today" state

Scenario: [TOR-03-Gsh2K2S] The web application shall increment a habit's streak by 1 when it is marked done on the day immediately following its last completion
    Given a habit whose last completed date was yesterday and whose streak is N
    When the user clicks the done-today control on that habit's card
    Then the habit's streak should display as N + 1

Scenario: [TOR-03-OAytR7l] The web application shall not change a habit's streak if it is already marked done for today
    Given a habit that has already been marked done today, with streak N
    When the user clicks the done-today control on that habit's card again
    Then the habit's streak should still display as N
    And no duplicate completion should be recorded for today

Scenario: [TOR-03-s6tFG4V] The web application shall reset a habit's streak to 1, not increment it, when it is marked done after one or more missed days
    Given a habit whose last completed date was 3 or more days ago and whose streak is N greater than 0
    When the user clicks the done-today control on that habit's card
    Then the habit's streak should display as 1, not N + 1


# --------------------------------------------------------------------------------------------------
# Streak Recalculation & Display
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-03-TSlF7BH] The web application shall recalculate a habit's streak to 0 on load if a day was missed since its last completion
    Given stored habit data where a habit's last completed date is 2 or more days before today and its stored streak is N greater than 0
    When the app loads
    Then that habit's displayed streak should be 0, without requiring any user interaction
    And the habit's "done today" state should display as not done

Scenario: [TOR-03-sX0EJEU] The web application shall display each habit's streak count as a visually prominent element on its card
    Given a habit with a streak of 5
    When the user views the Active habits view
    Then the streak value "5" should be rendered with greater visual weight (e.g., larger size or bolder styling) than the habit's name text on the same card

Scenario: [TOR-03-b2dynoV] The web application shall render a visually distinct state for a habit marked done today versus one not yet marked done
    Given one habit marked done today and one habit not yet marked done today
    When the user views the Active habits view
    Then the done-today control's visual state (e.g., fill or color) should differ observably between the two cards, such that a viewer can distinguish "done" from "not done" at a glance
