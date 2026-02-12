## ADDED Requirements

### Requirement: User can view deleted tasks
The system SHALL display all deleted tasks in a dedicated deleted tasks view, showing their text, completion status, and deletion timestamp.

#### Scenario: View deleted tasks when none exist
- **WHEN** user switches to deleted tasks view and no tasks have been deleted
- **THEN** system displays an empty state message indicating no deleted tasks

#### Scenario: View deleted tasks list
- **WHEN** user switches to deleted tasks view and deleted tasks exist
- **THEN** system displays all deleted tasks with their original text, marked as completed, and showing deletion timestamp for each

#### Scenario: Deleted tasks are read-only
- **WHEN** user views a deleted task
- **THEN** system displays the task without interactive controls (no toggle, edit, or delete actions)

### Requirement: User can switch between active and deleted task views
The system SHALL provide navigation controls to toggle between viewing active tasks and deleted tasks.

#### Scenario: Switch to deleted tasks view
- **WHEN** user clicks or activates the deleted tasks view control
- **THEN** system hides active tasks and displays the deleted tasks list

#### Scenario: Switch back to active tasks view
- **WHEN** user clicks or activates the active tasks view control from deleted tasks view
- **THEN** system hides deleted tasks and displays the active tasks list

#### Scenario: View state persists across actions
- **WHEN** user performs an action (such as deleting a task) while viewing active tasks
- **THEN** system remains on the active tasks view after the action completes

### Requirement: Deleted tasks display deletion timestamp
The system SHALL show when each task was deleted using a human-readable timestamp format.

#### Scenario: Display deletion timestamp
- **WHEN** user views a deleted task
- **THEN** system displays the date and time when the task was deleted in a readable format

#### Scenario: Deleted tasks ordered chronologically
- **WHEN** user views deleted tasks list
- **THEN** system displays tasks in order with most recently deleted tasks appearing first
