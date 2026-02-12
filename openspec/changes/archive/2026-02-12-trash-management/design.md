## Context

The application currently implements soft-delete for tasks, storing them in a separate deleted tasks array in localStorage. The deleted tasks view displays these tasks as read-only, with no way to restore or permanently remove them. This design extends the existing modular architecture (Storage, State, UI modules) to add trash management operations while preserving the deletion history.

## Goals / Non-Goals

**Goals:**
- Enable users to restore deleted tasks back to the active list
- Enable users to permanently delete tasks from storage
- Preserve deletion timestamps when restoring (for audit/history)
- Maintain separation of concerns across Storage, State, and UI modules
- Provide clear user feedback and confirmation for destructive actions

**Non-Goals:**
- Batch operations (restore all, delete all) - single task operations only
- Undo/redo system beyond restore
- Trash auto-cleanup or expiration policies
- Search or filter within trash

## Decisions

### Decision 1: Task Restoration Preserves Deletion History

**Choice**: When restoring a task, keep the `deletedAt` timestamp in the task object rather than removing it.

**Rationale**: Preserving deletion history provides audit trail and enables future features (e.g., "recently restored" view, analytics). The `deletedAt` field only affects whether a task appears in active vs deleted view - it doesn't break existing functionality.

**Alternatives Considered**:
- Remove `deletedAt` on restore: Simpler but loses history
- Move to separate "restoredAt" field: More complex, adds redundant timestamp data

### Decision 2: Permanent Delete Requires User Confirmation

**Choice**: Show browser confirmation dialog before permanent delete.

**Rationale**: Permanent delete is irreversible and could result in data loss. A confirmation step prevents accidental deletion while keeping the implementation simple (no custom modal component needed).

**Alternatives Considered**:
- No confirmation: Too risky for permanent action
- Custom modal: Better UX but adds complexity and is out of scope for this change
- Two-step button (click once to reveal, click again to confirm): More clicks, less intuitive

### Decision 3: Storage Operations Use Array Filtering

**Choice**: Implement permanent delete by filtering the deleted tasks array and saving the result back to localStorage.

**Rationale**: Aligns with existing patterns in the codebase. The Storage module already uses array methods for task management. Performance is acceptable for typical todo list sizes (< 1000 tasks).

**Alternatives Considered**:
- Indexed storage (e.g., Map by ID): Better performance but inconsistent with current implementation
- Mark as "permanently deleted" flag: Leaves garbage data in storage

### Decision 4: UI Button Placement and Labeling

**Choice**: Add two buttons per deleted task: "Restore" (primary action) and "Permanently Delete" (destructive action). Place them in the same button group, with "Restore" appearing first (left).

**Rationale**:
- Primary action (restore) gets visual priority
- Separate buttons are clearer than a dropdown menu
- Left-to-right order matches common pattern (safe action before destructive)
- Consistent with existing delete button pattern in active tasks

**Alternatives Considered**:
- Single "more options" dropdown: Hides actions, requires extra click
- Icons only: Less clear, accessibility issues
- Restore on double-click: Not discoverable, conflicts with accessibility

## Risks / Trade-offs

**Risk**: Permanent delete confirmation dialog might be dismissed habitually by users
→ **Mitigation**: Use clear warning text in dialog ("This cannot be undone"). Consider future enhancement: require typing "DELETE" to confirm.

**Risk**: Restoring a task with a very old deletedAt timestamp might confuse users
→ **Mitigation**: Accepted for now. Future enhancement: show "restored" notification with option to undo.

**Risk**: Large number of deleted tasks could impact localStorage quota
→ **Mitigation**: Permanent delete provides manual cleanup. Out of scope: automatic cleanup policies.

**Trade-off**: Keeping deletedAt after restore adds complexity to task filtering logic
→ **Accepted**: The benefit of preserving history outweighs the minor complexity increase. Filtering logic already exists (active vs deleted view).
