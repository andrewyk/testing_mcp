/**
 * Utility functions for task operations
 */

/**
 * Generate a unique ID
 * @returns {string} A unique identifier
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sort tasks by various criteria
 * @param {Array} tasks - Array of tasks
 * @param {string} sortBy - Sort criteria: 'createdAt', 'dueDate', 'priority'
 * @returns {Array} Sorted tasks
 */
export const sortTasks = (tasks, sortBy = 'createdAt') => {
  const tasksCopy = [...tasks];

  switch (sortBy) {
    case 'dueDate': {
      return tasksCopy.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    case 'priority': {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return tasksCopy.sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    }

    case 'createdAt':
    default:
      return tasksCopy.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }
};

/**
 * Filter tasks by various criteria
 * @param {Array} tasks - Array of tasks
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered tasks
 */
export const filterTasks = (tasks, filters) => {
  let filtered = [...tasks];

  // Filter by status
  if (filters.status === 'active') {
    filtered = filtered.filter(task => !task.completed);
  } else if (filters.status === 'completed') {
    filtered = filtered.filter(task => task.completed);
  }

  // Filter by priority
  if (filters.priority && filters.priority !== 'all') {
    filtered = filtered.filter(task => task.priority === filters.priority);
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(task => task.category === filters.category);
  }

  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query))
    );
  }

  return filtered;
};

/**
 * Get priority color classes for styling
 * @param {string} priority - Priority level
 * @returns {Object} Tailwind color classes
 */
export const getPriorityColors = (priority) => {
  const colors = {
    high: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-300 dark:border-red-700',
      text: 'text-red-700 dark:text-red-300',
      badge: 'bg-red-500',
    },
    medium: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      border: 'border-yellow-300 dark:border-yellow-700',
      text: 'text-yellow-700 dark:text-yellow-300',
      badge: 'bg-yellow-500',
    },
    low: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-300 dark:border-green-700',
      text: 'text-green-700 dark:text-green-300',
      badge: 'bg-green-500',
    },
  };

  return colors[priority] || colors.low;
};

/**
 * Check if a task is overdue
 * @param {string} dueDate - Due date string
 * @param {boolean} completed - Task completion status
 * @returns {boolean} Whether the task is overdue
 */
export const isOverdue = (dueDate, completed) => {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date();
};
