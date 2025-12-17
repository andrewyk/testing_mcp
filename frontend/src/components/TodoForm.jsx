import { useState, useEffect } from 'react';
import { useTodoStore } from '../store/todoStore';
import { Modal } from './Modal';
import { Input, TextArea, Select } from './Input';
import { Button } from './Button';

export const TodoForm = ({ todo, onClose }) => {
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    priority: todo?.priority || 'medium',
    due_date: todo?.due_date ? todo.due_date.split('T')[0] : '',
    project_id: todo?.project_id || '',
    tags: todo?.tags?.map((t) => t.id) || [],
  });

  const { createTodo, updateTodo, projects, tags } = useTodoStore();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        project_id: formData.project_id ? parseInt(formData.project_id) : null,
        due_date: formData.due_date || null,
      };

      if (todo) {
        await updateTodo(todo.id, data);
      } else {
        await createTodo(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={todo ? 'Edit Task' : 'Create New Task'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : todo ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="What needs to be done?"
        />

        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add more details..."
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />

          <Input
            label="Due Date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>

        <Select
          label="Project"
          name="project_id"
          value={formData.project_id}
          onChange={handleChange}
          options={[
            { value: '', label: 'No Project' },
            ...projects.map((p) => ({ value: p.id, label: p.name })),
          ]}
        />

        {tags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagChange(tag.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.tags.includes(tag.id)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
