// ============================================================
// Application Initialization
// ============================================================
import { Storage } from './storage.js';
import { State } from './state.js';
import { UI } from './ui.js';

function init() {
    // Set up notification handler for State (avoids circular dependency)
    State.notificationHandler = UI.showNotification.bind(UI);

    // Load tasks from storage
    State.tasks = Storage.loadTasks();
    State.deletedTasks = Storage.loadDeletedTasks();

    // Initialize UI elements
    UI.init();

    // Setup event listeners
    UI.setupEventListeners();

    // Display initial state (empty or populated list)
    UI.renderTaskList();

    console.log('Simple Todo List initialized with', State.tasks.length, 'tasks');
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
