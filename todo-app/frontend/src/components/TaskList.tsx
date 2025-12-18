import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/api';
import type { Task, Project, Tag } from '../types';
import { Check, Clock, Flag, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
  tags: Tag[];
}

const priorityColors = {
  high: 'text-red-600 bg-red-100 dark:bg-red-900/30',
  medium: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
  low: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  none: 'text-gray-600 bg-gray-100 dark:bg-gray-700',
};

const statusLabels = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  waiting: 'Waiting',
  blocked: 'Blocked',
  completed: 'Completed',
};

export default function TaskList({ tasks, projects, tags }: TaskListProps) {
  const queryClient = useQueryClient();
  const [expandedTask, setExpandedTask] = useState<number | null>(null);

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleComplete = (task: Task) => {
    const isCompleted = task.status === 'completed';
    updateTaskMutation.mutate({
      id: task.id,
      data: {
        status: isCompleted ? 'not_started' : 'completed',
        completed_at: isCompleted ? null : new Date().toISOString(),
      },
    });
  };

  const handleDelete = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`card p-4 hover:shadow-md transition-shadow ${
            task.status === 'completed' ? 'opacity-75' : ''
          }`}
        >
          <div className="flex items-start space-x-4">
            <button
              onClick={() => toggleComplete(task)}
              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                task.status === 'completed'
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 hover:border-blue-600'
              }`}
            >
              {task.status === 'completed' && (
                <Check className="w-4 h-4 text-white" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold ${
                      task.status === 'completed'
                        ? 'line-through text-gray-500'
                        : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {task.priority !== 'none' && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      priorityColors[task.priority]
                    }`}
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                )}

                {task.status !== 'completed' && task.status !== 'not_started' && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30">
                    {statusLabels[task.status]}
                  </span>
                )}

                {task.due_date && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30">
                    <Clock className="w-3 h-3 mr-1" />
                    {format(new Date(task.due_date), 'MMM d, yyyy')}
                  </span>
                )}

                {task.project_name && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30">
                    {task.project_name}
                  </span>
                )}

                {task.tags && task.tags.length > 0 &&
                  task.tags.filter(tag => tag !== null).map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: tag.color + '30',
                        color: tag.color,
                      }}
                    >
                      #{tag.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
