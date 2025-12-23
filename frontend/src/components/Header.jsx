import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onNewTask }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onNewTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + New Task
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
