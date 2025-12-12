import { useState, useEffect } from 'react';
import { useTodoStore } from '../store/todoStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TodoItem } from '../components/TodoItem';
import { TodoForm } from '../components/TodoForm';
import { Sidebar } from '../components/Sidebar';
import { StatsBar } from '../components/StatsBar';
import { FaPlus, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';

export const Dashboard = () => {
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const { 
    todos, 
    fetchTodos, 
    fetchProjects, 
    fetchTags, 
    fetchStats, 
    loading 
  } = useTodoStore();
  const { logout, user } = useAuthStore();

  useEffect(() => {
    fetchTodos();
    fetchProjects();
    fetchTags();
    fetchStats();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  My Tasks
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {user?.name}!
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDarkMode}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  aria-label="Logout"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Stats Bar */}
          <StatsBar />

          {/* Content */}
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  All Tasks
                </h2>
                <Button
                  onClick={() => setShowTodoForm(true)}
                  className="flex items-center gap-2"
                >
                  <FaPlus /> Add Task
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                  Loading...
                </div>
              ) : todos.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No tasks yet. Create your first task to get started!
                  </p>
                  <Button onClick={() => setShowTodoForm(true)}>
                    <FaPlus className="inline mr-2" /> Create Task
                  </Button>
                </Card>
              ) : (
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Todo Form Modal */}
      {showTodoForm && (
        <TodoForm
          onClose={() => setShowTodoForm(false)}
        />
      )}
    </div>
  );
};
