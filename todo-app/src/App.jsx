import { useState, useEffect } from 'react';
import { TaskProvider } from './contexts/TaskContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import CategoryManager from './components/CategoryManager';

function App() {
  const [showCategories, setShowCategories] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K to toggle dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // This will be handled by the ThemeProvider
      }
      
      // Ctrl/Cmd + C to toggle category manager
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        setShowCategories(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <ThemeProvider>
      <CategoryProvider>
        <TaskProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <TaskForm />
                  <FilterBar />
                  <TaskList />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <CategoryManager />
                  
                  {/* Keyboard Shortcuts Help */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Keyboard Shortcuts
                    </h3>
                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Toggle theme</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+K</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Toggle categories</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+C</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Made with ❤️ using React + Vite + Tailwind CSS</p>
            </footer>
          </div>
        </TaskProvider>
      </CategoryProvider>
    </ThemeProvider>
  );
}

export default App;
