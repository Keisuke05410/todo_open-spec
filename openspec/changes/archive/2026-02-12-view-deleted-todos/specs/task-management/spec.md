## MODIFIED Requirements

### Requirement: User can delete a task
The system SHALL allow users to soft-delete a task, moving it from the active task list to the deleted tasks list with a deletion timestamp.

#### Scenario: Delete a task
- **WHEN** user selects delete action for a task
- **THEN** system removes the task from the active list, adds a deletion timestamp, and moves it to the deleted tasks list

#### Scenario: Delete last remaining task
- **WHEN** user deletes the only task in the active list
- **THEN** system displays empty state for active tasks and the deleted task appears in deleted tasks view

#### Scenario: Deleted task persists in storage
- **WHEN** user deletes a task and reloads the page
- **THEN** system loads the task from deleted tasks storage with its deletion timestamp preserved
