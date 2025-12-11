import { FiCheck, FiTrash2, FiCalendar } from 'react-icons/fi';
import { Task, Priority } from '../types';
import { taskService } from '../services/task.service';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

const priorityColors: Record<Priority, string> = {
  high: 'border-l-4 border-red-500',
  medium: 'border-l-4 border-orange-500',
  low: 'border-l-4 border-blue-500',
  none: 'border-l-4 border-gray-300',
};

const priorityBadges: Record<Priority, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  none: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export default function TaskItem({ task, onUpdate }: TaskItemProps) {
  const handleToggleComplete = async () => {
    try {
      await taskService.updateTask(task.id, {
        isCompleted: !task.isCompleted,
        status: !task.isCompleted ? 'completed' : 'not_started',
      } as any);
      toast.success(task.isCompleted ? 'Task marked incomplete' : 'Task completed!');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.deleteTask(task.id);
      toast.success('Task deleted');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div
      className={`card p-4 transition-all hover:shadow-md ${priorityColors[task.priority]} ${
        task.isCompleted ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggleComplete}
          className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            task.isCompleted
              ? 'bg-primary-600 border-primary-600'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
          }`}
        >
          {task.isCompleted && <FiCheck className="text-white" size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium text-gray-900 dark:text-white ${
              task.isCompleted ? 'line-through' : ''
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                priorityBadges[task.priority]
              }`}
            >
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <FiCalendar size={12} />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
            {task.project && (
              <span
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: task.project.color + '20',
                  color: task.project.color,
                }}
              >
                {task.project.name}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
}
