import { useState } from 'react';
import { useTodoStore } from '../store/todoStore';
import { Button } from './Button';
import { 
  FaHome, 
  FaInbox, 
  FaCalendar, 
  FaStar, 
  FaFolder, 
  FaTag,
  FaPlus,
  FaFilter
} from 'react-icons/fa';

export const Sidebar = () => {
  const { filters, setFilters, projects, tags } = useTodoStore();
  const [collapsed, setCollapsed] = useState(false);

  const filterOptions = [
    {
      label: 'All Tasks',
      icon: FaInbox,
      onClick: () => setFilters({ status: 'all', priority: null, project_id: null }),
      active: filters.status === 'all' && !filters.priority && !filters.project_id,
    },
    {
      label: 'Active',
      icon: FaHome,
      onClick: () => setFilters({ status: 'active', priority: null, project_id: null }),
      active: filters.status === 'active',
    },
    {
      label: 'Completed',
      icon: FaCalendar,
      onClick: () => setFilters({ status: 'completed', priority: null, project_id: null }),
      active: filters.status === 'completed',
    },
    {
      label: 'High Priority',
      icon: FaStar,
      onClick: () => setFilters({ ...filters, priority: 'high' }),
      active: filters.priority === 'high',
    },
  ];

  if (collapsed) {
    return (
      <aside className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(false)}
          className="w-full"
        >
          <FaFilter className="w-5 h-5" />
        </Button>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(true)}
          >
            <FaFilter className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-1">
          {filterOptions.map((option) => (
            <button
              key={option.label}
              onClick={option.onClick}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                option.active
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <option.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
            Projects
          </h3>
        </div>
        <div className="space-y-1">
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
              No projects yet
            </p>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setFilters({ ...filters, project_id: project.id })}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  filters.project_id === project.id
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span className="text-sm truncate">{project.name}</span>
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                  {project.todoCount}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
            Tags
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No tags yet
            </p>
          ) : (
            tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 text-xs rounded-full cursor-pointer"
                style={{
                  backgroundColor: tag.color + '20',
                  color: tag.color,
                }}
              >
                {tag.name}
              </span>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
