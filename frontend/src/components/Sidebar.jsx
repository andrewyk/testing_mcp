import React from 'react';

const Sidebar = ({ view, onViewChange, projects, taskCount }) => {
  const views = [
    { id: 'all', name: 'All Tasks', icon: '📋', count: taskCount },
    { id: 'today', name: 'Today', icon: '📅', count: null },
    { id: 'upcoming', name: 'Upcoming', icon: '🗓️', count: null },
    { id: 'high-priority', name: 'High Priority', icon: '🔴', count: null },
    { id: 'completed', name: 'Completed', icon: '✅', count: null },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <nav className="space-y-1">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Views
          </h3>
          {views.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                view === item.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </span>
              {item.count !== null && (
                <span className="text-xs text-gray-500">{item.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Projects
          </h3>
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500 px-3 py-2">No projects yet</p>
          ) : (
            <div className="space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <span>{project.icon}</span>
                  <span>{project.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
