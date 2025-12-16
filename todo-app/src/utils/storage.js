/**
 * Utility functions for localStorage operations with error handling
 */

export const storage = {
  /**
   * Get an item from localStorage and parse it as JSON
   * @param {string} key - The key to retrieve
   * @param {*} defaultValue - Default value if key doesn't exist or parsing fails
   * @returns {*} The parsed value or default value
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Set an item in localStorage by stringifying it as JSON
   * @param {string} key - The key to set
   * @param {*} value - The value to store
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  /**
   * Remove an item from localStorage
   * @param {string} key - The key to remove
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

export const STORAGE_KEYS = {
  TASKS: 'todo-app-tasks',
  CATEGORIES: 'todo-app-categories',
  THEME: 'todo-app-theme',
};
