Feature: 4.0 Local Persistence
    As a habit-builder
    I want my habits and progress to be exactly where I left them, with no account and no connection
    So that I can trust the app completely without ever worrying about signing in or losing my data


# --------------------------------------------------------------------------------------------------
# Save on Mutation
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-04-NuPmtfe] The web application shall write the full habit dataset to localStorage immediately after any habit mutation
    Given the app is loaded with an existing set of habits
    When the user adds, marks done, archives, or unarchives a habit
    Then the app's namespaced localStorage key should contain the updated habit dataset reflecting that change before the next user action is possible


# --------------------------------------------------------------------------------------------------
# Load and Recalculate on Startup
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-04-8EEMGia] The web application shall restore the full habit list from localStorage on reload with no data loss
    Given localStorage contains a set of habits with specific names, streaks, and archived states
    When the browser page is refreshed
    Then every habit's name and archived state should render identically to before the refresh
    And every habit's streak should render identically to before the refresh, subject only to missed-day recalculation

Scenario: [TOR-04-LJb5Y0a] The web application shall initialize an empty habit list without error when no prior data exists
    Given localStorage contains no data for this app's namespaced key (first-ever visit)
    When the app loads
    Then the app should render the empty active-habits guidance state
    And no error should appear in the browser console


# --------------------------------------------------------------------------------------------------
# Offline Operation
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-04-tBD0NqR] The web application shall perform all habit operations without issuing any network requests
    Given the app is loaded in a browser with network request logging enabled
    When the user adds a habit, marks it done, archives it, and unarchives it in sequence
    Then zero network (XHR/fetch) requests should be recorded for any of those actions
