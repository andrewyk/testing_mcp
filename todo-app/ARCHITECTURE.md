# Architecture Guide

This document describes the architectural principles and patterns used in the Todo App. Understanding this architecture will help maintain consistency and make informed decisions when extending the application.

## Table of Contents

1. [Overall Architecture](#overall-architecture)
2. [File Structure](#file-structure)
3. [Data Flow](#data-flow)
4. [State Management](#state-management)
5. [Module Patterns](#module-patterns)
6. [Separation of Concerns](#separation-of-concerns)
7. [Design Patterns Used](#design-patterns-used)

## Overall Architecture

This Todo App follows a **modular, component-based architecture** with clear separation of concerns. It uses vanilla JavaScript with modern ES6+ features and follows functional programming principles where appropriate.

### Key Architectural Principles

1. **Single Responsibility Principle**: Each module/function has one clear purpose
2. **Separation of Concerns**: Business logic, UI rendering, and data persistence are separated
3. **Modularity**: Code is organized into reusable modules
4. **Immutability**: State changes are handled through pure functions when possible
5. **Event-Driven**: Uses event listeners and custom events for communication

## File Structure

```
todo-app/
├── index.html                  # Entry point and HTML structure
├── styles/
│   ├── main.css               # Global styles and layout
│   ├── components.css         # Component-specific styles
│   └── utilities.css          # Utility classes
├── scripts/
│   ├── app.js                 # Main application controller
│   ├── modules/
│   │   ├── todo-manager.js    # Business logic for todo operations
│   │   ├── storage-manager.js # Data persistence layer
│   │   ├── ui-manager.js      # UI rendering and DOM manipulation
│   │   └── event-manager.js   # Event handling coordination
│   ├── utils/
│   │   ├── validators.js      # Input validation utilities
│   │   ├── dom-helpers.js     # DOM manipulation helpers
│   │   └── formatters.js      # Data formatting utilities
│   └── config/
│       └── constants.js       # Application constants
├── docs/                      # Documentation files
└── tests/                     # Test files
```

## Data Flow

The application follows a unidirectional data flow pattern:

```
User Action → Event Handler → Business Logic → State Update → UI Re-render
     ↑                                                             ↓
     └─────────────────── UI Feedback ←──────────────────────────┘
```

### Example Data Flow for Adding a Todo

1. **User Action**: User types in input field and clicks "Add" button
2. **Event Handling**: `handleAddTodoButtonClick` captures the event
3. **Validation**: Input is validated using `validateTodoText`
4. **Business Logic**: `TodoManager.addTodo()` creates a new todo object
5. **State Update**: Todo is added to the application state
6. **Persistence**: `StorageManager.saveTodos()` persists to localStorage
7. **UI Update**: `UIManager.renderTodoList()` re-renders the todo list
8. **User Feedback**: Updated list is displayed to the user

## State Management

### Centralized State Object

```javascript
const applicationState = {
    // Core data
    todos: [],
    currentFilter: 'all',
    
    // UI state
    isLoading: false,
    hasUnsavedChanges: false,
    selectedTodos: [],
    
    // User preferences
    settings: {
        theme: 'light',
        sortOrder: 'created_desc',
        showCompleted: true
    },
    
    // Metadata
    lastModified: null,
    version: '1.0.0'
};
```

### State Update Pattern

Always use pure functions for state updates:

```javascript
/**
 * Updates application state immutably
 * @param {Object} currentState - Current application state
 * @param {Object} updates - Partial state updates
 * @returns {Object} New state object
 */
function updateApplicationState(currentState, updates) {
    return {
        ...currentState,
        ...updates,
        lastModified: new Date().toISOString()
    };
}

/**
 * Adds a todo to state immutably
 * @param {Object} currentState - Current state
 * @param {Object} newTodo - Todo to add
 * @returns {Object} Updated state
 */
function addTodoToState(currentState, newTodo) {
    return updateApplicationState(currentState, {
        todos: [...currentState.todos, newTodo],
        hasUnsavedChanges: true
    });
}
```

## Module Patterns

### Module Structure Template

Each module follows a consistent structure:

```javascript
// modules/example-module.js

/**
 * Example Module
 * Handles [specific responsibility]
 */

// Module dependencies
import { validateInput } from '../utils/validators.js';
import { APP_CONFIG } from '../config/constants.js';

// Private variables (module scope)
let privateVariable = null;

// Private functions
function privateHelperFunction(data) {
    // Implementation
}

// Public API
const ExampleModule = {
    /**
     * Initializes the module
     * @param {Object} config - Module configuration
     */
    initialize(config = {}) {
        // Initialization logic
    },
    
    /**
     * Main public method
     * @param {*} param - Method parameter
     * @returns {*} Method result
     */
    publicMethod(param) {
        // Implementation using private functions
        return privateHelperFunction(param);
    },
    
    // Other public methods...
};

// Export module
export default ExampleModule;
```

### Module Examples

#### TodoManager Module

```javascript
// modules/todo-manager.js

const TodoManager = {
    /**
     * Creates a new todo object
     * @param {string} text - Todo text
     * @param {string} priority - Todo priority
     * @returns {Object} Todo object
     */
    createTodo(text, priority = 'normal') {
        return {
            id: generateUniqueId(),
            text: text.trim(),
            priority,
            completed: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            tags: []
        };
    },
    
    /**
     * Toggles todo completion status
     * @param {Array} todos - Current todos array
     * @param {string} todoId - ID of todo to toggle
     * @returns {Array} Updated todos array
     */
    toggleTodoCompletion(todos, todoId) {
        return todos.map(todo => 
            todo.id === todoId 
                ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
                : todo
        );
    },
    
    /**
     * Filters todos by status
     * @param {Array} todos - All todos
     * @param {string} filter - Filter type
     * @returns {Array} Filtered todos
     */
    filterTodos(todos, filter) {
        switch (filter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    }
};
```

#### StorageManager Module

```javascript
// modules/storage-manager.js

const StorageManager = {
    /**
     * Saves todos to localStorage
     * @param {Array} todos - Todos to save
     * @throws {Error} If storage operation fails
     */
    async saveTodos(todos) {
        try {
            const dataToStore = {
                todos,
                version: APP_CONFIG.STORAGE_VERSION,
                timestamp: Date.now()
            };
            
            localStorage.setItem(
                APP_CONFIG.STORAGE_KEY, 
                JSON.stringify(dataToStore)
            );
        } catch (error) {
            throw new Error(`Failed to save todos: ${error.message}`);
        }
    },
    
    /**
     * Loads todos from localStorage
     * @returns {Array} Loaded todos or empty array
     */
    async loadTodos() {
        try {
            const storedData = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
            
            if (!storedData) {
                return [];
            }
            
            const parsedData = JSON.parse(storedData);
            
            // Handle version compatibility
            if (parsedData.version !== APP_CONFIG.STORAGE_VERSION) {
                return this.migrateTodos(parsedData);
            }
            
            return parsedData.todos || [];
        } catch (error) {
            console.error('Error loading todos:', error);
            return [];
        }
    }
};
```

## Separation of Concerns

### Layer Responsibilities

1. **Presentation Layer** (`ui-manager.js`)
   - DOM manipulation
   - Event binding
   - Visual updates
   - User feedback

2. **Business Logic Layer** (`todo-manager.js`)
   - Todo operations
   - Data validation
   - Business rules
   - State transformations

3. **Data Layer** (`storage-manager.js`)
   - Data persistence
   - Data retrieval
   - Data migration
   - Storage abstraction

4. **Application Layer** (`app.js`)
   - Coordination between layers
   - Application initialization
   - High-level event handling
   - Error boundary

### Communication Between Layers

```javascript
// app.js - Application coordinator

class TodoApp {
    constructor() {
        this.todoManager = new TodoManager();
        this.storageManager = new StorageManager();
        this.uiManager = new UIManager();
        this.eventManager = new EventManager();
    }
    
    async initialize() {
        // Initialize all modules
        await this.loadInitialData();
        this.setupEventHandlers();
        this.renderInitialUI();
    }
    
    async addTodo(todoText) {
        try {
            // Business logic
            const newTodo = this.todoManager.createTodo(todoText);
            const updatedTodos = [...this.state.todos, newTodo];
            
            // Update state
            this.state = updateApplicationState(this.state, {
                todos: updatedTodos
            });
            
            // Persist data
            await this.storageManager.saveTodos(this.state.todos);
            
            // Update UI
            this.uiManager.renderTodoList(this.state.todos);
            this.uiManager.updateTodoCount(this.getActiveTodoCount());
            
        } catch (error) {
            this.handleError(error);
        }
    }
}
```

## Design Patterns Used

### 1. Observer Pattern

Used for event handling and state changes:

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

// Usage
const appEvents = new EventEmitter();

appEvents.on('todoAdded', (todo) => {
    console.log('Todo added:', todo);
    // Update UI, analytics, etc.
});
```

### 2. Factory Pattern

Used for creating objects:

```javascript
const TodoFactory = {
    createTodo(text, options = {}) {
        return {
            id: generateUniqueId(),
            text,
            completed: false,
            priority: options.priority || 'normal',
            tags: options.tags || [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
    },
    
    createFromJSON(jsonData) {
        const todo = JSON.parse(jsonData);
        return this.createTodo(todo.text, todo);
    }
};
```

### 3. Strategy Pattern

Used for filtering and sorting:

```javascript
const FilterStrategies = {
    all: (todos) => todos,
    active: (todos) => todos.filter(t => !t.completed),
    completed: (todos) => todos.filter(t => t.completed)
};

const SortStrategies = {
    created_asc: (todos) => [...todos].sort((a, b) => a.createdAt - b.createdAt),
    created_desc: (todos) => [...todos].sort((a, b) => b.createdAt - a.createdAt),
    alphabetical: (todos) => [...todos].sort((a, b) => a.text.localeCompare(b.text))
};

// Usage
function getFilteredAndSortedTodos(todos, filter, sort) {
    const filtered = FilterStrategies[filter](todos);
    return SortStrategies[sort](filtered);
}
```

## Best Practices for Extension

When extending this architecture:

1. **Follow the Module Pattern**: Create new modules following the established pattern
2. **Maintain Layer Separation**: Don't mix concerns between layers
3. **Use Immutable Updates**: Always create new state objects instead of mutating existing ones
4. **Add Tests**: Create tests for new functionality
5. **Document Changes**: Update documentation when adding new features
6. **Follow Naming Conventions**: Use established naming patterns
7. **Handle Errors Gracefully**: Implement proper error handling for new features

This architecture provides a solid foundation that can scale and be easily maintained as the application grows.