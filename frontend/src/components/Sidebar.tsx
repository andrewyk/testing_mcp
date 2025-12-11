import React from 'react';
import type { Project } from '../types';
import './Sidebar.css';

interface SidebarProps {
  projects: Project[];
  selectedProject: string | null;
  onSelectProject: (id: string | null) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  filter,
  onFilterChange,
}) => {
  const filters = [
    { id: 'all', label: 'All Tasks', icon: '📋' },
    { id: 'today', label: 'Today', icon: '📅' },
    { id: 'upcoming', label: 'Upcoming', icon: '🗓️' },
    { id: 'active', label: 'Active', icon: '⚡' },
    { id: 'completed', label: 'Completed', icon: '✅' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h2 className="sidebar-heading">Filters</h2>
        <ul className="sidebar-list">
          {filters.map((f) => (
            <li
              key={f.id}
              className={`sidebar-item ${filter === f.id ? 'active' : ''}`}
              onClick={() => {
                onFilterChange(f.id);
                onSelectProject(null);
              }}
            >
              <span className="sidebar-icon">{f.icon}</span>
              <span className="sidebar-label">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <h2 className="sidebar-heading">Projects</h2>
        <ul className="sidebar-list">
          {projects.filter((p) => !p.archived).map((project) => (
            <li
              key={project.id}
              className={`sidebar-item ${selectedProject === project.id ? 'active' : ''}`}
              onClick={() => {
                onSelectProject(project.id);
                onFilterChange('all');
              }}
            >
              <span
                className="project-color"
                style={{ backgroundColor: project.color || '#667eea' }}
              ></span>
              <span className="sidebar-label">{project.name}</span>
            </li>
          ))}
          {projects.filter((p) => !p.archived).length === 0 && (
            <li className="sidebar-empty">No projects yet</li>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
