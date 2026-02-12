// ============================================================
// Storage Module - Handles localStorage operations
// ============================================================
export const Storage = {
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
    },

    removeFromDeletedTasks(taskId) {
        try {
            const deletedTasks = this.loadDeletedTasks();
            const filteredTasks = deletedTasks.filter(task => task.id !== taskId);
            return this.saveDeletedTasks(filteredTasks);
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('Storage quota exceeded');
                return { success: false, error: 'quota' };
            }
            if (error.name === 'SecurityError') {
                console.warn('LocalStorage unavailable (private browsing mode)');
                return { success: false, error: 'unavailable' };
            }
            console.error('Failed to remove from deleted tasks:', error);
            return { success: false, error: 'unknown' };
        }
    },

    moveTaskToActive(taskId) {
        try {
            const deletedTasks = this.loadDeletedTasks();
            const activeTasks = this.loadTasks();

            // Find the task in deleted tasks
            const taskIndex = deletedTasks.findIndex(task => task.id === taskId);
            if (taskIndex === -1) {
                return { success: false, error: 'not_found' };
            }

            // Remove from deleted and add to active
            const task = deletedTasks[taskIndex];
            const filteredDeletedTasks = deletedTasks.filter(t => t.id !== taskId);
            activeTasks.push(task);

            // Save both arrays
            const deleteResult = this.saveDeletedTasks(filteredDeletedTasks);
            if (!deleteResult.success) {
                return deleteResult;
            }

            const activeResult = this.saveTasks(activeTasks);
            return activeResult;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('Storage quota exceeded');
                return { success: false, error: 'quota' };
            }
            if (error.name === 'SecurityError') {
                console.warn('LocalStorage unavailable (private browsing mode)');
                return { success: false, error: 'unavailable' };
            }
            console.error('Failed to move task to active:', error);
            return { success: false, error: 'unknown' };
        }
    }
};
