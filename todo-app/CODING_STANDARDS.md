# Coding Standards and Guidelines

This document outlines the coding standards and guidelines to follow when working on this project. These standards ensure consistency, maintainability, and readability across the codebase.

## Table of Contents

1. [Variable Naming Conventions](#variable-naming-conventions)
2. [Function Naming Conventions](#function-naming-conventions)
3. [Code Structure](#code-structure)
4. [Documentation](#documentation)
5. [Error Handling](#error-handling)
6. [Constants and Configuration](#constants-and-configuration)
7. [DOM Manipulation](#dom-manipulation)
8. [Event Handling](#event-handling)

## Variable Naming Conventions

### Use Descriptive and Meaningful Names

✅ **Good Examples:**
```javascript
// Clear and descriptive
const userInputElement = document.getElementById('todo-input');
const activeTasksCount = todos.filter(task => !task.isCompleted).length;
const currentFilterType = 'all';

// Boolean variables should be questions or states
const isTaskCompleted = todo.completed;
const hasUnsavedChanges = false;
const canDeleteTask = user.permissions.includes('delete');

// Arrays should be plural nouns
const todoItems = [];
const completedTasks = [];
const pendingNotifications = [];
```

❌ **Bad Examples:**
```javascript
// Too short and unclear
const inp = document.getElementById('todo-input');
const cnt = todos.filter(t => !t.c).length;
const f = 'all';

// Not descriptive
const data = [];
const thing = {};
const temp = null;
```

### Naming Patterns by Type

| Type | Pattern | Example |
|------|---------|---------|
| Variables | camelCase | `todoInput`, `activeCount` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_TODO_LENGTH`, `API_BASE_URL` |
| Functions | camelCase (verb + noun) | `addTodo`, `validateInput` |
| Classes | PascalCase | `TodoManager`, `TaskValidator` |
| Files | kebab-case | `todo-manager.js`, `task-validator.js` |
| DOM IDs | kebab-case | `todo-input`, `add-button` |
| CSS Classes | kebab-case | `todo-item`, `input-section` |

## Function Naming Conventions

### Use Verb + Noun Pattern

✅ **Good Examples:**
```javascript
// Clear action and target
function addTodo(todoText) { }
function deleteTodoById(todoId) { }
function validateUserInput(inputText) { }
function renderTodoList(todos) { }
function updateTaskStatus(taskId, isCompleted) { }

// Event handlers
function handleAddButtonClick(event) { }
function handleInputKeyPress(event) { }
function handleFilterChange(filterType) { }

// Utility functions
function formatDateForDisplay(date) { }
function sanitizeHtmlInput(htmlString) { }
function generateUniqueId() { }
```

❌ **Bad Examples:**
```javascript
// Unclear purpose
function doStuff() { }
function process(data) { }
function handle(e) { }

// Not descriptive
function add() { }
function update() { }
function get() { }
```

## Code Structure

### File Organization

```
todo-app/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css            # Main styles
│   ├── components.css      # Component-specific styles
│   └── utilities.css       # Utility classes
├── scripts/
│   ├── app.js              # Main application logic
│   ├── todo-manager.js     # Todo management functionality
│   ├── storage-manager.js  # Local storage operations
│   └── dom-helpers.js      # DOM manipulation utilities
├── docs/                   # Documentation
└── tests/                  # Test files
```

### Function Organization Within Files

```javascript
// 1. Constants and configuration
const APP_CONFIG = {
    MAX_TODO_LENGTH: 200,
    STORAGE_KEY: 'todoApp_todos',
    DEBOUNCE_DELAY: 300
};

// 2. State variables
let applicationState = {
    todos: [],
    currentFilter: 'all',
    isLoading: false
};

// 3. DOM element references
const domElements = {
    todoInput: document.getElementById('todo-input'),
    addButton: document.getElementById('add-btn'),
    todoList: document.getElementById('todo-list')
};

// 4. Main functions (public API)
function initializeApplication() { }
function addNewTodo(todoText) { }
function removeTodoById(todoId) { }

// 5. Event handlers
function handleAddButtonClick(event) { }
function handleTodoInputKeyPress(event) { }

// 6. Utility functions (private)
function validateTodoText(text) { }
function sanitizeUserInput(input) { }
function generateTimestamp() { }

// 7. Initialization
document.addEventListener('DOMContentLoaded', initializeApplication);
```

## Documentation

### Function Documentation

Every function should have JSDoc comments explaining:
- Purpose
- Parameters
- Return value
- Examples (for complex functions)

```javascript
/**
 * Adds a new todo item to the list
 * @param {string} todoText - The text content of the todo item
 * @param {string} [priority='normal'] - Priority level (low, normal, high)
 * @returns {Object|null} The created todo object or null if validation fails
 * @throws {Error} When todoText is empty or exceeds maximum length
 * @example
 * const newTodo = addNewTodo('Buy groceries', 'high');
 * if (newTodo) {
 *   console.log('Todo added successfully');
 * }
 */
function addNewTodo(todoText, priority = 'normal') {
    if (!validateTodoText(todoText)) {
        throw new Error('Invalid todo text provided');
    }
    
    const todoItem = createTodoObject(todoText, priority);
    applicationState.todos.push(todoItem);
    
    persistTodosToStorage();
    renderTodoList();
    
    return todoItem;
}
```

### Inline Comments

Use inline comments sparingly and only when the code needs explanation:

```javascript
// Calculate the completion percentage for progress display
const completionPercentage = (completedTasks / totalTasks) * 100;

// Debounce search input to avoid excessive API calls
const debouncedSearch = debounce(performSearch, APP_CONFIG.DEBOUNCE_DELAY);

// Convert Unix timestamp to human-readable format
const formattedDate = new Date(todo.createdAt * 1000).toLocaleDateString();
```

## Error Handling

### Use Descriptive Error Messages

```javascript
/**
 * Validates todo input text
 * @param {string} text - Text to validate
 * @returns {boolean} True if valid, false otherwise
 * @throws {Error} With descriptive message for invalid input
 */
function validateTodoText(text) {
    if (typeof text !== 'string') {
        throw new Error('Todo text must be a string');
    }
    
    if (text.trim().length === 0) {
        throw new Error('Todo text cannot be empty');
    }
    
    if (text.length > APP_CONFIG.MAX_TODO_LENGTH) {
        throw new Error(`Todo text cannot exceed ${APP_CONFIG.MAX_TODO_LENGTH} characters`);
    }
    
    return true;
}

/**
 * Safely saves todos to local storage with error handling
 */
function persistTodosToStorage() {
    try {
        const todosJson = JSON.stringify(applicationState.todos);
        localStorage.setItem(APP_CONFIG.STORAGE_KEY, todosJson);
    } catch (storageError) {
        console.error('Failed to save todos to storage:', storageError);
        showUserNotification('Unable to save changes. Please try again.', 'error');
    }
}
```

## Constants and Configuration

### Group Related Constants

```javascript
const APP_CONFIG = {
    // Storage
    STORAGE_KEY: 'todoApp_todos',
    STORAGE_VERSION: '1.0',
    
    // UI Limits
    MAX_TODO_LENGTH: 200,
    MAX_TODOS_PER_PAGE: 50,
    
    // Timing
    AUTO_SAVE_DELAY: 2000,
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 250,
    
    // API
    API_BASE_URL: '/api/v1',
    REQUEST_TIMEOUT: 5000
};

const TODO_STATUSES = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    ARCHIVED: 'archived'
};

const FILTER_TYPES = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed'
};
```

## DOM Manipulation

### Cache DOM Elements

```javascript
// Cache frequently accessed elements
const domElements = {
    todoInput: document.getElementById('todo-input'),
    addButton: document.getElementById('add-btn'),
    todoList: document.getElementById('todo-list'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    todoCounter: document.getElementById('todo-count')
};

/**
 * Creates a new todo list item element
 * @param {Object} todoData - Todo item data
 * @returns {HTMLElement} The created list item element
 */
function createTodoListItem(todoData) {
    const listItem = document.createElement('li');
    listItem.className = 'todo-item';
    listItem.dataset.todoId = todoData.id;
    
    if (todoData.isCompleted) {
        listItem.classList.add('completed');
    }
    
    listItem.innerHTML = `
        <input type="checkbox" 
               class="todo-checkbox" 
               ${todoData.isCompleted ? 'checked' : ''}>
        <span class="todo-text">${escapeHtml(todoData.text)}</span>
        <button class="delete-btn" aria-label="Delete todo">Delete</button>
    `;
    
    attachTodoEventListeners(listItem, todoData.id);
    
    return listItem;
}
```

## Event Handling

### Use Descriptive Event Handler Names

```javascript
/**
 * Handles the add todo button click event
 * @param {Event} clickEvent - The click event object
 */
function handleAddTodoButtonClick(clickEvent) {
    clickEvent.preventDefault();
    
    const todoText = domElements.todoInput.value.trim();
    if (!todoText) {
        focusOnTodoInput();
        return;
    }
    
    try {
        addNewTodo(todoText);
        clearTodoInput();
        focusOnTodoInput();
    } catch (validationError) {
        showUserNotification(validationError.message, 'error');
    }
}

/**
 * Handles keyboard input in the todo input field
 * @param {KeyboardEvent} keyboardEvent - The keyboard event object
 */
function handleTodoInputKeyPress(keyboardEvent) {
    if (keyboardEvent.key === 'Enter') {
        handleAddTodoButtonClick(keyboardEvent);
    } else if (keyboardEvent.key === 'Escape') {
        clearTodoInput();
    }
}

// Event listener registration
function attachEventListeners() {
    domElements.addButton.addEventListener('click', handleAddTodoButtonClick);
    domElements.todoInput.addEventListener('keypress', handleTodoInputKeyPress);
    domElements.filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterButtonClick);
    });
}
```

## Code Review Checklist

When reviewing code, ensure:

- [ ] Variable names are descriptive and meaningful
- [ ] Function names clearly indicate their purpose
- [ ] Functions are small and focused on a single responsibility
- [ ] Error handling is implemented where needed
- [ ] Constants are used instead of magic numbers
- [ ] DOM elements are cached appropriately
- [ ] Event handlers have descriptive names
- [ ] Code is properly documented with JSDoc comments
- [ ] No console.log statements remain in production code
- [ ] Code follows the established patterns and conventions