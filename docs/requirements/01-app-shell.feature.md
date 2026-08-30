Feature: 1.0 App Shell & Diagnostics
    As a habit-builder
    I want the app to clearly show its version, log its own startup, and guide me when a view is empty
    So that I always know what I'm running, trust that it started correctly, and am never confused by a blank screen


# --------------------------------------------------------------------------------------------------
# Version & Startup Diagnostics
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-01-iavJayH] The web application shall display its name and semantic version in the application footer, matching the version field in package.json
    #
    # Note:
    #   1. This single Scenario verifies both the "Version exposure" and "Version single source
    #      of truth" Tool Hygiene conventions in CLAUDE.md, since the observable check (footer
    #      text equals "Summit v" + package.json's version field) demonstrates both at once.
    #
    Given the app is loaded in a browser
    When the user views the page footer
    Then the footer should contain a string matching /^Summit v\d+\.\d+\.\d+$/
    And the version number in that string should equal the "version" field in package.json

Scenario: [TOR-01-GgOc6Zf] The web application shall emit a log line on application startup containing its name and semantic version at INFO level, in human-readable plain text
    Given the app is loaded in a browser with the developer console open
    When the page finishes its initial render
    Then the first console message emitted by the app should be an INFO-level message matching /^Summit v\d+\.\d+\.\d+ starting$/
    And that message should be plain text, not JSON or a serialized object


# --------------------------------------------------------------------------------------------------
# Empty States
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-01-Ykw9Mz4] The web application shall display guidance text and an add-habit input when the active habits list is empty
    Given the user has no active habits (first-ever visit or all habits archived)
    When the user views the Active habits view
    Then the page should display guidance text inviting the user to add their first habit
    And an "Add a habit" text input with a submit control should be visible

Scenario: [TOR-01-sSCWJrZ] The web application shall display guidance text when the archived habits list is empty
    Given the user has zero archived habits
    When the user switches to the Archived habits view
    Then the page should display guidance text indicating there are no archived habits yet


# --------------------------------------------------------------------------------------------------
# Responsive Layout
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-01-8FCo9h7] The web application shall render a functional habit-list UI at a mobile viewport width
    Given the app is loaded in a browser viewport of width 375px (mobile)
    When the user views the Active habits view
    Then the add-habit input and the done-today control on each habit card should be visible and clickable

Scenario: [TOR-01-7ED8QkP] The web application shall render a functional habit-list UI at a desktop viewport width
    Given the app is loaded in a browser viewport of width 1280px (desktop)
    When the user views the Active habits view
    Then the add-habit input and the done-today control on each habit card should be visible and clickable


# --------------------------------------------------------------------------------------------------
# Single-Screen Layout
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-01-WZ9rUhS] The web application shall present the add-habit input, the active/archived filter, and the habit list on a single page with no separate navigation pages
    Given the app is loaded at its root URL
    When the user adds a habit, marks one done, archives one, and switches between the Active and Archived views
    Then the browser's URL should remain unchanged throughout
    And no additional navigation menu beyond the Active/Archived filter control should be present on the page
