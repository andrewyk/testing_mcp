import React, { useState } from 'react';
import type { Task, Project } from '../types';
import './TaskForm.css';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: Partial<Task>) => void;
  onCancel: () => void;
  projects: Project[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  projects,
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'none',
    status: task?.status || 'not_started',
    dueDate: task?.dueDate?.split('T')[0] || '',
    dueTime: task?.dueTime || '',
    projectId: task?.projectId || '',
    tags: task?.tags?.join(', ') || '',
    estimatedTime: task?.estimatedTime?.toString() || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskData: Partial<Task> = {
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority as Task['priority'],
      status: formData.status as Task['status'],
      dueDate: formData.dueDate || undefined,
      dueTime: formData.dueTime || undefined,
      projectId: formData.projectId || undefined,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      estimatedTime: formData.estimatedTime
        ? parseFloat(formData.estimatedTime)
        : undefined,
    };

    onSubmit(taskData);
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-modal">
        <div className="task-form-header">
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={255}
              placeholder="What needs to be done?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Add more details..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="none">No Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting">Waiting</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueTime">Due Time</label>
              <input
                id="dueTime"
                name="dueTime"
                type="time"
                value={formData.dueTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="projectId">Project</label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
            >
              <option value="">No Project</option>
              {projects.filter((p) => !p.archived).map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              placeholder="work, urgent, review"
            />
          </div>

          <div className="form-group">
            <label htmlFor="estimatedTime">Estimated Time (hours)</label>
            <input
              id="estimatedTime"
              name="estimatedTime"
              type="number"
              step="0.5"
              min="0"
              value={formData.estimatedTime}
              onChange={handleChange}
              placeholder="2.5"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
