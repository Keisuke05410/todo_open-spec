## 1. Storage Module Updates

- [ ] 1.1 Add `saveDeletedTasks(tasks)` function to persist deleted tasks to localStorage under `deletedTasks` key
- [ ] 1.2 Add `loadDeletedTasks()` function to retrieve deleted tasks from localStorage with error handling
- [ ] 1.3 Initialize `deletedTasks` as empty array if key doesn't exist on first load

## 2. State Module Updates

- [ ] 2.1 Modify `deleteTask(id)` to implement soft-delete: add `deletedAt` timestamp, append to deleted tasks array, remove from active tasks
- [ ] 2.2 Add `getDeletedTasks()` function to return all deleted tasks sorted by deletion timestamp (most recent first)
- [ ] 2.3 Update state initialization to load both active and deleted tasks from storage

## 3. UI Module - View Toggle Controls

- [ ] 3.1 Add HTML structure for view toggle tabs (Active Tasks / Deleted Tasks) above task list
- [ ] 3.2 Add event listeners for view toggle using existing event delegation pattern
- [ ] 3.3 Implement view state management to track current view (active vs deleted)
- [ ] 3.4 Add CSS styling for active/inactive tab states

## 4. UI Module - Deleted Tasks Rendering

- [ ] 4.1 Create `renderDeletedTasks()` function to render deleted tasks list
- [ ] 4.2 Modify deleted task rendering to show read-only state (no toggle, edit, or delete buttons)
- [ ] 4.3 Add deletion timestamp display with human-readable format (e.g., "Deleted on Jan 15, 2026 at 3:45 PM")
- [ ] 4.4 Apply visual styling to deleted tasks (muted colors, all shown as completed/checked)
- [ ] 4.5 Add empty state message for when no deleted tasks exist

## 5. UI Module - View Switching Logic

- [ ] 5.1 Implement `showActiveView()` function to hide deleted tasks and show active tasks list
- [ ] 5.2 Implement `showDeletedView()` function to hide active tasks and show deleted tasks list
- [ ] 5.3 Ensure view state persists during user actions (e.g., stay on active view after deleting a task)

## 6. Testing & Verification

- [ ] 6.1 Write tests for soft-delete functionality in State module
- [ ] 6.2 Write tests for deleted tasks retrieval and sorting
- [ ] 6.3 Write tests for localStorage persistence of deleted tasks
- [ ] 6.4 Verify view toggle functionality with Playwright MCP (click tabs, verify correct lists shown)
- [ ] 6.5 Verify deleted task rendering with Playwright MCP (check read-only state, timestamps, styling)
- [ ] 6.6 Test edge cases: empty states, deleting last task, page reload persistence
