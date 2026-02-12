## Why

Currently, deleted tasks can only be viewed but not recovered or permanently removed. Users have no way to restore accidentally deleted tasks or clean up the trash to free storage space. This change adds essential trash management capabilities to provide users full control over their deleted tasks.

## What Changes

- Add restore functionality to recover deleted tasks back to the active task list
- Add permanent delete functionality to remove tasks completely from storage
- Make deleted tasks interactive with restore and permanent delete buttons
- Maintain deletion timestamp when restoring tasks to preserve history

## Capabilities

### New Capabilities
- `trash-operations`: Handles restore and permanent delete operations for deleted tasks, including UI controls and storage updates

### Modified Capabilities
- `deleted-tasks-view`: Add interactive controls (restore and permanent delete buttons) to the currently read-only deleted tasks display
- `task-management`: Extend with restore operation to move tasks from deleted state back to active state

## Impact

- **State Module** (`src/state.js`): Add `restoreTask()` and `permanentDeleteTask()` methods
- **Storage Module** (`src/storage.js`): Add methods to update tasks in deleted storage and permanently remove tasks
- **UI Module** (`src/ui.js`): Add interactive buttons to deleted tasks view, add event handlers for restore and permanent delete actions
- **localStorage**: Additional operations for updating and removing deleted tasks data
