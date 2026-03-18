// Todo App - Vanilla JavaScript
// A comprehensive example of clean code practices and conventions

// Application Configuration Constants
const APP_CONFIG = {
    STORAGE_KEY: 'todoApp_todos',
    MAX_TODO_LENGTH: 200,
    DEBOUNCE_DELAY: 300,
    AUTO_SAVE_ENABLED: true
};

const TODO_FILTERS = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed'
};

// Application State Management
let applicationState = {
    todoItems: [],
    currentFilterType: TODO_FILTERS.ALL,
    isLoading: false,
    hasUnsavedChanges: false
};

// DOM Element Cache - Improves performance by avoiding repeated queries
const domElementCache = {
    todoTextInput: document.getElementById('todo-input'),
    addTodoButton: document.getElementById('add-btn'),
    todoItemsList: document.getElementById('todo-list'),
    activeTodoCounter: document.getElementById('todo-count'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    clearCompletedButton: document.getElementById('clear-completed')
};

// Application Initialization
document.addEventListener('DOMContentLoaded', initializeApplication);

/**
 * Initializes the todo application
 * Sets up event listeners, loads data, and renders initial UI
 */
function initializeApplication() {
    try {
        loadTodoItemsFromStorage();
        renderTodoItemsList();
        updateActiveTodoCounter();
        attachEventListeners();
        
        // Focus on input for better UX
        focusOnTodoInput();
    } catch (initializationError) {
        handleApplicationError('Failed to initialize application', initializationError);
    }
}

/**
 * Attaches all event listeners for the application
 * Centralizes event listener setup for better organization
 */
function attachEventListeners() {
    // Primary action listeners
    domElementCache.addTodoButton.addEventListener('click', handleAddTodoButtonClick);
    domElementCache.todoTextInput.addEventListener('keypress', handleTodoInputKeyPress);
    domElementCache.clearCompletedButton.addEventListener('click', handleClearCompletedButtonClick);
    
    // Filter button listeners
    domElementCache.filterButtons.forEach(filterButton => {
        filterButton.addEventListener('click', handleFilterButtonClick);
    });
}

// ============================================================================
// EVENT HANDLERS - Handle user interactions with descriptive names
// ============================================================================

/**
 * Handles the add todo button click event
 * Validates input, creates todo, and updates UI
 * @param {Event} clickEvent - The button click event
 */
function handleAddTodoButtonClick(clickEvent) {
    clickEvent.preventDefault();
    
    const todoText = domElementCache.todoTextInput.value.trim();
    
    try {
        validateTodoText(todoText);
        addNewTodoItem(todoText);
        clearTodoInput();
        focusOnTodoInput();
    } catch (validationError) {
        handleUserInputError(validationError.message);
    }
}

/**
 * Handles keyboard input in the todo text input field
 * @param {KeyboardEvent} keyEvent - The keyboard event
 */
function handleTodoInputKeyPress(keyEvent) {
    if (keyEvent.key === 'Enter') {
        handleAddTodoButtonClick(keyEvent);
    } else if (keyEvent.key === 'Escape') {
        clearTodoInput();
    }
}

/**
 * Handles filter button click events
 * Updates the current filter and re-renders the todo list
 * @param {Event} clickEvent - The filter button click event
 */
function handleFilterButtonClick(clickEvent) {
    const selectedFilterType = clickEvent.target.dataset.filter;
    
    if (selectedFilterType && selectedFilterType !== applicationState.currentFilterType) {
        applicationState.currentFilterType = selectedFilterType;
        updateActiveFilterButtonVisualState();
        renderTodoItemsList();
    }
}

/**
 * Handles the clear completed todos button click
 * Removes all completed todos from the list
 * @param {Event} clickEvent - The clear button click event
 */
function handleClearCompletedButtonClick(clickEvent) {
    clickEvent.preventDefault();
    removeAllCompletedTodos();
}

// ============================================================================
// CORE TODO OPERATIONS - Business logic with clear responsibilities
// ============================================================================

/**
 * Validates todo text input according to business rules
 * @param {string} todoText - Text to validate
 * @throws {Error} When validation fails
 * @returns {boolean} True if validation passes
 */
function validateTodoText(todoText) {
    if (!todoText || typeof todoText !== 'string') {
        throw new Error('Todo text must be a non-empty string');
    }
    
    if (todoText.trim().length === 0) {
        throw new Error('Todo text cannot be empty');
    }
    
    if (todoText.length > APP_CONFIG.MAX_TODO_LENGTH) {
        throw new Error(`Todo text cannot exceed ${APP_CONFIG.MAX_TODO_LENGTH} characters`);
    }
    
    return true;
}

/**
 * Creates a new todo object with proper structure
 * @param {string} todoText - The text content of the todo
 * @returns {Object} Newly created todo object
 */
function createTodoObject(todoText) {
    return {
        id: generateUniqueId(),
        text: todoText.trim(),
        isCompleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
}

/**
 * Adds a new todo item to the application state
 * @param {string} todoText - Text content for the new todo
 */
function addNewTodoItem(todoText) {
    const newTodoItem = createTodoObject(todoText);
    
    // Use immutable state update pattern
    applicationState = {
        ...applicationState,
        todoItems: [...applicationState.todoItems, newTodoItem],
        hasUnsavedChanges: true
    };
    
    persistTodoItemsToStorage();
    renderTodoItemsList();
    updateActiveTodoCounter();
}

/**
 * Toggles the completion status of a specific todo item
 * @param {string|number} todoId - Unique identifier of the todo to toggle
 */
function toggleTodoItemCompletion(todoId) {
    applicationState = {
        ...applicationState,
        todoItems: applicationState.todoItems.map(todoItem => 
            todoItem.id === todoId 
                ? { ...todoItem, isCompleted: !todoItem.isCompleted, updatedAt: Date.now() }
                : todoItem
        ),
        hasUnsavedChanges: true
    };
    
    persistTodoItemsToStorage();
    renderTodoItemsList();
    updateActiveTodoCounter();
}

/**
 * Removes a todo item by its unique identifier
 * @param {string|number} todoId - Unique identifier of the todo to delete
 */
function deleteTodoItemById(todoId) {
    applicationState = {
        ...applicationState,
        todoItems: applicationState.todoItems.filter(todoItem => todoItem.id !== todoId),
        hasUnsavedChanges: true
    };
    
    persistTodoItemsToStorage();
    renderTodoItemsList();
    updateActiveTodoCounter();
}

/**
 * Removes all completed todo items from the list
 */
function removeAllCompletedTodos() {
    const completedTodosCount = applicationState.todoItems.filter(todo => todo.isCompleted).length;
    
    if (completedTodosCount === 0) {
        return; // Nothing to clear
    }
    
    applicationState = {
        ...applicationState,
        todoItems: applicationState.todoItems.filter(todoItem => !todoItem.isCompleted),
        hasUnsavedChanges: true
    };
    
    persistTodoItemsToStorage();
    renderTodoItemsList();
    updateActiveTodoCounter();
}

// ============================================================================
// UI RENDERING - DOM manipulation with clear separation of concerns
// ============================================================================

/**
 * Renders the complete todo list based on current filter
 * Uses DocumentFragment for efficient DOM updates
 */
function renderTodoItemsList() {
    const todoListElement = domElementCache.todoItemsList;
    const filteredTodoItems = getFilteredTodoItems();
    
    // Clear existing content
    todoListElement.innerHTML = '';
    
    // Use DocumentFragment for batch DOM updates (better performance)
    const documentFragment = document.createDocumentFragment();
    
    filteredTodoItems.forEach(todoItem => {
        const todoItemElement = createTodoItemElement(todoItem);
        documentFragment.appendChild(todoItemElement);
    });
    
    todoListElement.appendChild(documentFragment);
}

/**
 * Creates a DOM element for a single todo item
 * @param {Object} todoItem - Todo item data object
 * @returns {HTMLElement} The created todo item DOM element
 */
function createTodoItemElement(todoItem) {
    const listItemElement = document.createElement('li');
    listItemElement.className = `todo-item ${todoItem.isCompleted ? 'completed' : ''}`;
    listItemElement.dataset.todoId = todoItem.id;
    
    // Create checkbox for completion toggle
    const completionCheckbox = document.createElement('input');
    completionCheckbox.type = 'checkbox';
    completionCheckbox.className = 'todo-checkbox';
    completionCheckbox.checked = todoItem.isCompleted;
    completionCheckbox.setAttribute('aria-label', `Mark "${todoItem.text}" as ${todoItem.isCompleted ? 'incomplete' : 'complete'}`);
    completionCheckbox.addEventListener('change', () => toggleTodoItemCompletion(todoItem.id));
    
    // Create text display element
    const todoTextElement = document.createElement('span');
    todoTextElement.className = 'todo-text';
    todoTextElement.textContent = todoItem.text; // Safe from XSS - textContent escapes HTML
    todoTextElement.title = todoItem.text; // Tooltip for long text
    
    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete todo: ${todoItem.text}`);
    deleteButton.addEventListener('click', () => deleteTodoItemById(todoItem.id));
    
    // Assemble the complete todo item
    listItemElement.appendChild(completionCheckbox);
    listItemElement.appendChild(todoTextElement);
    listItemElement.appendChild(deleteButton);
    
    return listItemElement;
}

/**
 * Gets filtered todo items based on current filter selection
 * @returns {Array} Filtered array of todo items
 */
function getFilteredTodoItems() {
    const { todoItems, currentFilterType } = applicationState;
    
    switch (currentFilterType) {
        case TODO_FILTERS.ACTIVE:
            return todoItems.filter(todoItem => !todoItem.isCompleted);
        case TODO_FILTERS.COMPLETED:
            return todoItems.filter(todoItem => todoItem.isCompleted);
        default:
            return todoItems;
    }
}

/**
 * Updates the visual state of filter buttons
 * Highlights the currently active filter
 */
function updateActiveFilterButtonVisualState() {
    domElementCache.filterButtons.forEach(filterButton => {
        const isActiveFilter = filterButton.dataset.filter === applicationState.currentFilterType;
        filterButton.classList.toggle('active', isActiveFilter);
        filterButton.setAttribute('aria-pressed', isActiveFilter.toString());
    });
}

/**
 * Updates the counter showing number of active (incomplete) todos
 */
function updateActiveTodoCounter() {
    const activeTodoCount = applicationState.todoItems.filter(todoItem => !todoItem.isCompleted).length;
    const counterText = `${activeTodoCount} ${activeTodoCount === 1 ? 'item' : 'items'} left`;
    
    domElementCache.activeTodoCounter.textContent = counterText;
    domElementCache.activeTodoCounter.setAttribute('aria-live', 'polite'); // Screen reader announcement
}

// ============================================================================
// DATA PERSISTENCE - Local storage operations with error handling
// ============================================================================

/**
 * Persists todo items to localStorage with proper error handling
 * @throws {Error} When storage operation fails
 */
function persistTodoItemsToStorage() {
    try {
        const dataToStore = {
            todoItems: applicationState.todoItems,
            version: '1.0',
            lastModified: Date.now()
        };
        
        localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(dataToStore));
        applicationState.hasUnsavedChanges = false;
        
    } catch (storageError) {
        console.error('Failed to save todos to localStorage:', storageError);
        handleStorageError('Unable to save your todos. Changes may be lost.', storageError);
    }
}

/**
 * Loads todo items from localStorage with error recovery
 * Falls back to empty array if loading fails
 */
function loadTodoItemsFromStorage() {
    try {
        const storedDataJson = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
        
        if (!storedDataJson) {
            // No stored data - initialize with empty array
            applicationState.todoItems = [];
            return;
        }
        
        const storedData = JSON.parse(storedDataJson);
        
        // Handle different data formats for backward compatibility
        if (Array.isArray(storedData)) {
            // Legacy format - just an array of todos
            applicationState.todoItems = storedData;
        } else if (storedData.todoItems && Array.isArray(storedData.todoItems)) {
            // New format - structured data with metadata
            applicationState.todoItems = storedData.todoItems;
        } else {
            throw new Error('Invalid data format in storage');
        }
        
    } catch (loadingError) {
        console.error('Error loading todos from localStorage:', loadingError);
        handleStorageError('Could not load your saved todos. Starting with empty list.', loadingError);
        applicationState.todoItems = []; // Fallback to empty array
    }
}

// ============================================================================
// UTILITY FUNCTIONS - Helper functions with single responsibilities
// ============================================================================

/**
 * Generates a unique identifier for todo items
 * Uses timestamp with random component for uniqueness
 * @returns {string} Unique identifier
 */
function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clears the todo input field and resets any validation states
 */
function clearTodoInput() {
    domElementCache.todoTextInput.value = '';
    domElementCache.todoTextInput.classList.remove('error');
}

/**
 * Focuses on the todo input field for better user experience
 */
function focusOnTodoInput() {
    domElementCache.todoTextInput.focus();
}

/**
 * Escapes HTML characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} HTML-escaped text
 */
function escapeHtml(text) {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = text;
    return tempDiv.innerHTML;
}

// ============================================================================
// ERROR HANDLING - Centralized error handling with user feedback
// ============================================================================

/**
 * Handles user input validation errors
 * @param {string} errorMessage - Error message to display to user
 */
function handleUserInputError(errorMessage) {
    console.warn('User input validation failed:', errorMessage);
    
    // Visual feedback
    domElementCache.todoTextInput.classList.add('error');
    domElementCache.todoTextInput.setAttribute('aria-describedby', 'input-error');
    
    // Show error message (in a real app, you might use a toast notification)
    showUserNotification(errorMessage, 'error');
    
    // Remove error state after delay
    setTimeout(() => {
        domElementCache.todoTextInput.classList.remove('error');
        domElementCache.todoTextInput.removeAttribute('aria-describedby');
    }, 3000);
}

/**
 * Handles storage-related errors
 * @param {string} userMessage - User-friendly error message
 * @param {Error} technicalError - Technical error details for logging
 */
function handleStorageError(userMessage, technicalError) {
    console.error('Storage operation failed:', {
        userMessage,
        error: technicalError,
        timestamp: new Date().toISOString()
    });
    
    showUserNotification(userMessage, 'warning');
}

/**
 * Handles general application errors
 * @param {string} context - Context where the error occurred
 * @param {Error} error - The error that occurred
 */
function handleApplicationError(context, error) {
    console.error(`Application error in ${context}:`, error);
    
    showUserNotification('Something went wrong. Please refresh the page and try again.', 'error');
    
    // In a production app, you might send errors to a logging service
    // sendErrorToLoggingService({ context, error, timestamp: Date.now() });
}

/**
 * Shows a notification to the user
 * In a real application, this would be replaced with a proper notification system
 * @param {string} message - Message to show
 * @param {string} type - Type of notification (success, error, warning, info)
 */
function showUserNotification(message, type = 'info') {
    // Simple console notification for this demo
    // In production, replace with toast notifications, modal, or other UI
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Could also show browser notification if permissions are granted
    // if ('Notification' in window && Notification.permission === 'granted') {
    //     new Notification('Todo App', { body: message });
    // }
}
