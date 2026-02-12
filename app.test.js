// Simple test framework for vanilla JS todo app
// Run this file in a browser with index.html to execute tests

// Import modules for testing
import { State } from './src/state.js';
import { Storage } from './src/storage.js';

// Test utilities
const TestRunner = {
    tests: [],
    passed: 0,
    failed: 0,

    test(description, testFn) {
        this.tests.push({ description, testFn });
    },

    async run() {
        console.log('🧪 Running Tests...\n');

        for (const { description, testFn } of this.tests) {
            try {
                await testFn();
                this.passed++;
                console.log(`✓ ${description}`);
            } catch (error) {
                this.failed++;
                console.error(`✗ ${description}`);
                console.error(`  Error: ${error.message}`);
            }
        }

        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    },

    assertEquals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    },

    assertTrue(condition, message) {
        if (!condition) {
            throw new Error(message || 'Expected condition to be true');
        }
    },

    assertFalse(condition, message) {
        if (condition) {
            throw new Error(message || 'Expected condition to be false');
        }
    }
};

// Helper to reset state before each test
function resetState() {
    State.tasks = [];
    State.deletedTasks = [];
    State.storageErrorOccurred = false;
    localStorage.clear();
}

// ============================================================
// Tests for soft-delete functionality in State module
// ============================================================

TestRunner.test('deleteTask should add deletedAt timestamp to task', () => {
    resetState();

    const task = State.addTask('Test task');
    const taskId = task.id;

    State.deleteTask(taskId);

    TestRunner.assertEquals(State.deletedTasks.length, 1, 'Should have one deleted task');
    TestRunner.assertTrue(State.deletedTasks[0].deletedAt !== undefined, 'Should have deletedAt timestamp');
    TestRunner.assertTrue(typeof State.deletedTasks[0].deletedAt === 'string', 'deletedAt should be a string (ISO format)');
});

TestRunner.test('deleteTask should remove task from active tasks array', () => {
    resetState();

    const task = State.addTask('Test task');
    const taskId = task.id;

    TestRunner.assertEquals(State.tasks.length, 1, 'Should have one active task');

    State.deleteTask(taskId);

    TestRunner.assertEquals(State.tasks.length, 0, 'Should have zero active tasks');
});

TestRunner.test('deleteTask should append task to deleted tasks array', () => {
    resetState();

    const task = State.addTask('Test task');
    const taskId = task.id;
    const originalText = task.text;

    State.deleteTask(taskId);

    TestRunner.assertEquals(State.deletedTasks.length, 1, 'Should have one deleted task');
    TestRunner.assertEquals(State.deletedTasks[0].text, originalText, 'Deleted task should preserve original text');
    TestRunner.assertEquals(State.deletedTasks[0].id, taskId, 'Deleted task should preserve ID');
});

TestRunner.test('deleteTask should preserve task properties when soft-deleting', () => {
    resetState();

    const task = State.addTask('Test task');
    task.completed = true;
    const taskId = task.id;

    State.deleteTask(taskId);

    TestRunner.assertEquals(State.deletedTasks[0].completed, true, 'Should preserve completion status');
    TestRunner.assertTrue(State.deletedTasks[0].createdAt !== undefined, 'Should preserve createdAt timestamp');
});

TestRunner.test('deleteTask should return false for non-existent task ID', () => {
    resetState();

    const result = State.deleteTask('nonexistent-id');

    TestRunner.assertFalse(result, 'Should return false for non-existent task');
    TestRunner.assertEquals(State.deletedTasks.length, 0, 'Should not add anything to deleted tasks');
});

TestRunner.test('Multiple tasks can be soft-deleted', () => {
    resetState();

    const task1 = State.addTask('Task 1');
    const task2 = State.addTask('Task 2');
    const task3 = State.addTask('Task 3');

    State.deleteTask(task1.id);
    State.deleteTask(task2.id);
    State.deleteTask(task3.id);

    TestRunner.assertEquals(State.tasks.length, 0, 'Should have zero active tasks');
    TestRunner.assertEquals(State.deletedTasks.length, 3, 'Should have three deleted tasks');
});

// ============================================================
// Tests for deleted tasks retrieval and sorting
// ============================================================

TestRunner.test('getDeletedTasks should return empty array when no tasks deleted', () => {
    resetState();

    const deletedTasks = State.getDeletedTasks();

    TestRunner.assertEquals(deletedTasks.length, 0, 'Should return empty array');
});

TestRunner.test('getDeletedTasks should return all deleted tasks', () => {
    resetState();

    const task1 = State.addTask('Task 1');
    const task2 = State.addTask('Task 2');

    State.deleteTask(task1.id);
    State.deleteTask(task2.id);

    const deletedTasks = State.getDeletedTasks();

    TestRunner.assertEquals(deletedTasks.length, 2, 'Should return both deleted tasks');
});

TestRunner.test('getDeletedTasks should sort by deletion timestamp (most recent first)', () => {
    resetState();

    const task1 = State.addTask('Task 1');
    // Small delay to ensure different timestamps
    const task2 = State.addTask('Task 2');
    const task3 = State.addTask('Task 3');

    State.deleteTask(task1.id);
    State.deleteTask(task3.id);
    State.deleteTask(task2.id);

    const deletedTasks = State.getDeletedTasks();

    // Most recently deleted should be first
    TestRunner.assertEquals(deletedTasks[0].text, 'Task 2', 'Most recent deletion should be first');
    TestRunner.assertEquals(deletedTasks[1].text, 'Task 3', 'Second most recent should be second');
    TestRunner.assertEquals(deletedTasks[2].text, 'Task 1', 'Oldest deletion should be last');
});

TestRunner.test('getDeletedTasks should not modify original deletedTasks array', () => {
    resetState();

    const task = State.addTask('Test task');
    State.deleteTask(task.id);

    const deletedTasks = State.getDeletedTasks();
    deletedTasks.push({ id: 'fake', text: 'fake task' });

    TestRunner.assertEquals(State.deletedTasks.length, 1, 'Original array should not be modified');
});

// ============================================================
// Tests for localStorage persistence of deleted tasks
// ============================================================

TestRunner.test('saveDeletedTasks should persist deleted tasks to localStorage', () => {
    resetState();

    const task = State.addTask('Test task');
    State.deleteTask(task.id);

    const stored = localStorage.getItem('deletedTasks');
    TestRunner.assertTrue(stored !== null, 'Should save to localStorage');

    const parsed = JSON.parse(stored);
    TestRunner.assertEquals(parsed.length, 1, 'Should have one deleted task in storage');
    TestRunner.assertEquals(parsed[0].text, 'Test task', 'Should preserve task text in storage');
});

TestRunner.test('loadDeletedTasks should retrieve deleted tasks from localStorage', () => {
    resetState();

    const testData = [
        { id: '1', text: 'Task 1', deletedAt: new Date().toISOString() },
        { id: '2', text: 'Task 2', deletedAt: new Date().toISOString() }
    ];

    localStorage.setItem('deletedTasks', JSON.stringify(testData));

    const loaded = Storage.loadDeletedTasks();

    TestRunner.assertEquals(loaded.length, 2, 'Should load both deleted tasks');
    TestRunner.assertEquals(loaded[0].text, 'Task 1', 'Should preserve first task data');
    TestRunner.assertEquals(loaded[1].text, 'Task 2', 'Should preserve second task data');
});

TestRunner.test('loadDeletedTasks should return empty array if no data in localStorage', () => {
    resetState();

    const loaded = Storage.loadDeletedTasks();

    TestRunner.assertEquals(loaded.length, 0, 'Should return empty array when no data exists');
});

TestRunner.test('loadDeletedTasks should handle corrupted data gracefully', () => {
    resetState();

    localStorage.setItem('deletedTasks', 'invalid json');

    const loaded = Storage.loadDeletedTasks();

    TestRunner.assertEquals(loaded.length, 0, 'Should return empty array for corrupted data');
    TestRunner.assertEquals(localStorage.getItem('deletedTasks'), null, 'Should clear corrupted data');
});

TestRunner.test('State initialization should load both active and deleted tasks', () => {
    localStorage.clear();

    const activeTasks = [
        { id: '1', text: 'Active task', completed: false, createdAt: new Date().toISOString() }
    ];
    const deletedTasks = [
        { id: '2', text: 'Deleted task', completed: true, createdAt: new Date().toISOString(), deletedAt: new Date().toISOString() }
    ];

    localStorage.setItem('simple-todo-tasks', JSON.stringify(activeTasks));
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));

    State.tasks = Storage.loadTasks();
    State.deletedTasks = Storage.loadDeletedTasks();

    TestRunner.assertEquals(State.tasks.length, 1, 'Should load active tasks');
    TestRunner.assertEquals(State.deletedTasks.length, 1, 'Should load deleted tasks');
});

// Run all tests when this script loads
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        TestRunner.run();
    });
}
