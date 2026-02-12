## Context

The project is a vanilla JavaScript todo application that runs directly in the browser without build tools. ES6 modules require serving files over HTTP (not `file://` protocol), so developers currently use `python3 -m http.server 8000`. This adds an external dependency (Python) for a pure JavaScript project.

**Current State:**
- CLAUDE.md documents Python server as primary method
- No package.json exists
- No Node.js tooling configured

**Constraints:**
- Must remain a zero-build application
- Cannot introduce compilation or bundling steps
- Should minimize npm dependencies
- Must preserve ES6 module loading behavior

## Goals / Non-Goals

**Goals:**
- Provide Node-based development server that works out of the box
- Eliminate Python dependency for typical development workflow
- Maintain simple, no-build architecture
- Improve developer experience with better defaults (auto-reload if feasible)

**Non-Goals:**
- Adding a build system or bundler (Vite, Webpack, etc.)
- Hot module replacement or advanced dev features
- Production server configuration
- Docker or containerization

## Decisions

### Decision 1: Use `npx serve` as the default server

**Rationale:**
- Zero installation: `npx` comes with npm (Node 8+), downloads packages on-demand
- Simple, focused tool designed specifically for serving static files
- No package.json required - can be run directly from command line
- Automatic CORS handling and clean output
- Wide compatibility and active maintenance

**Alternatives Considered:**
- `live-server`: Requires global install or package.json, adds auto-reload complexity
- `http-server`: Similar to serve, but serve has better defaults and UX
- `vite`: Overkill for this project, implies build tooling even in dev mode
- Python server: Current solution, but requires non-JS dependency

**Trade-off:** No auto-reload by default, but preserves simplicity. Users can switch to live-server if they want that feature.

### Decision 2: Add minimal package.json with npm scripts

**Rationale:**
- Provides convenient `npm start` command for consistent developer experience
- Allows specifying default port (8000) to match current workflow
- Enables future extensibility (linting, testing) without restructuring
- npm scripts are widely understood convention

**Alternatives Considered:**
- No package.json, document `npx serve` command directly: Less convenient, no standardization
- Full package.json with devDependencies: Unnecessary complexity, requires `npm install`

**Implementation:**
```json
{
  "name": "todo-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "npx serve -l 8000"
  }
}
```

### Decision 3: Update CLAUDE.md to prioritize npm script

**Rationale:**
- `npm start` is more intuitive than remembering `npx serve` flags
- Documents Python server as fallback option (not removed entirely)
- Aligns with standard JavaScript project conventions

**Structure:**
1. Primary method: `npm start` (requires Node.js/npm)
2. Alternative: `npx serve -l 8000` (direct command)
3. Fallback: Python server (for environments without Node)

### Decision 4: Set default port to 8000

**Rationale:**
- Matches current Python server default
- No migration needed for existing developer workflows
- Explicitly specified in npm script prevents port conflicts

## Risks / Trade-offs

**[Risk]** Developers without Node.js installed cannot use new method
→ **Mitigation:** Document Python server as fallback; Node.js is nearly universal for JS development

**[Risk]** `npx serve` downloads package on first run (network required)
→ **Mitigation:** One-time download, caches locally; document alternative direct install

**[Risk]** No auto-reload may feel less modern than live-server
→ **Mitigation:** Manual refresh preserves simplicity; users can switch to live-server if desired

**[Trade-off]** Adding package.json changes project from "no config" to "minimal config"
→ **Benefit:** Standard convention, enables future tooling, trivial maintenance

**[Trade-off]** npx downloads serve (~400KB) vs Python server (built-in)
→ **Benefit:** Node.js ecosystem alignment, better long-term maintainability for JS projects

## Open Questions

None - design is straightforward and well-scoped.
