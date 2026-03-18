# Best Practices Guide

This document outlines development best practices, patterns, and guidelines that should be followed when working on this project or similar applications. These practices help ensure code quality, maintainability, and team productivity.

## Table of Contents

1. [Code Quality Practices](#code-quality-practices)
2. [JavaScript Best Practices](#javascript-best-practices)
3. [CSS Best Practices](#css-best-practices)
4. [HTML Best Practices](#html-best-practices)
5. [Performance Best Practices](#performance-best-practices)
6. [Security Best Practices](#security-best-practices)
7. [Accessibility Best Practices](#accessibility-best-practices)
8. [Testing Best Practices](#testing-best-practices)
9. [Documentation Best Practices](#documentation-best-practices)
10. [Debugging and Development Workflow](#debugging-and-development-workflow)

## Code Quality Practices

### 1. Single Responsibility Principle

Each function should have one clear responsibility:

✅ **Good:**
```javascript
// Each function has a single, clear purpose
function validateTodoText(text) {
    if (!text || text.trim().length === 0) {
        throw new Error('Todo text cannot be empty');
    }
    if (text.length > MAX_TODO_LENGTH) {
        throw new Error(`Todo text cannot exceed ${MAX_TODO_LENGTH} characters`);
    }
    return true;
}

function createTodoObject(text) {
    return {
        id: generateUniqueId(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now()
    };
}

function addTodoToList(todoText) {
    validateTodoText(todoText);
    const newTodo = createTodoObject(todoText);
    todos.push(newTodo);
    saveTodos();
    renderTodos();
    return newTodo;
}
```

❌ **Bad:**
```javascript
// Function does too many things
function addTodo(text) {
    // Validation
    if (!text || text.trim().length === 0) {
        alert('Todo text cannot be empty');
        return;
    }
    
    // Creation
    const todo = {
        id: Math.random().toString(),
        text: text,
        completed: false,
        createdAt: Date.now()
    };
    
    // Storage
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    
    // UI Update
    const li = document.createElement('li');
    li.innerHTML = `<span>${text}</span><button>Delete</button>`;
    document.getElementById('todo-list').appendChild(li);
    
    // Analytics
    trackEvent('todo_added', { text_length: text.length });
}
```

### 2. DRY (Don't Repeat Yourself)

Eliminate code duplication by creating reusable functions:

✅ **Good:**
```javascript
// Reusable utility functions
function createElement(tag, className = '', textContent = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

function showNotification(message, type = 'info') {
    const notification = createElement('div', `notification notification--${type}`, message);
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Usage
function handleSuccess() {
    showNotification('Todo added successfully!', 'success');
}

function handleError() {
    showNotification('Failed to add todo', 'error');
}
```

❌ **Bad:**
```javascript
// Repeated code
function handleSuccess() {
    const notification = document.createElement('div');
    notification.className = 'notification notification--success';
    notification.textContent = 'Todo added successfully!';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function handleError() {
    const notification = document.createElement('div');
    notification.className = 'notification notification--error';
    notification.textContent = 'Failed to add todo';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}
```

### 3. Consistent Error Handling

Implement consistent error handling patterns:

✅ **Good:**
```javascript
class TodoError extends Error {
    constructor(message, code = 'GENERIC_ERROR') {
        super(message);
        this.name = 'TodoError';
        this.code = code;
    }
}

function validateTodoInput(text) {
    if (!text || typeof text !== 'string') {
        throw new TodoError('Todo text must be a non-empty string', 'INVALID_INPUT');
    }
    
    if (text.trim().length === 0) {
        throw new TodoError('Todo text cannot be empty', 'EMPTY_INPUT');
    }
    
    if (text.length > MAX_TODO_LENGTH) {
        throw new TodoError(
            `Todo text cannot exceed ${MAX_TODO_LENGTH} characters`, 
            'TEXT_TOO_LONG'
        );
    }
}

function handleTodoError(error) {
    console.error('Todo operation failed:', error);
    
    const userMessage = error instanceof TodoError 
        ? error.message 
        : 'An unexpected error occurred';
    
    showNotification(userMessage, 'error');
    
    // Optional: Send to analytics/monitoring service
    if (typeof trackError === 'function') {
        trackError(error);
    }
}

// Usage
try {
    validateTodoInput(userInput);
    addTodo(userInput);
} catch (error) {
    handleTodoError(error);
}
```

## JavaScript Best Practices

### 1. Use Modern JavaScript Features

Leverage ES6+ features for cleaner, more readable code:

✅ **Good:**
```javascript
// Destructuring
const { todos, currentFilter } = applicationState;
const [firstTodo, ...restTodos] = todos;

// Template literals
const todoHtml = `
    <div class="todo-item ${todo.completed ? 'todo-item--completed' : ''}">
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="delete-btn" data-id="${todo.id}">Delete</button>
    </div>
`;

// Arrow functions for short operations
const activeTodos = todos.filter(todo => !todo.completed);
const todoTexts = todos.map(todo => todo.text);

// Default parameters
function createTodo(text, priority = 'normal', tags = []) {
    return {
        id: generateId(),
        text,
        priority,
        tags,
        completed: false,
        createdAt: Date.now()
    };
}

// Async/await for asynchronous operations
async function saveTodosToServer(todos) {
    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todos)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to save todos:', error);
        throw error;
    }
}
```

### 2. Immutable State Updates

Always create new objects/arrays instead of mutating existing ones:

✅ **Good:**
```javascript
// Immutable array operations
function addTodo(todos, newTodo) {
    return [...todos, newTodo];
}

function updateTodo(todos, id, updates) {
    return todos.map(todo => 
        todo.id === id 
            ? { ...todo, ...updates, updatedAt: Date.now() }
            : todo
    );
}

function removeTodo(todos, id) {
    return todos.filter(todo => todo.id !== id);
}

// Immutable object updates
function updateApplicationState(currentState, updates) {
    return {
        ...currentState,
        ...updates,
        lastModified: Date.now()
    };
}
```

❌ **Bad:**
```javascript
// Mutating existing arrays/objects
function addTodo(todos, newTodo) {
    todos.push(newTodo); // Mutates original array
    return todos;
}

function updateTodo(todos, id, updates) {
    const todo = todos.find(t => t.id === id);
    todo.text = updates.text; // Mutates original object
    todo.updatedAt = Date.now();
    return todos;
}
```

### 3. Pure Functions When Possible

Write functions that don't have side effects:

✅ **Good:**
```javascript
// Pure functions - same input always produces same output
function calculateCompletionPercentage(todos) {
    if (todos.length === 0) return 0;
    const completed = todos.filter(todo => todo.completed).length;
    return Math.round((completed / todos.length) * 100);
}

function formatTodoForDisplay(todo) {
    return {
        ...todo,
        formattedDate: new Date(todo.createdAt).toLocaleDateString(),
        isOverdue: todo.dueDate && new Date(todo.dueDate) < new Date()
    };
}

function filterTodosByStatus(todos, status) {
    const filters = {
        all: () => todos,
        active: () => todos.filter(todo => !todo.completed),
        completed: () => todos.filter(todo => todo.completed)
    };
    
    return filters[status] ? filters[status]() : todos;
}
```

❌ **Bad:**
```javascript
// Functions with side effects
function calculateCompletionPercentage(todos) {
    const percentage = /* calculation */;
    // Side effect: updating global state
    document.getElementById('progress').textContent = `${percentage}%`;
    // Side effect: logging
    console.log('Percentage calculated:', percentage);
    return percentage;
}
```

## CSS Best Practices

### 1. Mobile-First Responsive Design

Start with mobile styles and enhance for larger screens:

✅ **Good:**
```css
/* Mobile styles first (default) */
.todo-container {
    padding: 15px;
    font-size: 16px;
}

.todo-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Tablet and up */
@media (min-width: 768px) {
    .todo-container {
        padding: 30px;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .todo-list {
        gap: 15px;
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .todo-container {
        padding: 40px;
        max-width: 800px;
    }
    
    .todo-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
}
```

### 2. Use CSS Custom Properties

Leverage CSS variables for maintainable styling:

✅ **Good:**
```css
:root {
    /* Colors */
    --color-primary: #667eea;
    --color-primary-dark: #5568d3;
    --color-secondary: #764ba2;
    --color-success: #4ade80;
    --color-error: #f87171;
    --color-warning: #fbbf24;
    
    /* Typography */
    --font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.5rem;
    
    /* Spacing */
    --spacing-xs: 0.5rem;
    --spacing-sm: 0.75rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    
    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.15);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.2);
    
    /* Border radius */
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.5rem;
    --border-radius-lg: 1rem;
}

.button {
    background-color: var(--color-primary);
    color: white;
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: var(--border-radius-md);
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;
}

.button:hover {
    background-color: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
}
```

### 3. Component-Based CSS Organization

Organize styles by component for better maintainability:

```css
/* Components/_button.css */
.button {
    /* Base button styles */
}

.button--primary {
    background-color: var(--color-primary);
}

.button--secondary {
    background-color: var(--color-secondary);
}

.button--small {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
}

/* Components/_todo-item.css */
.todo-item {
    display: flex;
    align-items: center;
    padding: var(--spacing-md);
    background: white;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s ease;
}

.todo-item:hover {
    box-shadow: var(--shadow-md);
}

.todo-item--completed {
    opacity: 0.7;
}

.todo-item__checkbox {
    margin-right: var(--spacing-sm);
}

.todo-item__text {
    flex: 1;
    color: var(--color-text);
}

.todo-item--completed .todo-item__text {
    text-decoration: line-through;
    color: var(--color-text-muted);
}
```

## Performance Best Practices

### 1. Optimize DOM Operations

Cache elements and batch DOM updates:

✅ **Good:**
```javascript
// Cache frequently accessed elements
const domCache = {
    todoList: document.getElementById('todo-list'),
    todoInput: document.getElementById('todo-input'),
    addButton: document.getElementById('add-btn'),
    todoCount: document.getElementById('todo-count')
};

// Batch DOM updates using DocumentFragment
function renderTodoList(todos) {
    const fragment = document.createDocumentFragment();
    
    todos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        fragment.appendChild(todoElement);
    });
    
    // Single DOM update
    domCache.todoList.innerHTML = '';
    domCache.todoList.appendChild(fragment);
}

// Debounce expensive operations
const debouncedSearch = debounce(function(query) {
    const filteredTodos = searchTodos(query);
    renderTodoList(filteredTodos);
}, 300);
```

### 2. Implement Debouncing

Limit the rate of function calls for better performance:

```javascript
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Usage for search functionality
const searchInput = document.getElementById('search-input');
const debouncedSearch = debounce(function(event) {
    const query = event.target.value;
    performSearch(query);
}, 300);

searchInput.addEventListener('input', debouncedSearch);
```

### 3. Lazy Loading and Code Splitting

Load code only when needed:

```javascript
// Dynamic imports for feature modules
async function loadAdvancedFeatures() {
    const { AdvancedTodoManager } = await import('./modules/advanced-todo-manager.js');
    return new AdvancedTodoManager();
}

// Intersection Observer for lazy loading
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadTodoContent(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements that should be lazy-loaded
document.querySelectorAll('.todo-item-placeholder').forEach(el => {
    observer.observe(el);
});
```

## Security Best Practices

### 1. Input Sanitization

Always sanitize user input before displaying or storing:

✅ **Good:**
```javascript
// HTML escaping utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Input sanitization
function sanitizeTodoText(text) {
    if (typeof text !== 'string') {
        throw new Error('Input must be a string');
    }
    
    // Remove excessive whitespace
    const cleaned = text.trim().replace(/\s+/g, ' ');
    
    // Remove potentially harmful characters
    const sanitized = cleaned.replace(/[<>\"']/g, '');
    
    return sanitized;
}

// Safe DOM insertion
function createTodoTextElement(todoText) {
    const textElement = document.createElement('span');
    textElement.className = 'todo-text';
    textElement.textContent = todoText; // Safe - automatically escapes HTML
    return textElement;
}
```

### 2. Secure Data Storage

Implement secure practices for local storage:

```javascript
// Encrypt sensitive data before storing
function encryptData(data, key) {
    // Implementation would use proper encryption library
    return btoa(JSON.stringify(data)); // Simplified example
}

function decryptData(encryptedData, key) {
    // Implementation would use proper decryption
    return JSON.parse(atob(encryptedData)); // Simplified example
}

// Secure storage wrapper
const SecureStorage = {
    setItem(key, value) {
        try {
            const encrypted = encryptData(value, 'user-specific-key');
            localStorage.setItem(key, encrypted);
        } catch (error) {
            console.error('Failed to store data securely:', error);
        }
    },
    
    getItem(key) {
        try {
            const encrypted = localStorage.getItem(key);
            return encrypted ? decryptData(encrypted, 'user-specific-key') : null;
        } catch (error) {
            console.error('Failed to retrieve data securely:', error);
            return null;
        }
    }
};
```

## Accessibility Best Practices

### 1. Semantic HTML

Use proper HTML elements for better accessibility:

✅ **Good:**
```html
<!-- Proper semantic structure -->
<main class="todo-app">
    <header>
        <h1>My Todo List</h1>
    </header>
    
    <form class="todo-form" role="form" aria-label="Add new todo">
        <label for="todo-input" class="visually-hidden">
            Enter a new todo item
        </label>
        <input 
            id="todo-input" 
            type="text" 
            placeholder="What needs to be done?"
            aria-describedby="input-help"
            required
        >
        <div id="input-help" class="help-text">
            Press Enter or click Add to create a new todo
        </div>
        <button type="submit" aria-label="Add todo">Add</button>
    </form>
    
    <section aria-live="polite" aria-label="Todo list">
        <h2 class="visually-hidden">Current todos</h2>
        <ul class="todo-list" role="list">
            <!-- Todo items will be inserted here -->
        </ul>
    </section>
</main>
```

### 2. ARIA Attributes and Keyboard Navigation

Implement proper ARIA attributes and keyboard support:

```javascript
function createAccessibleTodoItem(todo) {
    const listItem = document.createElement('li');
    listItem.className = 'todo-item';
    listItem.setAttribute('role', 'listitem');
    listItem.setAttribute('aria-label', `Todo: ${todo.text}`);
    
    // Checkbox with proper labeling
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `todo-checkbox-${todo.id}`;
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-describedby', `todo-text-${todo.id}`);
    
    // Label for checkbox
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.className = 'visually-hidden';
    label.textContent = todo.completed ? 'Mark as incomplete' : 'Mark as complete';
    
    // Todo text
    const textSpan = document.createElement('span');
    textSpan.id = `todo-text-${todo.id}`;
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    
    // Delete button with proper labeling
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.setAttribute('aria-label', `Delete todo: ${todo.text}`);
    deleteButton.textContent = 'Delete';
    
    // Keyboard navigation
    deleteButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            deleteTodo(todo.id);
        }
    });
    
    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(textSpan);
    listItem.appendChild(deleteButton);
    
    return listItem;
}

// Focus management
function manageFocusAfterTodoDelete(deletedTodoId) {
    const nextTodo = findNextTodoAfterDelete(deletedTodoId);
    if (nextTodo) {
        const nextButton = document.querySelector(`button[data-id="${nextTodo.id}"]`);
        nextButton?.focus();
    } else {
        document.getElementById('todo-input').focus();
    }
}
```

## Testing Best Practices

### 1. Test Structure

Organize tests clearly with descriptive names:

```javascript
// tests/todo-manager.test.js
describe('TodoManager', () => {
    describe('createTodo', () => {
        it('should create a todo with required properties', () => {
            const todoText = 'Test todo';
            const todo = TodoManager.createTodo(todoText);
            
            expect(todo).toHaveProperty('id');
            expect(todo).toHaveProperty('text', todoText);
            expect(todo).toHaveProperty('completed', false);
            expect(todo).toHaveProperty('createdAt');
            expect(typeof todo.createdAt).toBe('number');
        });
        
        it('should throw error for invalid input', () => {
            expect(() => TodoManager.createTodo('')).toThrow('Todo text cannot be empty');
            expect(() => TodoManager.createTodo(null)).toThrow('Todo text must be a string');
        });
    });
    
    describe('toggleTodoCompletion', () => {
        it('should toggle completion status of specified todo', () => {
            const todos = [
                { id: '1', text: 'Todo 1', completed: false },
                { id: '2', text: 'Todo 2', completed: true }
            ];
            
            const result = TodoManager.toggleTodoCompletion(todos, '1');
            
            expect(result[0].completed).toBe(true);
            expect(result[1].completed).toBe(true); // Should remain unchanged
        });
    });
});
```

### 2. Test Utilities

Create reusable test utilities:

```javascript
// tests/test-utils.js
export const TestUtils = {
    createMockTodo(overrides = {}) {
        return {
            id: 'test-id',
            text: 'Test todo',
            completed: false,
            createdAt: Date.now(),
            ...overrides
        };
    },
    
    createMockTodos(count = 3) {
        return Array.from({ length: count }, (_, index) => 
            this.createMockTodo({
                id: `todo-${index}`,
                text: `Todo ${index + 1}`,
                completed: index % 2 === 0
            })
        );
    },
    
    setupDOM() {
        document.body.innerHTML = `
            <div id="todo-app">
                <input id="todo-input" type="text">
                <button id="add-btn">Add</button>
                <ul id="todo-list"></ul>
            </div>
        `;
    },
    
    cleanupDOM() {
        document.body.innerHTML = '';
    }
};
```

## Documentation Best Practices

### 1. README Documentation

Include comprehensive project information:

```markdown
# Project Name

Brief description of what the project does.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

Step-by-step installation instructions.

## Usage

Code examples showing how to use the project.

## API Documentation

Detailed API documentation with examples.

## Contributing

Guidelines for contributors.

## License

License information.
```

### 2. Code Documentation

Document complex functions with JSDoc:

```javascript
/**
 * Filters and sorts todos based on specified criteria
 * @param {Array<Object>} todos - Array of todo objects
 * @param {Object} options - Filtering and sorting options
 * @param {string} [options.status='all'] - Filter by status: 'all', 'active', 'completed'
 * @param {string} [options.priority] - Filter by priority: 'low', 'normal', 'high'
 * @param {string} [options.sortBy='createdAt'] - Sort field: 'createdAt', 'text', 'priority'
 * @param {string} [options.sortOrder='desc'] - Sort order: 'asc', 'desc'
 * @returns {Array<Object>} Filtered and sorted todos
 * @throws {Error} When invalid sort field is provided
 * @example
 * // Get active todos sorted by creation date
 * const activeTodos = filterAndSortTodos(todos, { 
 *   status: 'active', 
 *   sortBy: 'createdAt' 
 * });
 * 
 * @example
 * // Get high priority todos sorted alphabetically
 * const priorityTodos = filterAndSortTodos(todos, { 
 *   priority: 'high', 
 *   sortBy: 'text', 
 *   sortOrder: 'asc' 
 * });
 */
function filterAndSortTodos(todos, options = {}) {
    // Implementation...
}
```

## Debugging and Development Workflow

### 1. Debugging Strategies

Use systematic debugging approaches:

```javascript
// Debug utility for development
const Debug = {
    log(label, data) {
        if (process.env.NODE_ENV === 'development') {
            console.group(`🐛 ${label}`);
            console.log(data);
            console.trace();
            console.groupEnd();
        }
    },
    
    time(label) {
        if (process.env.NODE_ENV === 'development') {
            console.time(label);
        }
    },
    
    timeEnd(label) {
        if (process.env.NODE_ENV === 'development') {
            console.timeEnd(label);
        }
    },
    
    table(data) {
        if (process.env.NODE_ENV === 'development') {
            console.table(data);
        }
    }
};

// Usage in functions
function processTodos(todos) {
    Debug.time('processTodos');
    Debug.log('Input todos', todos);
    
    const result = todos.map(todo => {
        Debug.log('Processing todo', todo);
        return transformTodo(todo);
    });
    
    Debug.table(result);
    Debug.timeEnd('processTodos');
    return result;
}
```

### 2. Development Environment Setup

Set up a productive development environment:

```javascript
// development-config.js
const developmentConfig = {
    enableDebugMode: true,
    enableHotReload: true,
    mockAPI: true,
    logLevel: 'debug',
    
    // Feature flags for development
    features: {
        advancedFiltering: true,
        exportTodos: true,
        darkMode: true
    }
};

// Initialize development helpers
if (process.env.NODE_ENV === 'development') {
    // Add global development utilities
    window.TodoApp = {
        getState: () => applicationState,
        getTodos: () => applicationState.todos,
        addTestTodos: () => {
            const testTodos = TestUtils.createMockTodos(10);
            testTodos.forEach(todo => addTodo(todo.text));
        },
        clearAllTodos: () => {
            applicationState.todos = [];
            saveTodos();
            renderTodos();
        }
    };
    
    console.log('Development mode enabled. TodoApp utilities available in console.');
}
```

These best practices ensure code quality, maintainability, and provide a solid foundation for scaling the application while maintaining consistency and reliability.