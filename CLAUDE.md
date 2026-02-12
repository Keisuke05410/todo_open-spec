# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A vanilla JavaScript todo list application with localStorage persistence. No build tools or dependencies required - runs directly in the browser.

## Architecture

The application follows a modular architecture with three main modules in `app.js`:

- **Storage Module**: Handles localStorage operations with error handling for quota exceeded, security errors, and corrupted data
- **State Module**: Manages in-memory task state and business logic (add, toggle, update, delete tasks)
- **UI Module**: Handles DOM manipulation, rendering, and event delegation

The separation follows a clear pattern: Storage handles persistence, State manages data and operations, UI handles presentation and user interaction.

## Development Requirements

### Test-Driven Development (TDD)

- **ALWAYS** write tests before implementing new features or fixes
- Write failing tests first, then implement code to make them pass
- Run tests after each change to ensure nothing breaks

### Verification with Playwright MCP

- **ALWAYS** verify functionality using Playwright MCP after implementation
- Use browser automation to test the actual UI behavior, not just logic
- Test user interactions: adding tasks, toggling completion, editing, deleting
- Verify localStorage persistence by checking data survives page reload

## Running the Application

1. Open `index.html` directly in a web browser, or
2. Use a local server: `python3 -m http.server 8000` or `npx serve`

No build or compilation step is required.

## Key Implementation Patterns

### Task ID Generation
Tasks use a combination of timestamp and random string for unique IDs:
```javascript
id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
```

### Event Delegation
UI interactions use event delegation on the container rather than individual task listeners for performance.

### Input Validation
All user inputs are trimmed and validated before processing. Empty strings are rejected at both UI and State module levels.

### Error Handling in Storage
The Storage module gracefully handles QuotaExceededError, SecurityError (private browsing), and JSON parsing errors. Errors are surfaced to users via notifications.

### XSS Prevention
Task text is escaped using `escapeHtml()` before rendering to prevent XSS attacks.

## OpenSpec Workflow

This project uses OpenSpec for structured change management. Changes are tracked in `openspec/changes/` and specs are maintained in `openspec/specs/`.

Use OpenSpec skills (`/opsx:*` commands) to:
- Create new changes with `/opsx:new`
- Continue working on changes with `/opsx:continue`
- Apply implementation tasks with `/opsx:apply`
- Verify changes with `/opsx:verify`
- Archive completed changes with `/opsx:archive`
