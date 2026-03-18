# AI Agent Memory Guide

This document contains critical coding patterns, conventions, and practices that AI agents should remember when working on this codebase or similar projects. Store these principles in your memory for consistent application across all coding tasks.

## Core Memory Points

### 1. Variable Naming Principles

**ALWAYS REMEMBER:**
- Variable names should be descriptive and self-documenting
- Use `camelCase` for variables and functions
- Use `SCREAMING_SNAKE_CASE` for constants
- Use `kebab-case` for CSS classes and HTML IDs
- Boolean variables should be questions: `isCompleted`, `hasPermission`, `canEdit`
- Arrays should be plural nouns: `todoItems`, `users`, `errorMessages`
- DOM elements should include element type: `todoInput`, `addButton`, `todoList`

**Examples to Remember:**
```javascript
// ✅ GOOD - Clear and descriptive
const todoTextInput = document.getElementById('todo-input');
const activeTodoCount = todos.filter(todo => !todo.isCompleted).length;
const isUserLoggedIn = user.status === 'active';
const completedTodoItems = [];

// ❌ BAD - Unclear and abbreviated
const inp = document.getElementById('todo-input');
const cnt = todos.filter(t => !t.c).length;
const flag = user.status === 'active';
const completed = [];
```

### 2. Function Design Principles

**ALWAYS REMEMBER:**
- Functions should have a single responsibility
- Use verb + noun pattern: `addTodo`, `validateInput`, `renderList`
- Event handlers should describe the event: `handleButtonClick`, `handleKeyPress`
- Functions should be pure when possible (no side effects)
- Always validate inputs and handle errors gracefully
- Use descriptive JSDoc comments for complex functions

**Examples to Remember:**
```javascript
// ✅ GOOD - Clear responsibility and naming
function validateTodoText(text) {
    if (!text || text.trim().length === 0) {
        throw new Error('Todo text cannot be empty');
    }
    return true;
}

function createTodoObject(text) {
    return {
        id: generateUniqueId(),
        text: text.trim(),
        isCompleted: false,
        createdAt: Date.now()
    };
}

function handleAddButtonClick(event) {
    event.preventDefault();
    // Handle the specific event with clear logic
}

// ❌ BAD - Unclear purpose and generic naming
function doStuff(data) {
    // Multiple responsibilities mixed together
    if (data) {
        const item = { id: Date.now(), text: data, done: false };
        list.push(item);
        render();
        save();
    }
}
```

### 3. Code Organization Memory Points

**ALWAYS REMEMBER:**
- Group related code together with clear section comments
- Separate constants, state, DOM elements, functions, and initialization
- Use immutable state updates (create new objects/arrays instead of mutating)
- Cache DOM elements to avoid repeated queries
- Implement proper error handling for all operations
- Use configuration objects for related constants

**Code Organization Template:**
```javascript
// 1. Configuration and Constants
const APP_CONFIG = {
    STORAGE_KEY: 'app_data',
    MAX_LENGTH: 200
};

// 2. Application State
let applicationState = {
    items: [],
    currentFilter: 'all'
};

// 3. DOM Element Cache
const domElements = {
    input: document.getElementById('input'),
    button: document.getElementById('button')
};

// 4. Main Functions (public API)
function initializeApplication() {}
function addNewItem() {}

// 5. Event Handlers
function handleButtonClick(event) {}

// 6. Utility Functions
function validateInput(text) {}

// 7. Initialization
document.addEventListener('DOMContentLoaded', initializeApplication);
```

### 4. Error Handling Memory Points

**ALWAYS REMEMBER:**
- Always implement error handling for external dependencies (localStorage, APIs)
- Create custom error classes for different error types
- Provide user-friendly error messages
- Log technical details for debugging
- Gracefully degrade when operations fail
- Never let errors crash the entire application

**Error Handling Template:**
```javascript
// Custom error class
class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

// Validation with proper error handling
function validateUserInput(input) {
    if (!input || typeof input !== 'string') {
        throw new ValidationError('Input must be a string', 'input');
    }
    
    if (input.trim().length === 0) {
        throw new ValidationError('Input cannot be empty', 'input');
    }
    
    return true;
}

// Storage operations with fallback
function saveToStorage(data) {
    try {
        localStorage.setItem('key', JSON.stringify(data));
    } catch (error) {
        console.error('Storage failed:', error);
        showUserMessage('Unable to save changes', 'warning');
    }
}
```

### 5. Performance Memory Points

**ALWAYS REMEMBER:**
- Cache DOM element references instead of querying repeatedly
- Use DocumentFragment for batch DOM updates
- Debounce expensive operations (search, API calls)
- Use event delegation for dynamic content
- Avoid unnecessary re-renders
- Minimize DOM manipulation operations

**Performance Examples:**
```javascript
// ✅ GOOD - Cache elements and batch updates
const domCache = {
    list: document.getElementById('list'),
    input: document.getElementById('input')
};

function renderList(items) {
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
        const element = createElement(item);
        fragment.appendChild(element);
    });
    domCache.list.appendChild(fragment); // Single DOM update
}

// ✅ GOOD - Debounce expensive operations
const debouncedSearch = debounce(performSearch, 300);
```

### 6. Accessibility Memory Points

**ALWAYS REMEMBER:**
- Use semantic HTML elements (button, form, header, main)
- Add ARIA labels for screen readers
- Ensure keyboard navigation works
- Provide proper focus management
- Use aria-live regions for dynamic content updates
- Test with keyboard-only navigation

**Accessibility Examples:**
```javascript
// ✅ GOOD - Accessible element creation
function createAccessibleButton(text, action) {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('aria-label', `${text} button`);
    button.addEventListener('click', action);
    return button;
}

// ✅ GOOD - Proper form labeling
const input = document.createElement('input');
input.id = 'todo-input';
input.setAttribute('aria-describedby', 'input-help');

const label = document.createElement('label');
label.htmlFor = 'todo-input';
label.textContent = 'Enter todo text';
```

### 7. Security Memory Points

**ALWAYS REMEMBER:**
- Always escape user input when inserting into DOM
- Use `textContent` instead of `innerHTML` for user data
- Validate and sanitize all user inputs
- Never trust data from external sources
- Implement proper input length limits
- Use prepared statements for database queries (when applicable)

**Security Examples:**
```javascript
// ✅ GOOD - Safe DOM insertion
element.textContent = userInput; // Automatically escapes HTML

// ✅ GOOD - Input sanitization
function sanitizeInput(input) {
    return input.trim().replace(/[<>\"']/g, '');
}

// ✅ GOOD - HTML escaping utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

### 8. Testing Memory Points

**ALWAYS REMEMBER:**
- Write tests with descriptive names that explain behavior
- Test both success and error cases
- Create reusable test utilities
- Test user interactions, not implementation details
- Mock external dependencies
- Keep tests simple and focused

**Testing Examples:**
```javascript
describe('TodoManager', () => {
    describe('addTodo', () => {
        it('should create a todo with required properties', () => {
            const todo = TodoManager.addTodo('Test todo');
            expect(todo).toHaveProperty('id');
            expect(todo).toHaveProperty('text', 'Test todo');
            expect(todo).toHaveProperty('isCompleted', false);
        });
        
        it('should throw error for empty input', () => {
            expect(() => TodoManager.addTodo('')).toThrow('Todo text cannot be empty');
        });
    });
});
```

## Critical Patterns to Always Apply

### 1. Immutable State Updates
```javascript
// ✅ Always create new objects/arrays
const newState = {
    ...currentState,
    todos: [...currentState.todos, newTodo]
};

// ❌ Never mutate existing state
currentState.todos.push(newTodo);
```

### 2. Proper Event Handler Naming
```javascript
// ✅ Descriptive event handler names
function handleAddButtonClick(event) {}
function handleInputKeyPress(event) {}
function handleFilterChange(filterType) {}

// ❌ Generic or unclear names
function onClick(event) {}
function keypress(e) {}
function change(type) {}
```

### 3. Configuration Over Magic Numbers
```javascript
// ✅ Use configuration constants
const CONFIG = {
    MAX_TODO_LENGTH: 200,
    DEBOUNCE_DELAY: 300,
    STORAGE_KEY: 'todos'
};

if (text.length > CONFIG.MAX_TODO_LENGTH) {
    throw new Error(`Text too long (max: ${CONFIG.MAX_TODO_LENGTH})`);
}

// ❌ Magic numbers scattered throughout code
if (text.length > 200) {
    throw new Error('Text too long');
}
```

### 4. Comprehensive Error Handling
```javascript
// ✅ Always handle potential errors
function loadData() {
    try {
        const data = localStorage.getItem('key');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to load data:', error);
        return []; // Graceful fallback
    }
}

// ❌ Ignoring potential errors
function loadData() {
    const data = localStorage.getItem('key');
    return JSON.parse(data); // Can throw error
}
```

## Anti-Patterns to Always Avoid

### 1. Generic or Abbreviated Names
```javascript
// ❌ NEVER do this
const inp = document.getElementById('input');
const btn = document.getElementById('button');
let data = [];
function update() {}
function get() {}

// ✅ ALWAYS do this
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
let todoItems = [];
function updateTodoList() {}
function getTodoById() {}
```

### 2. Functions with Multiple Responsibilities
```javascript
// ❌ NEVER do this - multiple responsibilities
function addTodoAndRender(text) {
    // Validation
    if (!text) return;
    
    // Creation
    const todo = { id: Date.now(), text, completed: false };
    
    // Storage
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    
    // Rendering
    const li = document.createElement('li');
    li.innerHTML = text;
    document.getElementById('list').appendChild(li);
    
    // Analytics
    trackEvent('todo_added');
}

// ✅ ALWAYS do this - single responsibilities
function validateTodoText(text) {
    if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
    }
}

function createTodo(text) {
    return {
        id: generateId(),
        text: text.trim(),
        isCompleted: false
    };
}

function addTodo(text) {
    validateTodoText(text);
    const todo = createTodo(text);
    saveTodo(todo);
    renderTodoList();
    trackEvent('todo_added');
}
```

### 3. Direct DOM Manipulation Without Caching
```javascript
// ❌ NEVER do this - repeated queries
function updateUI() {
    document.getElementById('count').textContent = '5';
    document.getElementById('count').style.color = 'blue';
    document.getElementById('count').classList.add('highlight');
}

// ✅ ALWAYS do this - cache elements
const countElement = document.getElementById('count');
function updateUI() {
    countElement.textContent = '5';
    countElement.style.color = 'blue';
    countElement.classList.add('highlight');
}
```

## Memory Validation Checklist

Before completing any coding task, always verify:

- [ ] Are all variable names descriptive and meaningful?
- [ ] Do function names clearly indicate their purpose?
- [ ] Is error handling implemented for all external operations?
- [ ] Are DOM elements cached appropriately?
- [ ] Is user input properly validated and sanitized?
- [ ] Are state updates immutable?
- [ ] Is the code organized into logical sections?
- [ ] Are constants used instead of magic numbers?
- [ ] Is accessibility considered in UI elements?
- [ ] Are there proper JSDoc comments for complex functions?

**Remember: These patterns and principles should be automatically applied to every piece of code you write. They are not optional - they are fundamental requirements for maintainable, professional code.**