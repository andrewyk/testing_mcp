import React from 'react';

const TaskList = ({ tasks, loading, onToggleComplete, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-orange-600 bg-orange-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      not_started: { text: 'Not Started', color: 'bg-gray-100 text-gray-800' },
      in_progress: { text: 'In Progress', color: 'bg-blue-100 text-blue-800' },
      waiting: { text: 'Waiting', color: 'bg-yellow-100 text-yellow-800' },
      blocked: { text: 'Blocked', color: 'bg-red-100 text-red-800' },
      completed: { text: 'Completed', color: 'bg-green-100 text-green-800' },
    };
    return badges[status] || badges.not_started;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const statusBadge = getStatusBadge(task.status);
        return (
          <div
            key={task.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow ${
              task.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className={`text-base font-medium ${
                        task.completed
                          ? 'line-through text-gray-500'
                          : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}
                      >
                        {statusBadge.text}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-gray-500">
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {task.category && (
                        <span className="text-xs text-gray-500">
                          📁 {task.category}
                        </span>
                      )}
                      {task.tags && task.tags.length > 0 && (
                        <span className="text-xs text-gray-500">
                          🏷️ {task.tags.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEdit(task)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
