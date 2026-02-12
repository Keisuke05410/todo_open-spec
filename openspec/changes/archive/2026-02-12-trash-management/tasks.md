## 1. Storage Module - Add Trash Operations

- [x] 1.1 Add `removeFromDeletedTasks(taskId)` method to permanently remove a task from deleted tasks array in localStorage
- [x] 1.2 Add `moveTaskToActive(taskId)` method to move a task from deleted array to active array in localStorage
- [x] 1.3 Add error handling for QuotaExceededError and SecurityError in new storage methods
- [x] 1.4 Write unit tests for `removeFromDeletedTasks` method covering success and error cases
- [x] 1.5 Write unit tests for `moveTaskToActive` method covering success and error cases

## 2. State Module - Implement Restore and Permanent Delete

- [x] 2.1 Add `restoreTask(taskId)` method to move task from deleted to active state
- [x] 2.2 Ensure `restoreTask` preserves task's deletedAt timestamp for audit trail
- [x] 2.3 Add `permanentDeleteTask(taskId)` method to remove task completely from state
- [x] 2.4 Update task filtering logic to handle tasks with deletedAt timestamp in active view
- [x] 2.5 Write unit tests for `restoreTask` verifying data preservation and state updates
- [x] 2.6 Write unit tests for `permanentDeleteTask` verifying complete removal

## 3. UI Module - Add Interactive Trash Controls

- [x] 3.1 Add "Restore" button to deleted task rendering with appropriate CSS class
- [x] 3.2 Add "Permanently Delete" button to deleted task rendering with destructive styling
- [x] 3.3 Position buttons in correct order (Restore first, Permanently Delete second)
- [x] 3.4 Add event delegation handler for restore button clicks in deleted tasks view
- [x] 3.5 Add event delegation handler for permanent delete button clicks with confirmation dialog
- [x] 3.6 Implement browser confirmation dialog with clear warning text for permanent delete
- [x] 3.7 Add success notification for restore action
- [x] 3.8 Add success notification for permanent delete action
- [x] 3.9 Update `renderDeletedTasks()` to trigger re-render after restore/permanent delete operations
- [x] 3.10 Ensure keyboard accessibility (tab navigation) for new action buttons

## 4. Integration and Testing

- [x] 4.1 Test restore flow: delete task → view in trash → restore → verify in active list
- [x] 4.2 Test restore preserves deletedAt timestamp after page reload
- [x] 4.3 Test permanent delete with confirmation: delete task → permanently delete → confirm → verify removed
- [x] 4.4 Test permanent delete cancellation: start permanent delete → cancel → verify task remains
- [x] 4.5 Test permanent delete removes task after page reload
- [x] 4.6 Test view updates automatically after restore (removed from deleted view)
- [x] 4.7 Test view updates automatically after permanent delete (removed from deleted view)
- [x] 4.8 Test restored task can be edited, toggled, and deleted again
- [x] 4.9 Verify localStorage operations don't exceed quota with large task lists
- [x] 4.10 Run Playwright MCP tests to verify UI interactions work correctly in browser
