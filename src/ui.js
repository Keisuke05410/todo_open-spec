// ============================================================
// UI Module - Handles DOM manipulation and rendering
// ============================================================
import { State } from './state.js';

export const UI = {
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
