// ============================================================
// Storage Module - Handles localStorage operations
// ============================================================
const Storage = {
    STORAGE_KEY: 'simple-todo-tasks',

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
    }
};

// ============================================================
// State Module - Manages in-memory task state
// ============================================================
const State = {
    tasks: [], // In-memory array holding current task state
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

        this.tasks.splice(index, 1);
        this._saveToStorage();

        return true;
    },

    _saveToStorage() {
        // Helper to save current state and track storage errors
        const result = Storage.saveTasks(this.tasks);
        if (!result.success && !this.storageErrorOccurred) {
            this.storageErrorOccurred = true;
            if (result.error === 'quota') {
                UI.showNotification('Storage limit reached. Please delete some tasks to continue.', 'error');
            } else if (result.error === 'unavailable') {
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
        notificationArea: null
    },

    init() {
        // Cache DOM elements
        this.elements.taskForm = document.getElementById('task-form');
        this.elements.taskInput = document.getElementById('task-input');
        this.elements.taskListContainer = document.getElementById('task-list-container');
        this.elements.notificationArea = document.getElementById('notification-area');
    },

    renderTaskList() {
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
    }
};

// ============================================================
// Application Initialization
// ============================================================
function init() {
    // Load tasks from storage
    State.tasks = Storage.loadTasks();

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
