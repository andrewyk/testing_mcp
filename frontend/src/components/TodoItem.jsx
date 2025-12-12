import { useState } from 'react';
import { useTodoStore } from '../store/todoStore';
import { Card } from './Card';
import { Button } from './Button';
import { TodoForm } from './TodoForm';
import { FaEdit, FaTrash, FaCheck, FaCalendar, FaFlag } from 'react-icons/fa';
import { format } from 'date-fns';

export const TodoItem = ({ todo }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const { toggleTodo, deleteTodo } = useTodoStore();

  const priorityColors = {
    low: 'text-blue-600 dark:text-blue-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    high: 'text-red-600 dark:text-red-400',
  };

  const handleToggle = async () => {
    await toggleTodo(todo.id);
  };

  const handleDelete = async () => {
    if (window.confirm('Move this task to trash?')) {
      await deleteTodo(todo.id);
    }
  };

  return (
    <>
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              todo.completed
                ? 'bg-primary-600 border-primary-600'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-600'
            }`}
            aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {todo.completed && <FaCheck className="w-3 h-3 text-white" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-medium ${
                todo.completed
                  ? 'line-through text-gray-500 dark:text-gray-500'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {todo.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-2">
              {/* Priority */}
              {todo.priority && (
                <span className={`flex items-center gap-1 text-sm ${priorityColors[todo.priority]}`}>
                  <FaFlag className="w-3 h-3" />
                  {todo.priority}
                </span>
              )}

              {/* Due Date */}
              {todo.due_date && (
                <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <FaCalendar className="w-3 h-3" />
                  {format(new Date(todo.due_date), 'MMM dd, yyyy')}
                </span>
              )}

              {/* Tags */}
              {todo.tags && todo.tags.length > 0 && (
                <div className="flex gap-2">
                  {todo.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: tag.color + '20',
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Subtasks Progress */}
              {todo.subtasks && todo.subtasks.length > 0 && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {todo.subtasks.filter((st) => st.completed).length}/{todo.subtasks.length} subtasks
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditForm(true)}
              aria-label="Edit task"
            >
              <FaEdit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              aria-label="Delete task"
            >
              <FaTrash className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
      </Card>

      {showEditForm && (
        <TodoForm
          todo={todo}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </>
  );
};
