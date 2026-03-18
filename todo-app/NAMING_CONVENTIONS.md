# Naming Conventions Guide

This document provides comprehensive guidelines for naming variables, functions, classes, files, and other elements in the codebase. Consistent naming improves code readability and maintainability.

## Table of Contents

1. [General Principles](#general-principles)
2. [Variable Naming](#variable-naming)
3. [Function Naming](#function-naming)
4. [Class and Object Naming](#class-and-object-naming)
5. [File and Directory Naming](#file-and-directory-naming)
6. [CSS Naming](#css-naming)
7. [HTML Naming](#html-naming)
8. [Constant Naming](#constant-naming)
9. [Event Handler Naming](#event-handler-naming)
10. [Examples by Category](#examples-by-category)

## General Principles

### 1. Be Descriptive and Clear
Names should clearly communicate their purpose and content.

✅ **Good:**
```javascript
const userAccountBalance = 1500;
const isUserLoggedIn = true;
const fetchUserProfile = () => {};
```

❌ **Bad:**
```javascript
const bal = 1500;
const flag = true;
const getData = () => {};
```

### 2. Use Intention-Revealing Names
The name should tell you why it exists, what it does, and how it's used.

✅ **Good:**
```javascript
const daysUntilExpiration = 30;
const canUserDeletePost = user.id === post.authorId;
const generateRandomId = () => Math.random().toString(36);
```

❌ **Bad:**
```javascript
const d = 30;
const check = user.id === post.authorId;
const genId = () => Math.random().toString(36);
```

### 3. Avoid Mental Mapping
Readers shouldn't have to mentally translate your names.

✅ **Good:**
```javascript
for (const todoItem of todoList) {
    if (todoItem.isCompleted) {
        completedTodos.push(todoItem);
    }
}
```

❌ **Bad:**
```javascript
for (const t of tl) {
    if (t.c) {
        ct.push(t);
    }
}
```

## Variable Naming

### Naming Patterns by Type

| Type | Pattern | Example |
|------|---------|---------|
| Primitive values | camelCase | `userName`, `totalCount` |
| Objects | camelCase | `userProfile`, `todoItem` |
| Arrays | Plural nouns | `todoItems`, `users`, `errorMessages` |
| Booleans | is/has/can/should + adjective | `isVisible`, `hasPermission`, `canEdit` |
| DOM elements | element + type | `todoInput`, `addButton`, `todoList` |
| Configuration | ALL_CAPS | `MAX_RETRY_ATTEMPTS`, `API_BASE_URL` |

### Boolean Variable Naming

Use question-like names that can be answered with yes/no:

✅ **Good:**
```javascript
const isUserActive = user.status === 'active';
const hasUnsavedChanges = form.isDirty;
const canDeleteItem = user.permissions.includes('delete');
const shouldShowModal = !user.hasSeenWelcome;
const wasRequestSuccessful = response.status === 200;
```

❌ **Bad:**
```javascript
const active = user.status === 'active';
const changes = form.isDirty;
const delete = user.permissions.includes('delete');
const modal = !user.hasSeenWelcome;
const request = response.status === 200;
```

### Array and Collection Naming

Use plural nouns that describe the contents:

✅ **Good:**
```javascript
const todoItems = [];
const activeUsers = [];
const errorMessages = [];
const selectedElements = [];
const completedTasks = [];
```

❌ **Bad:**
```javascript
const todo = [];
const user = [];
const error = [];
const selected = [];
const completed = [];
```

### DOM Element Naming

Combine the element's purpose with its type:

✅ **Good:**
```javascript
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const completionCheckbox = document.getElementById('completion-checkbox');
```

❌ **Bad:**
```javascript
const input = document.getElementById('todo-input');
const btn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const buttons = document.querySelectorAll('.filter-btn');
const checkbox = document.getElementById('completion-checkbox');
```

## Function Naming

### Use Verb + Noun Pattern

Functions should start with a verb that describes the action:

✅ **Good:**
```javascript
function addTodo(text) { }
function deleteTodoById(id) { }
function validateUserInput(input) { }
function formatDateForDisplay(date) { }
function calculateTotalPrice(items) { }
function renderTodoList(todos) { }
function saveUserPreferences(prefs) { }
```

❌ **Bad:**
```javascript
function todo(text) { }
function remove(id) { }
function check(input) { }
function date(date) { }
function total(items) { }
function list(todos) { }
function save(prefs) { }
```

### Function Categories and Naming

| Category | Pattern | Examples |
|----------|---------|----------|
| CRUD Operations | verb + noun | `createUser`, `updateProfile`, `deletePost` |
| Validation | validate + noun | `validateEmail`, `validatePassword` |
| Formatting | format + noun + ForPurpose | `formatDateForDisplay`, `formatCurrencyForInput` |
| Calculation | calculate + what | `calculateTotal`, `calculateDiscount` |
| Rendering | render + what | `renderUserList`, `renderErrorMessage` |
| Event Handlers | handle + event + target | `handleButtonClick`, `handleInputChange` |
| Utilities | descriptive verb | `sanitizeInput`, `debounceFunction` |

### Event Handler Naming

Event handlers should describe what event they handle:

✅ **Good:**
```javascript
function handleAddButtonClick(event) { }
function handleTodoInputKeyPress(event) { }
function handleFilterButtonClick(event) { }
function handleWindowResize(event) { }
function handleFormSubmit(event) { }
```

❌ **Bad:**
```javascript
function click(event) { }
function keypress(event) { }
function filter(event) { }
function resize(event) { }
function submit(event) { }
```

## Class and Object Naming

### Class Names

Use PascalCase and nouns that describe what the class represents:

✅ **Good:**
```javascript
class TodoManager { }
class UserValidator { }
class DatabaseConnection { }
class PaymentProcessor { }
class EmailService { }
```

❌ **Bad:**
```javascript
class todo { }
class validate { }
class db { }
class payment { }
class email { }
```

### Object and Instance Names

Use camelCase and descriptive nouns:

✅ **Good:**
```javascript
const todoManager = new TodoManager();
const userValidator = new UserValidator();
const databaseConnection = new DatabaseConnection();
const paymentProcessor = new PaymentProcessor();
```

❌ **Bad:**
```javascript
const tm = new TodoManager();
const validator = new UserValidator();
const db = new DatabaseConnection();
const processor = new PaymentProcessor();
```

## File and Directory Naming

### JavaScript Files

Use kebab-case for multi-word files:

✅ **Good:**
```
todo-manager.js
user-validator.js
payment-processor.js
database-connection.js
email-service.js
```

❌ **Bad:**
```
todoManager.js
uservalidator.js
paymentProcessor.js
dbconnection.js
emailsvc.js
```

### Directory Structure

Use kebab-case and descriptive names:

✅ **Good:**
```
src/
├── components/
├── utils/
├── services/
├── modules/
├── config/
└── tests/
```

❌ **Bad:**
```
src/
├── comp/
├── util/
├── svc/
├── mod/
├── cfg/
└── test/
```

## CSS Naming

### Class Names

Use kebab-case and descriptive names:

✅ **Good:**
```css
.todo-item { }
.add-button { }
.filter-controls { }
.user-profile { }
.error-message { }
.loading-spinner { }
```

❌ **Bad:**
```css
.item { }
.btn { }
.controls { }
.profile { }
.error { }
.spinner { }
```

### BEM Methodology (Optional)

For complex components, consider BEM (Block Element Modifier):

```css
/* Block */
.todo-item { }

/* Element */
.todo-item__checkbox { }
.todo-item__text { }
.todo-item__delete-button { }

/* Modifier */
.todo-item--completed { }
.todo-item--high-priority { }
```

## HTML Naming

### ID Names

Use kebab-case and be specific:

✅ **Good:**
```html
<input id="todo-input">
<button id="add-todo-button">
<ul id="todo-list">
<div id="filter-controls">
```

❌ **Bad:**
```html
<input id="input">
<button id="btn">
<ul id="list">
<div id="controls">
```

### Data Attributes

Use kebab-case with descriptive names:

✅ **Good:**
```html
<div data-todo-id="123">
<button data-filter-type="completed">
<span data-todo-count="5">
```

❌ **Bad:**
```html
<div data-id="123">
<button data-type="completed">
<span data-count="5">
```

## Constant Naming

### Configuration Constants

Use SCREAMING_SNAKE_CASE:

✅ **Good:**
```javascript
const MAX_TODO_LENGTH = 200;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PAGE_SIZE = 20;
const CACHE_EXPIRATION_TIME = 3600000;
const SUPPORTED_FILE_TYPES = ['jpg', 'png', 'gif'];
```

❌ **Bad:**
```javascript
const maxLength = 200;
const apiUrl = 'https://api.example.com';
const pageSize = 20;
const cacheTime = 3600000;
const fileTypes = ['jpg', 'png', 'gif'];
```

### Enum-like Objects

Use descriptive names with consistent patterns:

✅ **Good:**
```javascript
const TODO_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    ARCHIVED: 'archived'
};

const USER_ROLES = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user',
    GUEST: 'guest'
};
```

❌ **Bad:**
```javascript
const STATUS = {
    P: 'pending',
    IP: 'in_progress',
    C: 'completed',
    A: 'archived'
};

const ROLES = {
    A: 'admin',
    M: 'moderator',
    U: 'user',
    G: 'guest'
};
```

## Examples by Category

### Complete Todo Item Example

```javascript
// Constants
const TODO_PRIORITY_LEVELS = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent'
};

const MAX_TODO_TEXT_LENGTH = 200;

// Variables
let allTodoItems = [];
let activeTodoItems = [];
let completedTodoItems = [];
let currentFilterType = 'all';
let isApplicationLoading = false;

// DOM Elements
const todoTextInput = document.getElementById('todo-text-input');
const addTodoButton = document.getElementById('add-todo-button');
const todoItemsList = document.getElementById('todo-items-list');
const activeTodoCounter = document.getElementById('active-todo-counter');
const filterButtonsContainer = document.getElementById('filter-buttons-container');

// Functions
function createNewTodoItem(todoText, priorityLevel = TODO_PRIORITY_LEVELS.NORMAL) {
    return {
        id: generateUniqueIdentifier(),
        text: todoText.trim(),
        priority: priorityLevel,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

function addTodoItemToList(todoText) {
    const newTodoItem = createNewTodoItem(todoText);
    allTodoItems.push(newTodoItem);
    saveAllTodosToStorage();
    renderTodoItemsList();
    updateActiveTodoCounter();
}

function toggleTodoItemCompletion(todoItemId) {
    const todoItemToToggle = findTodoItemById(todoItemId);
    if (todoItemToToggle) {
        todoItemToToggle.isCompleted = !todoItemToToggle.isCompleted;
        todoItemToToggle.updatedAt = new Date().toISOString();
        saveAllTodosToStorage();
        renderTodoItemsList();
        updateActiveTodoCounter();
    }
}

function deleteTodoItemById(todoItemId) {
    allTodoItems = allTodoItems.filter(todoItem => todoItem.id !== todoItemId);
    saveAllTodosToStorage();
    renderTodoItemsList();
    updateActiveTodoCounter();
}

function validateTodoTextInput(todoText) {
    if (!todoText || typeof todoText !== 'string') {
        throw new Error('Todo text must be a non-empty string');
    }
    
    if (todoText.trim().length === 0) {
        throw new Error('Todo text cannot be empty');
    }
    
    if (todoText.length > MAX_TODO_TEXT_LENGTH) {
        throw new Error(`Todo text cannot exceed ${MAX_TODO_TEXT_LENGTH} characters`);
    }
    
    return true;
}

// Event Handlers
function handleAddTodoButtonClick(clickEvent) {
    clickEvent.preventDefault();
    
    const todoText = todoTextInput.value;
    
    try {
        validateTodoTextInput(todoText);
        addTodoItemToList(todoText);
        clearTodoTextInput();
        focusOnTodoTextInput();
    } catch (validationError) {
        displayErrorMessageToUser(validationError.message);
    }
}

function handleTodoTextInputKeyPress(keyPressEvent) {
    if (keyPressEvent.key === 'Enter') {
        handleAddTodoButtonClick(keyPressEvent);
    } else if (keyPressEvent.key === 'Escape') {
        clearTodoTextInput();
    }
}

function handleFilterButtonClick(clickEvent) {
    const selectedFilterType = clickEvent.target.dataset.filterType;
    updateCurrentFilterType(selectedFilterType);
    renderTodoItemsList();
    updateActiveFilterButtonVisualState();
}
```

This comprehensive naming guide ensures consistency and clarity throughout the codebase, making it easier for developers (both human and AI) to understand and maintain the code.