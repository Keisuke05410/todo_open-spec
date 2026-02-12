## ADDED Requirements

### Requirement: User can restore a deleted task to active list
The system SHALL allow users to move a task from the deleted tasks list back to the active task list while preserving its original data and deletion timestamp.

#### Scenario: Restore deleted task to active list
- **WHEN** user restores a deleted task
- **THEN** system moves the task to the active list and removes it from the deleted tasks list

#### Scenario: Restored task preserves all original data
- **WHEN** user restores a deleted task
- **THEN** system preserves the task's text, completion status, creation timestamp, and deletion timestamp

#### Scenario: Restored task can be edited and toggled
- **WHEN** user restores a deleted task
- **THEN** system allows the task to be edited, completion status toggled, and deleted again like any active task

#### Scenario: Restore operation persists across page reload
- **WHEN** user restores a deleted task and reloads the page
- **THEN** system loads the task in the active list with all data intact

#### Scenario: Restored task retains deletion history
- **WHEN** user restores a task that was previously deleted
- **THEN** system keeps the deletedAt timestamp field for audit purposes
