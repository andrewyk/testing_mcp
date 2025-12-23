import React from 'react';
import type { Task } from '../types';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const getPriorityClass = (priority: string) => {
    const classes: Record<string, string> = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low',
      none: 'priority-none',
    };
    return classes[priority] || 'priority-none';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No tasks found</h3>
        <p>Create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          <div className="task-checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
            />
          </div>

          <div className="task-content">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              {task.priority !== 'none' && (
                <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
              )}
            </div>

            {task.description && (
              <p className="task-description">{task.description}</p>
            )}

            <div className="task-meta">
              {task.dueDate && (
                <span className="task-due-date">
                  📅 {formatDate(task.dueDate)}
                </span>
              )}
              {task.tags && task.tags.length > 0 && (
                <div className="task-tags">
                  {task.tags.map((tag, idx) => (
                    <span key={idx} className="task-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="task-actions">
            <button
              className="btn-icon btn-edit"
              onClick={() => onEdit(task)}
              title="Edit task"
            >
              ✏️
            </button>
            <button
              className="btn-icon btn-delete"
              onClick={() => onDelete(task.id)}
              title="Delete task"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
