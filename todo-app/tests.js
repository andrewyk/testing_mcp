class TestRunner {
    constructor() {
        this.tests = [];
        this.results = [];
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('Running tests...');
        
        for (const test of this.tests) {
            try {
                await test.fn();
                this.results.push({ name: test.name, passed: true });
                console.log(`✓ ${test.name}`);
            } catch (error) {
                this.results.push({ name: test.name, passed: false, error: error.message });
                console.error(`✗ ${test.name}`, error);
            }
        }

        this.displayResults();
    }

    displayResults() {
        const container = document.getElementById('testResults');
        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        
        let html = '';
        
        this.results.forEach(result => {
            const status = result.passed ? 'passed' : 'failed';
            const icon = result.passed ? '✓' : '✗';
            html += `
                <div class="test-case ${status}">
                    <h3>${icon} ${result.name}</h3>
                    ${result.error ? `<p>Error: ${result.error}</p>` : ''}
                </div>
            `;
        });

        const summaryClass = failed === 0 ? 'all-passed' : 'some-failed';
        html += `
            <div class="summary ${summaryClass}">
                Tests: ${this.results.length} | Passed: ${passed} | Failed: ${failed}
            </div>
        `;

        container.innerHTML = html;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected} but got ${actual}`);
    }
}

function assertArrayEquals(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(message || `Arrays not equal: expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
    }
}

const runner = new TestRunner();

runner.test('TodoApp initializes with empty todos', () => {
    localStorage.clear();
    const app = new TodoApp();
    assertEquals(app.todos.length, 0, 'Todos should be empty on initialization');
});

runner.test('TodoApp can add a todo', () => {
    localStorage.clear();
    const app = new TodoApp();
    
    const initialLength = app.todos.length;
    app.todos.push({ id: 1, text: 'Test todo', completed: false });
    
    assertEquals(app.todos.length, initialLength + 1, 'Todo count should increase by 1');
    assertEquals(app.todos[0].text, 'Test todo', 'Todo text should match');
    assertEquals(app.todos[0].completed, false, 'Todo should not be completed');
});

runner.test('TodoApp can delete a todo', () => {
    localStorage.clear();
    const app = new TodoApp();
    
    app.todos = [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: false }
    ];
    
    app.deleteTodo(1);
    
    assertEquals(app.todos.length, 1, 'Should have 1 todo left');
    assertEquals(app.todos[0].id, 2, 'Remaining todo should have id 2');
});

runner.test('TodoApp can toggle todo completion', () => {
    localStorage.clear();
    const app = new TodoApp();
    
    app.todos = [{ id: 1, text: 'Test', completed: false }];
    
    app.toggleTodo(1);
    assert(app.todos[0].completed, 'Todo should be completed');
    
    app.toggleTodo(1);
    assert(!app.todos[0].completed, 'Todo should be uncompleted');
});

runner.test('TodoApp can edit a todo', () => {
    localStorage.clear();
    const app = new TodoApp();
    
    app.todos = [{ id: 1, text: 'Original', completed: false }];
    
    app.saveEdit(1, 'Updated');
    
    assertEquals(app.todos[0].text, 'Updated', 'Todo text should be updated');
});

runner.test('TodoApp filters active todos correctly', () => {
    localStorage.clear();
    const app = new TodoApp();
    
    app.todos = [
        { id: 1, text: 'Active', completed: false },
        { id: 2, text: 'Completed', completed: true },
        { id: 3, text: 'Also Active', completed: false }
    ];
    
    app.currentFilter = 'active';
    const filtered = app.getFilteredTodos();
    
    assertEquals(filtered.length, 2, 'Should have 2 active todos');
    assert(filtered.every(t => !t.completed), 'All filtered todos should be active');
});

runner.test('TodoApp filters completed todos correctly', () => {
    localStorage.clear();
    const app = new TodoApp();
    
    app.todos = [
        { id: 1, text: 'Active', completed: false },
        { id: 2, text: 'Completed', completed: true },
        { id: 3, text: 'Also Completed', completed: true }
    ];
    
    app.currentFilter = 'completed';
    const filtered = app.getFilteredTodos();
    
    assertEquals(filtered.length, 2, 'Should have 2 completed todos');
    assert(filtered.every(t => t.completed), 'All filtered todos should be completed');
});

runner.test('TodoApp shows all todos with "all" filter', () => {
    localStorage.clear();
    const app = new TodoApp();
    
    app.todos = [
        { id: 1, text: 'Active', completed: false },
        { id: 2, text: 'Completed', completed: true }
    ];
    
    app.currentFilter = 'all';
    const filtered = app.getFilteredTodos();
    
    assertEquals(filtered.length, 2, 'Should show all todos');
});

runner.test('TodoApp can clear completed todos', () => {
    localStorage.clear();
    const app = new TodoApp();
    
    app.todos = [
        { id: 1, text: 'Active', completed: false },
        { id: 2, text: 'Completed 1', completed: true },
        { id: 3, text: 'Completed 2', completed: true }
    ];
    
    app.clearCompleted();
    
    assertEquals(app.todos.length, 1, 'Should have 1 todo left');
    assert(!app.todos[0].completed, 'Remaining todo should be active');
});

runner.test('TodoApp persists todos to localStorage', () => {
    localStorage.clear();
    const app = new TodoApp();
    
    app.todos = [
        { id: 1, text: 'Persistent todo', completed: false }
    ];
    
    app.saveToStorage();
    
    const stored = localStorage.getItem('todos');
    assert(stored !== null, 'Todos should be stored in localStorage');
    
    const parsed = JSON.parse(stored);
    assertEquals(parsed.length, 1, 'Should have 1 stored todo');
    assertEquals(parsed[0].text, 'Persistent todo', 'Stored todo text should match');
});

runner.test('TodoApp loads todos from localStorage', () => {
    localStorage.clear();
    
    const testData = [
        { id: 1, text: 'Loaded todo', completed: false }
    ];
    localStorage.setItem('todos', JSON.stringify(testData));
    
    const app = new TodoApp();
    
    assertEquals(app.todos.length, 1, 'Should load 1 todo');
    assertEquals(app.todos[0].text, 'Loaded todo', 'Loaded todo text should match');
});

runner.test('TodoApp escapes HTML in todo text', () => {
    localStorage.clear();
    const app = new TodoApp();
    
    const escaped = app.escapeHtml('<script>alert("xss")</script>');
    
    assert(!escaped.includes('<script>'), 'HTML should be escaped');
    assert(escaped.includes('&lt;'), 'Should contain escaped characters');
});

runner.test('TodoApp does not save edit with empty text', () => {
    localStorage.clear();
    const app = new TodoApp();
    
    app.todos = [{ id: 1, text: 'Original', completed: false }];
    
    app.saveEdit(1, '   ');
    
    assertEquals(app.todos[0].text, 'Original', 'Todo text should not change with empty input');
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        runner.run();
    }, 100);
});
