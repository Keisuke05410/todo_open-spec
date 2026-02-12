## ADDED Requirements

### Requirement: User can restore a deleted task
The system SHALL allow users to restore a deleted task back to the active task list while preserving its deletion timestamp.

#### Scenario: Restore deleted task
- **WHEN** user clicks restore button on a deleted task
- **THEN** system moves the task to the active list, preserves its deletedAt timestamp, and updates the display to show the task in the active view

#### Scenario: Restored task maintains original data
- **WHEN** user restores a deleted task
- **THEN** system preserves the task's original text, completion status, creation timestamp, and deletion timestamp

#### Scenario: Restore task and persist change
- **WHEN** user restores a deleted task and reloads the page
- **THEN** system loads the task in the active list with all data preserved including deletion timestamp

#### Scenario: Restore task updates view automatically
- **WHEN** user restores a deleted task while viewing deleted tasks
- **THEN** system removes the task from deleted tasks view and it appears in active tasks view

### Requirement: User can permanently delete a task
The system SHALL allow users to completely remove a deleted task from storage after confirmation.

#### Scenario: Permanent delete with confirmation
- **WHEN** user clicks permanently delete button on a deleted task
- **THEN** system displays a confirmation dialog warning that the action cannot be undone

#### Scenario: Confirm permanent delete
- **WHEN** user confirms the permanent delete action
- **THEN** system removes the task completely from storage and updates the deleted tasks view

#### Scenario: Cancel permanent delete
- **WHEN** user cancels the permanent delete confirmation dialog
- **THEN** system keeps the task in deleted tasks list without any changes

#### Scenario: Permanently deleted task does not persist
- **WHEN** user permanently deletes a task and reloads the page
- **THEN** system does not load the task from storage as it has been completely removed

#### Scenario: Permanent delete updates view automatically
- **WHEN** user permanently deletes a task while viewing deleted tasks
- **THEN** system removes the task from the deleted tasks view immediately

### Requirement: Trash operations provide user feedback
The system SHALL display clear feedback and confirmation messages for restore and permanent delete actions.

#### Scenario: Restore action provides feedback
- **WHEN** user successfully restores a deleted task
- **THEN** system displays a notification confirming the task was restored

#### Scenario: Permanent delete requires explicit warning
- **WHEN** user initiates permanent delete action
- **THEN** system displays confirmation dialog with clear warning text that the action cannot be undone

#### Scenario: Permanent delete confirmation provides feedback
- **WHEN** user completes permanent delete action
- **THEN** system displays notification confirming the task was permanently deleted
