import React from 'react';
import type { Project, Tag } from '../types';
import { Home, Folder, Tag as TagIcon, Calendar, Star } from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  tags: Tag[];
  onFilterChange: (filters: { status?: string; priority?: string }) => void;
}

export default function Sidebar({ projects, tags, onFilterChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="p-6">
        <nav className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Views
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => onFilterChange({})}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Home className="w-5 h-5" />
                  <span>All Tasks</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterChange({ status: 'not_started' })}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Not Started</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterChange({ status: 'in_progress' })}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Star className="w-5 h-5" />
                  <span>In Progress</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterChange({ status: 'completed' })}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Star className="w-5 h-5" />
                  <span>Completed</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Priority
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => onFilterChange({ priority: 'high' })}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <span className="w-3 h-3 rounded-full bg-red-600"></span>
                  <span>High</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterChange({ priority: 'medium' })}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <span className="w-3 h-3 rounded-full bg-orange-600"></span>
                  <span>Medium</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterChange({ priority: 'low' })}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span>Low</span>
                </button>
              </li>
            </ul>
          </div>

          {projects.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Projects
              </h3>
              <ul className="space-y-1">
                {projects.slice(0, 5).map((project) => (
                  <li key={project.id}>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                      <Folder className="w-5 h-5" style={{ color: project.color }} />
                      <span className="truncate">{project.name}</span>
                      {project.task_count && project.task_count > 0 && (
                        <span className="ml-auto text-xs text-gray-500">
                          {project.task_count}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tags.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2 px-3">
                {tags.slice(0, 10).map((tag) => (
                  <button
                    key={tag.id}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: tag.color + '30',
                      color: tag.color,
                    }}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
