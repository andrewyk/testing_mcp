import { useState } from 'react';
import { Trash2, Edit2, GripVertical, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { useTasks } from '../contexts/TaskContext';
import { useCategories } from '../contexts/CategoryContext';
import { getPriorityColors, isOverdue } from '../utils/taskHelpers';
import TaskForm from './TaskForm';

const TaskItem = ({ task, isDragging }) => {
  const { deleteTask, toggleTaskComplete } = useTasks();
  const { getCategoryById } = useCategories();
  const [isEditing, setIsEditing] = useState(false);

  const priorityColors = getPriorityColors(task.priority);
  const category = task.category ? getCategoryById(task.category) : null;
  const overdue = isOverdue(task.dueDate, task.completed);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  if (isEditing) {
    return (
      <div className="mb-4">
        <TaskForm
          editingTask={task}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      } ${task.completed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start p-4 space-x-3">
        {/* Drag Handle */}
        <div className="drag-handle pt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical size={20} className="text-gray-400" />
        </div>

        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTaskComplete(task.id)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`text-lg font-medium ${
                  task.completed
                    ? 'line-through text-gray-500 dark:text-gray-400'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`mt-1 text-sm ${
                    task.completed
                      ? 'line-through text-gray-400 dark:text-gray-500'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {task.description}
                </p>
              )}

              {/* Tags and Metadata */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors.bg} ${priorityColors.text}`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>

                {/* Category Badge */}
                {category && (
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    <Tag size={12} className="mr-1" />
                    {category.name}
                  </span>
                )}

                {/* Due Date */}
                {task.dueDate && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      overdue
                        ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Calendar size={12} className="mr-1" />
                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    {overdue && ' (Overdue)'}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Edit task"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
