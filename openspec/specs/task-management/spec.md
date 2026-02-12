## ADDED Requirements

### Requirement: User can create a new task
The system SHALL allow users to create a new task with a text description.

#### Scenario: Create task with valid text
- **WHEN** user enters task text and submits
- **THEN** system adds the task to the list with a unique ID, current timestamp, and uncompleted status

#### Scenario: Create task with empty text
- **WHEN** user attempts to submit without entering text
- **THEN** system prevents task creation and prompts user to enter text

### Requirement: User can view all tasks
The system SHALL display all tasks in a list format showing their text and completion status.

#### Scenario: View empty task list
- **WHEN** user opens the application with no existing tasks
- **THEN** system displays an empty state message or empty list

#### Scenario: View task list with items
- **WHEN** user has created one or more tasks
- **THEN** system displays all tasks in creation order with their text and completion status visible

### Requirement: User can mark a task as completed
The system SHALL allow users to toggle a task's completion status.

#### Scenario: Mark uncompleted task as completed
- **WHEN** user clicks or checks a task that is not completed
- **THEN** system marks the task as completed and updates its visual state

#### Scenario: Mark completed task as uncompleted
- **WHEN** user clicks or unchecks a task that is completed
- **THEN** system marks the task as uncompleted and updates its visual state

### Requirement: User can edit a task's text
The system SHALL allow users to modify the text description of an existing task.

#### Scenario: Edit task text successfully
- **WHEN** user selects a task for editing and changes its text
- **THEN** system updates the task's text while preserving its ID, completion status, and timestamp

#### Scenario: Edit task with empty text
- **WHEN** user attempts to save a task with empty text
- **THEN** system prevents the update and prompts user to enter text

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
