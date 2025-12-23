const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// In-memory task storage (Phase 1 - will be replaced with database)
let tasks = [];
let nextId = 1;

// Helper function to find task by ID
const findTaskById = (id) => tasks.find(task => task.id === String(id));

// GET /api/tasks - Get all tasks
app.get('/api/tasks', (req, res) => {
  const { status, priority, sort } = req.query;
  
  let filteredTasks = [...tasks];
  
  // Filter by status
  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }
  
  // Filter by priority
  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }
  
  // Sort tasks
  if (sort === 'dueDate') {
    filteredTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  } else if (sort === 'priority') {
    const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
    filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (sort === 'createdAt') {
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  res.json(filteredTasks);
});

// GET /api/tasks/:id - Get a specific task
app.get('/api/tasks/:id', (req, res) => {
  const task = findTaskById(req.params.id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.json(task);
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, priority, dueDate, status } = req.body;
  
  // Validation
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  if (title.length > 255) {
    return res.status(400).json({ error: 'Title must be 255 characters or less' });
  }
  
  if (description && description.length > 10000) {
    return res.status(400).json({ error: 'Description must be 10,000 characters or less' });
  }
  
  const validPriorities = ['high', 'medium', 'low', 'none'];
  const validStatuses = ['not_started', 'in_progress', 'waiting', 'blocked', 'completed'];
  
  const taskPriority = priority && validPriorities.includes(priority) ? priority : 'none';
  const taskStatus = status && validStatuses.includes(status) ? status : 'not_started';
  
  const newTask = {
    id: String(nextId++),
    title: title.trim(),
    description: description ? description.trim() : '',
    priority: taskPriority,
    dueDate: dueDate || null,
    status: taskStatus,
    completed: taskStatus === 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update a task
app.put('/api/tasks/:id', (req, res) => {
  const task = findTaskById(req.params.id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const { title, description, priority, dueDate, status, completed } = req.body;
  
  // Validation
  if (title !== undefined) {
    if (title.trim().length === 0) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    if (title.length > 255) {
      return res.status(400).json({ error: 'Title must be 255 characters or less' });
    }
    task.title = title.trim();
  }
  
  if (description !== undefined) {
    if (description.length > 10000) {
      return res.status(400).json({ error: 'Description must be 10,000 characters or less' });
    }
    task.description = description.trim();
  }
  
  const validPriorities = ['high', 'medium', 'low', 'none'];
  const validStatuses = ['not_started', 'in_progress', 'waiting', 'blocked', 'completed'];
  
  if (priority !== undefined && validPriorities.includes(priority)) {
    task.priority = priority;
  }
  
  if (status !== undefined && validStatuses.includes(status)) {
    task.status = status;
    task.completed = status === 'completed';
  }
  
  if (completed !== undefined && typeof completed === 'boolean') {
    task.completed = completed;
    // Only update status if marking as completed, preserve existing status when uncompleting
    if (completed) {
      task.status = 'completed';
    } else if (task.status === 'completed') {
      task.status = 'in_progress';
    }
  }
  
  if (dueDate !== undefined) {
    task.dueDate = dueDate;
  }
  
  task.updatedAt = new Date().toISOString();
  
  res.json(task);
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(task => task.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Todo API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoints: http://localhost:${PORT}/api/tasks`);
});

module.exports = app;
