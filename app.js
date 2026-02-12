// ============================================================
// Storage Module - Handles localStorage operations
// ============================================================
const Storage = {
    STORAGE_KEY: 'simple-todo-tasks',
    DELETED_TASKS_KEY: 'deletedTasks',

    loadTasks() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) {
                return [];
            }
            const tasks = JSON.parse(data);
            // Validate that we got an array
            if (!Array.isArray(tasks)) {
                console.error('Corrupted storage data: expected array');
                return [];
            }
            return tasks;
        } catch (error) {
            if (error.name === 'SecurityError' || error.name === 'QuotaExceededError') {
                // Storage unavailable (private browsing) or quota exceeded
                console.warn('LocalStorage unavailable:', error.message);
                return [];
            }
            // JSON parsing error or other corruption
            console.error('Failed to load tasks, resetting storage:', error);
            localStorage.removeItem(this.STORAGE_KEY);
            return [];
        }
    },

    loadDeletedTasks() {
        try {
            const data = localStorage.getItem(this.DELETED_TASKS_KEY);
            if (!data) {
                return [];
            }
            const tasks = JSON.parse(data);
            // Validate that we got an array
            if (!Array.isArray(tasks)) {
                console.error('Corrupted deleted tasks storage data: expected array');
                return [];
            }
            return tasks;
        } catch (error) {
            if (error.name === 'SecurityError' || error.name === 'QuotaExceededError') {
                // Storage unavailable (private browsing) or quota exceeded
                console.warn('LocalStorage unavailable:', error.message);
                return [];
            }
            // JSON parsing error or other corruption
            console.error('Failed to load deleted tasks, resetting storage:', error);
            localStorage.removeItem(this.DELETED_TASKS_KEY);
            return [];
        }
    },

    saveTasks(tasks) {
        try {
            const data = JSON.stringify(tasks);
            localStorage.setItem(this.STORAGE_KEY, data);
            return { success: true };
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('Storage quota exceeded');
                return { success: false, error: 'quota' };
            }
            if (error.name === 'SecurityError') {
                console.warn('LocalStorage unavailable (private browsing mode)');
                return { success: false, error: 'unavailable' };
            }
            console.error('Failed to save tasks:', error);
            return { success: false, error: 'unknown' };
        }
    },

    saveDeletedTasks(tasks) {
        try {
            const data = JSON.stringify(tasks);
            localStorage.setItem(this.DELETED_TASKS_KEY, data);
            return { success: true };
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('Storage quota exceeded');
                return { success: false, error: 'quota' };
            }
            if (error.name === 'SecurityError') {
                console.warn('LocalStorage unavailable (private browsing mode)');
                return { success: false, error: 'unavailable' };
            }
            console.error('Failed to save deleted tasks:', error);
            return { success: false, error: 'unknown' };
        }
    }
};

// ============================================================
// State Module - Manages in-memory task state
// ============================================================
const State = {
    tasks: [], // In-memory array holding current task state
    deletedTasks: [], // In-memory array holding deleted tasks
    storageErrorOccurred: false,

    addTask(text) {
        // Validate input
        const trimmedText = text.trim();
        if (!trimmedText) {
            return null;
        }

        // Create new task with unique ID and timestamp
        const task = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            text: trimmedText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        // Add to state and persist
        this.tasks.push(task);
        this._saveToStorage();

        return task;
    },

    toggleTaskCompletion(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) {
            return false;
        }

        task.completed = !task.completed;
        this._saveToStorage();

        return true;
    },

    updateTaskText(id, newText) {
        // Validate input
        const trimmedText = newText.trim();
        if (!trimmedText) {
            return false;
        }

        const task = this.tasks.find(t => t.id === id);
        if (!task) {
            return false;
        }

        task.text = trimmedText;
        this._saveToStorage();

        return true;
    },

    deleteTask(id) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) {
            return false;
        }

        // Soft-delete: move task to deleted tasks array
        const task = this.tasks[index];
        task.deletedAt = new Date().toISOString();
        this.deletedTasks.push(task);
        this.tasks.splice(index, 1);
        this._saveToStorage();

        return true;
    },

    getDeletedTasks() {
        // Return deleted tasks sorted by deletion timestamp (most recent first)
        return [...this.deletedTasks].sort((a, b) => {
            return new Date(b.deletedAt) - new Date(a.deletedAt);
        });
    },

    _saveToStorage() {
        // Helper to save current state and track storage errors
        const result = Storage.saveTasks(this.tasks);
        const deletedResult = Storage.saveDeletedTasks(this.deletedTasks);

        if ((!result.success || !deletedResult.success) && !this.storageErrorOccurred) {
            this.storageErrorOccurred = true;
            const error = !result.success ? result.error : deletedResult.error;
            if (error === 'quota') {
                UI.showNotification('Storage limit reached. Please delete some tasks to continue.', 'error');
            } else if (error === 'unavailable') {
                UI.showNotification('Storage unavailable (private browsing mode). Tasks will not persist.', 'warning');
            } else {
                UI.showNotification('Failed to save tasks. Tasks will not persist.', 'error');
            }
        }
    }
};

// ============================================================
// UI Module - Handles DOM manipulation and rendering
// ============================================================
const UI = {
    elements: {
        taskForm: null,
        taskInput: null,
        taskListContainer: null,
        notificationArea: null,
        viewToggle: null,
        activeTab: null,
        deletedTab: null
    },

    currentView: 'active', // Track current view: 'active' or 'deleted'

    init() {
        // Cache DOM elements
        this.elements.taskForm = document.getElementById('task-form');
        this.elements.taskInput = document.getElementById('task-input');
        this.elements.taskListContainer = document.getElementById('task-list-container');
        this.elements.notificationArea = document.getElementById('notification-area');
        this.elements.viewToggle = document.getElementById('view-toggle');
        this.elements.activeTab = document.getElementById('active-tab');
        this.elements.deletedTab = document.getElementById('deleted-tab');
    },

    renderTaskList() {
        // Render based on current view
        if (this.currentView === 'deleted') {
            this.renderDeletedTasks();
            return;
        }

        const container = this.elements.taskListContainer;

        // Show empty state if no tasks
        if (State.tasks.length === 0) {
            this.renderEmptyState();
            return;
        }

        // Create task list HTML
        const ul = document.createElement('ul');
        ul.id = 'task-list';

        State.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item${task.completed ? ' completed' : ''}`;
            li.dataset.taskId = task.id;

            li.innerHTML = `
                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? 'checked' : ''}
                    aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}"
                >
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="btn-edit" aria-label="Edit task">Edit</button>
                    <button class="btn-delete" aria-label="Delete task">Delete</button>
                </div>
            `;

            ul.appendChild(li);
        });

        container.innerHTML = '';
        container.appendChild(ul);
    },

    renderEmptyState() {
        const container = this.elements.taskListContainer;
        container.innerHTML = `
            <div class="empty-state">
                <p>No tasks yet. Add one above to get started!</p>
            </div>
        `;
    },

    renderDeletedTasks() {
        const container = this.elements.taskListContainer;
        const deletedTasks = State.getDeletedTasks();

        // Show empty state if no deleted tasks
        if (deletedTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No deleted tasks.</p>
                </div>
            `;
            return;
        }

        // Create deleted task list HTML
        const ul = document.createElement('ul');
        ul.id = 'deleted-task-list';

        deletedTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item deleted-task completed';
            li.dataset.taskId = task.id;

            // Format deletion timestamp
            const deletedDate = new Date(task.deletedAt);
            const formattedDate = deletedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            const formattedTime = deletedDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
            });

            li.innerHTML = `
                <input
                    type="checkbox"
                    class="task-checkbox"
                    checked
                    disabled
                    aria-label="Deleted task (completed)"
                >
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <span class="deleted-timestamp">Deleted on ${formattedDate} at ${formattedTime}</span>
            `;

            ul.appendChild(li);
        });

        container.innerHTML = '';
        container.appendChild(ul);
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        this.elements.notificationArea.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    },

    setupEventListeners() {
        // Handle view toggle
        this.elements.viewToggle.addEventListener('click', (e) => {
            if (e.target.id === 'active-tab') {
                this.showActiveView();
            } else if (e.target.id === 'deleted-tab') {
                this.showDeletedView();
            }
        });

        // Handle new task form submission
        this.elements.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const text = this.elements.taskInput.value;

            // Validate input (prevents empty task creation)
            if (!text.trim()) {
                this.showNotification('Please enter a task description', 'error');
                return;
            }

            // Add task to state
            const task = State.addTask(text);
            if (task) {
                // Clear input field after successful creation
                this.elements.taskInput.value = '';
                this.elements.taskInput.focus();
                this.renderTaskList();
            }
        });

        // Delegate task interactions to the container
        this.elements.taskListContainer.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;

            const taskId = taskItem.dataset.taskId;

            // Toggle task completion (checkbox or text click)
            if (e.target.classList.contains('task-checkbox') ||
                e.target.classList.contains('task-text')) {
                State.toggleTaskCompletion(taskId);
                this.renderTaskList();
            }

            // Edit task
            if (e.target.classList.contains('btn-edit')) {
                this.handleEditTask(taskId, taskItem);
            }

            // Delete task (with confirmation)
            if (e.target.classList.contains('btn-delete')) {
                this.handleDeleteTask(taskId);
            }
        });
    },

    handleEditTask(taskId, taskItem) {
        const task = State.tasks.find(t => t.id === taskId);
        if (!task) return;

        const currentText = task.text;
        const newText = prompt('Edit task:', currentText);

        // User cancelled
        if (newText === null) return;

        // Validate edit prevents saving empty text
        if (!newText.trim()) {
            this.showNotification('Task text cannot be empty', 'error');
            return;
        }

        if (State.updateTaskText(taskId, newText)) {
            this.renderTaskList();
        }
    },

    handleDeleteTask(taskId) {
        // Confirm before deleting
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        if (State.deleteTask(taskId)) {
            this.renderTaskList();
        }
    },

    showActiveView() {
        this.currentView = 'active';
        this.elements.activeTab.classList.add('active');
        this.elements.deletedTab.classList.remove('active');
        this.renderTaskList();
    },

    showDeletedView() {
        this.currentView = 'deleted';
        this.elements.deletedTab.classList.add('active');
        this.elements.activeTab.classList.remove('active');
        this.renderDeletedTasks();
    }
};

// ============================================================
// Application Initialization
// ============================================================
function init() {
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
