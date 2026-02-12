## Context

The application currently has all functionality consolidated in a single 486-line `app.js` file with four logical sections:
1. Storage Module (localStorage operations)
2. State Module (in-memory task management)
3. UI Module (DOM manipulation and rendering)
4. Application Initialization (wiring everything together)

While the code is already well-organized internally with clear module boundaries, keeping everything in one file limits maintainability and scalability. The modules are currently plain JavaScript objects, and the file is loaded via a simple `<script>` tag in `index.html`.

**Current State:**
- Single `app.js` file with ~486 lines
- Modules defined as object literals (not ES6 modules)
- No build step or bundler
- Runs directly in browser

**Constraints:**
- Must remain vanilla JavaScript (no build tools)
- Must maintain zero-dependency approach
- Must support all modern browsers (ES6 modules supported since 2018)
- Must preserve all existing functionality

## Goals / Non-Goals

**Goals:**
- Split monolithic `app.js` into separate, focused module files
- Adopt ES6 module syntax (import/export) for better tooling support
- Establish a clean directory structure for future scalability
- Enable better parallel development and testing
- Maintain the simplicity of no-build-step development

**Non-Goals:**
- Changing any business logic or functionality
- Adding a build system or bundler
- Modifying the UI or user-facing behavior
- Changing the testing approach or framework
- Performance optimization (already fast for vanilla JS)

## Decisions

### 1. File Structure

**Decision:** Create a `src/` directory with four module files:
```
src/
├── storage.js     # Storage module (localStorage operations)
├── state.js       # State module (task management logic)
├── ui.js          # UI module (DOM manipulation)
└── app.js         # Application initialization and wiring
```

**Rationale:**
- One file per logical module maintains clear separation of concerns
- `src/` directory is a common convention that signals source code
- `app.js` becomes the entry point that imports and wires other modules
- Mirrors the existing logical structure, minimizing cognitive overhead

**Alternatives Considered:**
- Flat structure (no `src/` dir): Would clutter root directory as project grows
- Deeper nesting (`src/modules/`, `src/core/`): Over-engineered for current scale
- Single `modules.js` with multiple exports: Still too large, defeats the purpose

### 2. Module Export Pattern

**Decision:** Use named exports for modules, default export for app initialization:
```javascript
// storage.js
export const Storage = { ... };

// state.js
export const State = { ... };

// ui.js
export const UI = { ... };

// app.js
import { Storage } from './storage.js';
import { State } from './state.js';
import { UI } from './ui.js';

function init() { ... }
init(); // Auto-execute on module load
```

**Rationale:**
- Named exports match the current naming convention (Storage, State, UI)
- No need for default exports since modules export single objects
- App module auto-executes initialization (mimics current behavior)
- Explicit imports make dependencies clear

**Alternatives Considered:**
- Default exports: Would require renaming at import time, less explicit
- Class-based modules: Over-engineering for simple object-based modules
- Exporting individual functions: Would require refactoring entire codebase

### 3. HTML Integration

**Decision:** Update `index.html` to use ES6 module type:
```html
<script type="module" src="src/app.js"></script>
```

**Rationale:**
- Minimal change to HTML (just add `type="module"` and update path)
- Browser handles module loading and dependency resolution automatically
- Maintains zero-build-step approach
- `type="module"` enables strict mode by default (better error catching)

**Alternatives Considered:**
- Multiple script tags for each module: Manual dependency ordering, error-prone
- Keep `app.js` in root: Inconsistent structure, src/ would feel incomplete

### 4. Initialization Strategy

**Decision:** Keep DOMContentLoaded check in `app.js` and auto-execute init:
```javascript
// app.js
function init() {
    State.tasks = Storage.loadTasks();
    State.deletedTasks = Storage.loadDeletedTasks();
    UI.init();
    UI.setupEventListeners();
    UI.renderTaskList();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
```

**Rationale:**
- Preserves current initialization logic exactly
- Handles both early and late script loading
- Module auto-executes when loaded, mimicking current behavior

**Alternatives Considered:**
- Export init function, call from inline script: Adds complexity to HTML
- Use `defer` attribute: Would require testing across all browsers

### 5. Module Dependencies

**Decision:** Maintain current module dependencies:
- Storage: No dependencies (pure localStorage wrapper)
- State: Depends on Storage (imports it)
- UI: Depends on State and Storage (imports both)
- App: Depends on all three (imports all)

**Rationale:**
- Mirrors current implicit dependencies
- Storage remains the foundation layer
- State builds on Storage
- UI coordinates both for rendering
- App orchestrates everything

## Risks / Trade-offs

**[Risk]** ES6 modules not supported in very old browsers (pre-2018)
→ **Mitigation:** Document browser requirements in README. All major browsers have supported ES6 modules since 2018 (Chrome 61+, Firefox 60+, Safari 11+, Edge 16+). The current codebase already requires ES6 features.

**[Risk]** CORS issues when loading modules with `file://` protocol
→ **Mitigation:** Document that users should use a local server (Python SimpleHTTPServer, `npx serve`, VSCode Live Server) instead of opening `index.html` directly. This is already recommended in CLAUDE.md.

**[Risk]** Test files may need import path updates
→ **Mitigation:** Tests currently import from `app.js`. After refactor, they'll need to import from `src/app.js` or specific modules. Update test imports as part of implementation.

**[Risk]** Breaking changes for any existing consumers
→ **Mitigation:** This is a local development app with no external consumers. If this changes, we can maintain a bundle/flat version for backward compatibility.

**[Trade-off]** Slightly more complex debugging (module boundaries in stack traces)
→ **Benefit:** Modern DevTools handle ES6 modules well. Benefit of clear file boundaries outweighs minor debugging overhead.

**[Trade-off]** Requires HTTP server for local development (no direct file:// opening)
→ **Benefit:** This is already best practice and documented in CLAUDE.md. ES6 modules enforce this good practice.

## Migration Plan

**Phase 1: Create new file structure**
1. Create `src/` directory
2. Extract Storage module → `src/storage.js` with named export
3. Extract State module → `src/state.js` with import and named export
4. Extract UI module → `src/ui.js` with imports and named export
5. Create `src/app.js` with imports and initialization logic

**Phase 2: Update HTML**
1. Change `<script src="app.js"></script>` to `<script type="module" src="src/app.js"></script>` in `index.html`

**Phase 3: Update tests**
1. Update test file imports from `app.js` to `src/app.js` or specific modules
2. Verify all tests pass

**Phase 4: Verify functionality**
1. Test in multiple browsers (Chrome, Firefox, Safari)
2. Verify localStorage persistence works
3. Test all CRUD operations (add, toggle, edit, delete tasks)
4. Test view toggle (active/deleted tasks)
5. Use Playwright MCP for automated verification

**Phase 5: Cleanup**
1. Remove old `app.js` file from root
2. Update documentation if needed

**Rollback Strategy:**
- Keep old `app.js` in a backup location until verification complete
- If issues arise, revert HTML change and restore old `app.js`
- Since this is a local app with no deployment, rollback is immediate

## Open Questions

None - the design is straightforward with clear implementation steps.
