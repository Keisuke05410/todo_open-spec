## 1. Create Module File Structure

- [ ] 1.1 Create `src/` directory in project root
- [ ] 1.2 Extract Storage module from `app.js` to `src/storage.js` with named export
- [ ] 1.3 Extract State module from `app.js` to `src/state.js` with import of Storage and named export
- [ ] 1.4 Extract UI module from `app.js` to `src/ui.js` with imports of State and Storage, and named export
- [ ] 1.5 Create `src/app.js` with imports of all modules and initialization logic

## 2. Update HTML Integration

- [ ] 2.1 Update `index.html` script tag to `<script type="module" src="src/app.js"></script>`

## 3. Update Test Files

- [ ] 3.1 Update test file imports from `app.js` to `src/app.js` or specific module paths
- [ ] 3.2 Run all tests to verify they pass with new module structure

## 4. Verify Functionality with Playwright MCP

- [ ] 4.1 Test application loads correctly in browser
- [ ] 4.2 Verify task creation works (add new task, check localStorage)
- [ ] 4.3 Verify task toggle completion works
- [ ] 4.4 Verify task editing works
- [ ] 4.5 Verify task deletion works
- [ ] 4.6 Verify deleted tasks view toggle works
- [ ] 4.7 Verify task restoration from deleted view works
- [ ] 4.8 Verify localStorage persistence (reload page and check tasks survive)

## 5. Cleanup and Documentation

- [ ] 5.1 Remove old `app.js` file from project root
- [ ] 5.2 Update CLAUDE.md if needed to reflect new structure
