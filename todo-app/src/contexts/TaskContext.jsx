/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { generateId, sortTasks, filterTasks } from '../utils/taskHelpers';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = storage.get(STORAGE_KEYS.TASKS, []);
    return savedTasks;
  });

  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'active', 'completed'
    priority: 'all',
    category: 'all',
    searchQuery: '',
  });

  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    storage.set(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  // Create a new task
  const addTask = (taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description || '',
      completed: false,
      priority: taskData.priority || 'medium',
      category: taskData.category || '',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  // Update an existing task
  const updateTask = (id, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Toggle task completion
  const toggleTaskComplete = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  // Reorder tasks (for drag and drop)
  const reorderTasks = (newTasks) => {
    setTasks(newTasks);
  };

  // Get filtered and sorted tasks
  const getFilteredTasks = () => {
    let filtered = filterTasks(tasks, filters);
    return sortTasks(filtered, sortBy);
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear completed tasks
  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  // Export tasks as JSON
  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todo-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import tasks from JSON
  const importTasks = (importedTasks) => {
    try {
      setTasks(importedTasks);
      return true;
    } catch (error) {
      console.error('Error importing tasks:', error);
      return false;
    }
  };

  const getTaskById = (id) => {
    return tasks.find(task => task.id === id);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filters,
        sortBy,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        reorderTasks,
        getFilteredTasks,
        updateFilters,
        setSortBy,
        clearCompleted,
        exportTasks,
        importTasks,
        getTaskById,
        getTaskStats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
