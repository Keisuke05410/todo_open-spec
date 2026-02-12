## Why

Currently, when users delete a todo task, it's permanently removed from the application with no way to review or recover it. This creates anxiety around deletion and makes it difficult to undo accidental deletions or review completed work history.

## What Changes

- Add a "deleted tasks" view where users can see all previously deleted todos
- Modify the delete operation to move tasks to a deleted state rather than permanently removing them
- Add UI controls to access and navigate the deleted tasks view
- Store deleted tasks in localStorage with deletion timestamp metadata

## Capabilities

### New Capabilities
- `deleted-tasks-view`: View and display all deleted todo tasks with deletion timestamps

### Modified Capabilities
- `task-management`: Deletion behavior changes from permanent removal to soft-delete (moving to deleted state)

## Impact

- Storage module: Add methods for managing deleted tasks separately from active tasks
- State module: Modify delete operation to mark tasks as deleted rather than removing them
- UI module: Add new view/page for displaying deleted tasks, add navigation controls
- localStorage schema: Add deleted tasks storage alongside active tasks
