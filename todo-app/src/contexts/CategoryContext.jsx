/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { generateId } from '../utils/taskHelpers';

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within CategoryProvider');
  }
  return context;
};

const DEFAULT_CATEGORIES = [
  { id: 'work', name: 'Work', color: '#3b82f6', createdAt: new Date().toISOString() },
  { id: 'personal', name: 'Personal', color: '#8b5cf6', createdAt: new Date().toISOString() },
  { id: 'shopping', name: 'Shopping', color: '#ec4899', createdAt: new Date().toISOString() },
];

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(() => {
    const savedCategories = storage.get(STORAGE_KEYS.CATEGORIES);
    return savedCategories || DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    storage.set(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);

  const addCategory = (name, color) => {
    const newCategory = {
      id: generateId(),
      name,
      color,
      createdAt: new Date().toISOString(),
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id, updates) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id);
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
