## Context

The application currently implements permanent deletion of todo tasks. When a user clicks delete, the task is immediately removed from the tasks array in localStorage and re-rendered. There is no mechanism to review, recover, or audit deleted tasks.

The existing architecture uses three modules:
- **Storage Module**: Handles localStorage operations with error handling
- **State Module**: Manages in-memory task state and business logic
- **UI Module**: Handles DOM manipulation and rendering

Current delete flow:
1. User clicks delete button on a task
2. UI module captures event via delegation
3. State module removes task from tasks array
4. Storage module persists updated tasks array
5. UI re-renders the task list

## Goals / Non-Goals

**Goals:**
- Allow users to view all previously deleted tasks with deletion timestamps
- Implement soft-delete: mark tasks as deleted rather than permanently removing them
- Store deleted tasks separately in localStorage
- Add UI navigation to switch between active and deleted task views
- Maintain existing XSS prevention and error handling patterns

**Non-Goals:**
- Restore/undelete functionality (out of scope for this change)
- Search or filtering within deleted tasks
- Expiration or automatic cleanup of old deleted tasks
- Export or archival of deleted tasks

## Decisions

### Decision 1: Separate localStorage Keys for Active and Deleted Tasks

**Choice:** Store deleted tasks in a separate localStorage key (`deletedTasks`) rather than adding a `deleted` flag to tasks in the existing array.

**Rationale:**
- Cleaner separation of concerns
- No impact on existing active task queries
- Easier to implement view toggling without filtering
- Better performance when rendering active tasks (no need to filter out deleted items)

**Alternative Considered:** Single array with `deleted: true` flag
- Rejected: Would require filtering on every render, adds complexity to existing code paths

### Decision 2: Soft Delete Implementation

**Choice:** When deleting a task:
1. Remove from active tasks array
2. Add `deletedAt` timestamp property
3. Append to deleted tasks array
4. Save both arrays to respective localStorage keys

**Rationale:**
- Preserves all original task data
- Timestamp enables chronological display
- Minimal changes to existing delete operation

### Decision 3: View Toggle UI Pattern

**Choice:** Add a tab/toggle control above the task list to switch between "Active Tasks" and "Deleted Tasks" views.

**Rationale:**
- Familiar UI pattern (similar to browser tabs)
- Single page - no separate route needed
- Easy to implement with existing event delegation pattern
- Clear visual separation between views

**Alternative Considered:** Separate page or modal
- Rejected: Adds unnecessary complexity for a simple view toggle, requires navigation state management

### Decision 4: Deleted Tasks View Design

**Choice:** Render deleted tasks using the same task card structure as active tasks, but:
- Mark all as completed (checked)
- Display deletion timestamp instead of action buttons
- Apply visual styling to indicate deleted state (e.g., muted colors)
- No interactive actions (no toggle, edit, or delete)

**Rationale:**
- Reuses existing rendering logic
- Read-only view matches the non-goal of no restore functionality
- Timestamps provide audit trail
- Visual distinction prevents confusion with active tasks

### Decision 5: Data Migration Strategy

**Choice:** No migration needed. First run after deployment:
- If `deletedTasks` key doesn't exist, initialize as empty array
- Existing tasks remain in `tasks` key unchanged

**Rationale:**
- Backward compatible
- No risk to existing data
- Simple implementation

## Risks / Trade-offs

**[Risk: localStorage Quota]** → Deleted tasks will consume storage quota over time. Without cleanup, users with many deletions could hit quota limits.
- Mitigation: Document in code that future enhancement could add expiration/cleanup. Existing quota error handling will catch and notify users if limit is reached.

**[Risk: Performance with Large Deleted Lists]** → Rendering hundreds of deleted tasks could be slow.
- Mitigation: Acceptable for MVP. If needed, future enhancement could add pagination or virtualization.

**[Trade-off: No Restore Function]** → Users can view but not restore deleted tasks.
- Rationale: Keeps scope manageable. Viewing deleted tasks already provides value for accidental deletion review and audit trail. Restore can be added later without breaking changes.

**[Trade-off: Deleted Tasks Persist Forever]** → No automatic cleanup or expiration.
- Rationale: Simpler implementation. Storage management can be added in future iteration if needed.

## Open Questions

None - design is ready for implementation.
