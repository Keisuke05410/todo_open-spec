## Why

The current development workflow requires Python to run a local HTTP server (`python3 -m http.server 8000`), which adds an unnecessary dependency for a JavaScript-only project. Many developers may not have Python installed or prefer to use Node-based tooling for frontend development. This change will provide a more optimal, Node-based development server that's better suited for modern JavaScript applications.

## What Changes

- Add npm/npx-based development server configuration
- Create convenient npm scripts for starting the development server
- Update documentation (CLAUDE.md) to reflect the new server startup method
- Remove Python server instructions as the primary method
- Optionally add package.json if not present (for npm scripts)

## Capabilities

### New Capabilities
- `dev-server-setup`: Configuration and documentation for starting a local development server using Node-based tools (npx serve, live-server, or similar) instead of Python's HTTP server

### Modified Capabilities
<!-- No existing specs need requirement changes -->

## Impact

- **Documentation**: CLAUDE.md needs updates to the "Running the Application" section
- **Developer Experience**: Simplified setup for developers without Python
- **Dependencies**: May introduce package.json for npm scripts (minimal or zero npm dependencies if using npx)
- **No Breaking Changes**: Existing functionality remains unchanged, only the development workflow improves
