// Application Configuration
// This file contains all configuration constants and settings
// Demonstrates proper constant organization and naming conventions

/**
 * Main application configuration object
 * Contains all constants used throughout the application
 */
export const APP_CONFIG = {
    // Storage Configuration
    STORAGE_KEY: 'todoApp_todos_v1',
    STORAGE_VERSION: '1.0',
    BACKUP_STORAGE_KEY: 'todoApp_backup',
    
    // Validation Limits
    MAX_TODO_LENGTH: 200,
    MIN_TODO_LENGTH: 1,
    MAX_TODOS_COUNT: 1000,
    
    // UI Configuration
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 250,
    AUTO_SAVE_DELAY: 2000,
    NOTIFICATION_DURATION: 3000,
    
    // Feature Flags
    ENABLE_AUTO_SAVE: true,
    ENABLE_KEYBOARD_SHORTCUTS: true,
    ENABLE_LOCAL_STORAGE: true,
    ENABLE_ANALYTICS: false,
    
    // API Configuration (for future use)
    API_BASE_URL: 'https://api.todoapp.com/v1',
    API_TIMEOUT: 5000,
    MAX_RETRY_ATTEMPTS: 3,
    
    // Performance Settings
    VIRTUAL_SCROLL_THRESHOLD: 100,
    BATCH_SIZE: 50,
    MAX_UNDO_HISTORY: 20
};

/**
 * Todo filter types enumeration
 * Provides type safety and prevents magic strings
 */
export const TODO_FILTERS = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    RECENT: 'recent',
    OVERDUE: 'overdue'
};

/**
 * Todo priority levels enumeration
 */
export const TODO_PRIORITIES = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent'
};

/**
 * Event names used throughout the application
 * Centralizes event naming to prevent typos
 */
export const APP_EVENTS = {
    TODO_ADDED: 'todo:added',
    TODO_UPDATED: 'todo:updated',
    TODO_DELETED: 'todo:deleted',
    TODO_COMPLETED: 'todo:completed',
    FILTER_CHANGED: 'filter:changed',
    STORAGE_ERROR: 'storage:error',
    VALIDATION_ERROR: 'validation:error'
};

/**
 * CSS class names for consistent styling
 */
export const CSS_CLASSES = {
    // Component classes
    TODO_ITEM: 'todo-item',
    TODO_ITEM_COMPLETED: 'todo-item--completed',
    TODO_ITEM_HIGH_PRIORITY: 'todo-item--high-priority',
    
    // State classes
    LOADING: 'loading',
    ERROR: 'error',
    SUCCESS: 'success',
    HIDDEN: 'hidden',
    ACTIVE: 'active',
    
    // Utility classes
    VISUALLY_HIDDEN: 'visually-hidden',
    NO_SCROLL: 'no-scroll',
    FADE_IN: 'fade-in',
    FADE_OUT: 'fade-out'
};

/**
 * DOM element selectors
 * Centralizes element selection for easier maintenance
 */
export const DOM_SELECTORS = {
    // Main containers
    TODO_APP: '#todo-app',
    TODO_LIST: '#todo-list',
    TODO_INPUT: '#todo-input',
    
    // Buttons
    ADD_BUTTON: '#add-btn',
    CLEAR_COMPLETED: '#clear-completed',
    FILTER_BUTTONS: '.filter-btn',
    
    // Display elements
    TODO_COUNTER: '#todo-count',
    FILTER_CONTAINER: '.filters',
    NOTIFICATION_AREA: '#notifications'
};

/**
 * Keyboard shortcuts configuration
 */
export const KEYBOARD_SHORTCUTS = {
    ADD_TODO: 'Enter',
    ESCAPE_INPUT: 'Escape',
    TOGGLE_ALL: 'Ctrl+A',
    DELETE_TODO: 'Delete',
    EDIT_TODO: 'F2',
    FILTER_ALL: '1',
    FILTER_ACTIVE: '2',
    FILTER_COMPLETED: '3'
};

/**
 * Error messages for consistent user communication
 */
export const ERROR_MESSAGES = {
    EMPTY_TODO: 'Todo text cannot be empty',
    TODO_TOO_LONG: `Todo text cannot exceed ${APP_CONFIG.MAX_TODO_LENGTH} characters`,
    STORAGE_FAILED: 'Unable to save your changes. Please try again.',
    LOAD_FAILED: 'Could not load your saved todos. Starting with empty list.',
    NETWORK_ERROR: 'Network error occurred. Please check your connection.',
    INVALID_INPUT: 'Please enter valid text for your todo',
    MAX_TODOS_REACHED: `You cannot have more than ${APP_CONFIG.MAX_TODOS_COUNT} todos`,
    DUPLICATE_TODO: 'This todo already exists in your list'
};

/**
 * Success messages for user feedback
 */
export const SUCCESS_MESSAGES = {
    TODO_ADDED: 'Todo added successfully!',
    TODO_UPDATED: 'Todo updated successfully!',
    TODO_DELETED: 'Todo deleted successfully!',
    TODO_COMPLETED: 'Todo marked as completed!',
    ALL_COMPLETED: 'All todos completed! Great job!',
    DATA_SAVED: 'Your changes have been saved',
    DATA_EXPORTED: 'Todos exported successfully'
};

/**
 * Analytics event names (if analytics is enabled)
 */
export const ANALYTICS_EVENTS = {
    TODO_CREATED: 'todo_created',
    TODO_COMPLETED: 'todo_completed',
    TODO_DELETED: 'todo_deleted',
    FILTER_USED: 'filter_used',
    BULK_ACTION: 'bulk_action',
    KEYBOARD_SHORTCUT_USED: 'keyboard_shortcut_used'
};

/**
 * Local storage keys for different data types
 */
export const STORAGE_KEYS = {
    TODOS: 'todoApp_todos',
    USER_PREFERENCES: 'todoApp_preferences',
    ANALYTICS_DATA: 'todoApp_analytics',
    UNDO_HISTORY: 'todoApp_undo_history',
    LAST_BACKUP: 'todoApp_last_backup'
};

/**
 * Development and debugging configuration
 */
export const DEBUG_CONFIG = {
    ENABLE_CONSOLE_LOGS: process.env.NODE_ENV === 'development',
    ENABLE_PERFORMANCE_MONITORING: false,
    MOCK_API_CALLS: process.env.NODE_ENV === 'development',
    SHOW_DEBUG_INFO: false
};

/**
 * Validation patterns and rules
 */
export const VALIDATION_RULES = {
    TODO_TEXT_PATTERN: /^[a-zA-Z0-9\s\.\,\!\?\-\_\(\)]+$/,
    MIN_TODO_WORDS: 1,
    MAX_TODO_WORDS: 50,
    FORBIDDEN_WORDS: ['spam', 'test123'], // Example forbidden words
    
    // Character restrictions
    ALLOWED_CHARACTERS: /^[^<>\"'&]+$/, // No HTML/XSS characters
    MAX_LINE_BREAKS: 3
};

/**
 * UI responsiveness breakpoints
 */
export const BREAKPOINTS = {
    MOBILE: '(max-width: 767px)',
    TABLET: '(min-width: 768px) and (max-width: 1023px)',
    DESKTOP: '(min-width: 1024px)',
    LARGE_DESKTOP: '(min-width: 1440px)'
};

/**
 * Color theme configuration
 */
export const THEME_COLORS = {
    PRIMARY: '#667eea',
    PRIMARY_DARK: '#5568d3',
    SECONDARY: '#764ba2',
    SUCCESS: '#4ade80',
    ERROR: '#f87171',
    WARNING: '#fbbf24',
    INFO: '#3b82f6'
};

// Freeze objects to prevent accidental modifications
Object.freeze(APP_CONFIG);
Object.freeze(TODO_FILTERS);
Object.freeze(TODO_PRIORITIES);
Object.freeze(APP_EVENTS);
Object.freeze(CSS_CLASSES);
Object.freeze(DOM_SELECTORS);
Object.freeze(KEYBOARD_SHORTCUTS);
Object.freeze(ERROR_MESSAGES);
Object.freeze(SUCCESS_MESSAGES);
Object.freeze(ANALYTICS_EVENTS);
Object.freeze(STORAGE_KEYS);
Object.freeze(DEBUG_CONFIG);
Object.freeze(VALIDATION_RULES);
Object.freeze(BREAKPOINTS);
Object.freeze(THEME_COLORS);

export default {
    APP_CONFIG,
    TODO_FILTERS,
    TODO_PRIORITIES,
    APP_EVENTS,
    CSS_CLASSES,
    DOM_SELECTORS,
    KEYBOARD_SHORTCUTS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ANALYTICS_EVENTS,
    STORAGE_KEYS,
    DEBUG_CONFIG,
    VALIDATION_RULES,
    BREAKPOINTS,
    THEME_COLORS
};