import React, { useState } from 'react';
import type { CreateTaskInput, Project, Tag } from '../types';
import { X } from 'lucide-react';

interface TaskFormProps {
  projects: Project[];
  tags: Tag[];
  onSubmit: (data: CreateTaskInput) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function TaskForm({
  projects,
  tags,
  onSubmit,
  onClose,
  isLoading,
}: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '',
    description: '',
    priority: 'none',
    status: 'not_started',
    due_date: '',
    estimated_time: undefined,
    project_id: undefined,
    tags: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTagToggle = (tagId: number) => {
    const currentTags = formData.tags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId];
    setFormData({ ...formData, tags: newTags });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              className="input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={255}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              className="input"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              maxLength={10000}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-1">
                Priority
              </label>
              <select
                id="priority"
                className="input"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as any,
                  })
                }
              >
                <option value="none">No Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Status
              </label>
              <select
                id="status"
                className="input"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as any,
                  })
                }
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting">Waiting</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                Due Date
              </label>
              <input
                id="dueDate"
                type="datetime-local"
                className="input"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="estimatedTime"
                className="block text-sm font-medium mb-1"
              >
                Estimated Time (hours)
              </label>
              <input
                id="estimatedTime"
                type="number"
                className="input"
                min="0"
                step="0.5"
                value={formData.estimated_time || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_time: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>

          {projects.length > 0 && (
            <div>
              <label htmlFor="project" className="block text-sm font-medium mb-1">
                Project
              </label>
              <select
                id="project"
                className="input"
                value={formData.project_id || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    project_id: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              >
                <option value="">No Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.tags?.includes(tag.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
