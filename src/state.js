// ============================================================
// State Module - Manages in-memory task state
// ============================================================
import { Storage } from './storage.js';

export const State = {
    tasks: [], // In-memory array holding current task state
    deletedTasks: [], // In-memory array holding deleted tasks
    storageErrorOccurred: false,
    notificationHandler: null, // Will be set by app initialization

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
            // Use notification handler if available (set during initialization)
            if (this.notificationHandler) {
                if (error === 'quota') {
                    this.notificationHandler('Storage limit reached. Please delete some tasks to continue.', 'error');
                } else if (error === 'unavailable') {
                    this.notificationHandler('Storage unavailable (private browsing mode). Tasks will not persist.', 'warning');
                } else {
                    this.notificationHandler('Failed to save tasks. Tasks will not persist.', 'error');
                }
            }
        }
    }
};
