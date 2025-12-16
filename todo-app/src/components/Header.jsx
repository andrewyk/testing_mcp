import { Moon, Sun, Download, Upload } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';
import { useRef } from 'react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { exportTasks, importTasks, getTaskStats } = useTasks();
  const fileInputRef = useRef(null);

  const stats = getTaskStats();

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTasks = JSON.parse(e.target.result);
          importTasks(importedTasks);
          alert('Tasks imported successfully!');
        } catch (error) {
          alert('Error importing tasks. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              📝 Todo App
            </h1>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                {stats.active} Active
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full">
                {stats.completed} Done
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Import tasks"
              aria-label="Import tasks"
            >
              <Upload size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            <button
              onClick={exportTasks}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Export tasks"
              aria-label="Export tasks"
            >
              <Download size={20} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
