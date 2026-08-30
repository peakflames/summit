Feature: 5.0 Visual Design
    As a habit-builder
    I want the app to look and feel like a considered, single coherent product, not a bare unstyled page
    So that I trust the tool the moment I open it, and can always tell at a glance what's interactive, what's primary, and what's already selected


# --------------------------------------------------------------------------------------------------
# Brand Canvas & Typography
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-05-N8OUVWo] The web application shall render its interface on a dark, obsidian-toned canvas using the PeakFlames Design System's brand type ramp
    #
    # Note:
    #   1. "Brand type ramp" means Archivo for display/heading text and IBM Plex Sans for body
    #      text, as vendored from the PeakFlames Design System token CSS — not a system-ui
    #      fallback stack.
    #
    Given the app is loaded in a browser with the PeakFlames Design System fonts available
    When the user views the page
    Then the page background color should be a dark obsidian tone, not a light/off-white tone
    And the page's heading text should render in the Archivo font family
    And the page's body text should render in the IBM Plex Sans font family


# --------------------------------------------------------------------------------------------------
# Hierarchy & Accent Discipline
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-05-G4eM1DW] The web application shall render exactly one flame-accented "hot" element per view, reserved for the primary action
    #
    # Note:
    #   1. This is the "one hot element per view" rule from the PeakFlames Design System,
    #      expressed as an observable constraint: the add-habit submit button (Active view) or
    #      a habit's done-today control carries the flame accent; no other control on the same
    #      view shares that treatment.
    #
    Given the app is loaded and displaying the Active habits view
    When the user views the page
    Then exactly one control on the page should carry the flame-accent (primary) visual treatment
    And all other controls should use a non-flame visual treatment

Scenario: [TOR-05-3wxnhPe] The web application shall display a visible focus ring on any interactive control when it receives keyboard focus
    Given the app is loaded in a browser
    When the user tabs through the add-habit input, the filter buttons, and a habit card's controls using the keyboard
    Then each focused control should display a visible focus ring
    And the focus ring should remain visible until focus moves to another control


# --------------------------------------------------------------------------------------------------
# Filter Selection State
# --------------------------------------------------------------------------------------------------

Scenario: [TOR-05-YsmGKT9] The web application shall indicate the currently selected Active/Archived filter using the PeakFlames Design System's ember gradient treatment
    Given the app is loaded and the Active filter is selected
    When the user switches to the Archived filter
    Then the Archived filter control should display the ember gradient selection treatment
    And the Active filter control should no longer display the ember gradient selection treatment
