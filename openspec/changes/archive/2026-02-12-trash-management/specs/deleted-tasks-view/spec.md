## MODIFIED Requirements

### Requirement: Deleted tasks have interactive trash management controls
The system SHALL display deleted tasks with interactive controls for restore and permanent delete actions, replacing the previous read-only display.

#### Scenario: Deleted tasks display restore button
- **WHEN** user views a deleted task
- **THEN** system displays a restore button that allows moving the task back to active list

#### Scenario: Deleted tasks display permanent delete button
- **WHEN** user views a deleted task
- **THEN** system displays a permanent delete button that allows complete removal from storage

#### Scenario: Trash controls are visually distinct
- **WHEN** user views a deleted task
- **THEN** system displays restore as primary action and permanent delete as destructive action with appropriate visual styling

#### Scenario: Deleted tasks still cannot be edited or toggled
- **WHEN** user views a deleted task
- **THEN** system does not display edit or toggle completion controls (only restore and permanent delete are interactive)

## ADDED Requirements

### Requirement: Deleted tasks display action buttons in consistent layout
The system SHALL display restore and permanent delete buttons in a button group with restore appearing before permanent delete.

#### Scenario: Button order prioritizes safe action
- **WHEN** user views a deleted task's action buttons
- **THEN** system displays restore button first (left) and permanent delete button second (right)

#### Scenario: Action buttons are accessible
- **WHEN** user navigates deleted tasks with keyboard
- **THEN** system allows tab navigation to reach restore and permanent delete buttons for each task
