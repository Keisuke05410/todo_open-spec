## Why

The current implementation has all functionality consolidated in a single 486-line `app.js` file. While the code is already logically separated into modules (Storage, State, UI), keeping everything in one file will become increasingly difficult to maintain and scale as new features are added. Splitting into separate files will improve code organization, enable better parallel development, simplify testing, and make the codebase more maintainable for future growth.

## What Changes

- Refactor the monolithic `app.js` into separate ES6 module files
- Create a new directory structure to organize modules by responsibility
- Update `index.html` to use ES6 module imports instead of a single script tag
- Maintain all existing functionality while improving code organization and scalability

## Capabilities

### New Capabilities
- `modular-file-structure`: ES6 module-based file organization with separate files for Storage, State, UI, and application initialization, enabling better maintainability and parallel development

### Modified Capabilities
<!-- No requirement changes - this is a refactoring that maintains existing behavior -->

## Impact

- **File structure**: `app.js` will be split into multiple module files (e.g., `src/storage.js`, `src/state.js`, `src/ui.js`, `src/app.js`)
- **HTML changes**: `index.html` will be updated to use `<script type="module">` for ES6 module loading
- **No functional changes**: All existing features (task management, persistence, deleted tasks view) remain unchanged
- **Testing**: Existing test files may need import path updates
- **Browser compatibility**: Requires modern browsers with ES6 module support (all major browsers since 2018)
