const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage
const storage = {
  tasks: new Map(),
  projects: new Map(),
  users: new Map(),
  trash: new Map(),
};

// Initialize default data
const initializeData = () => {
  // Create default user
  const defaultUser = {
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@example.com',
  };
  storage.users.set(defaultUser.id, defaultUser);

  // Create default projects
  const defaultProjects = [
    {
      id: 'proj-1',
      name: 'Personal',
      description: 'Personal tasks and goals',
      color: '#3B82F6',
      icon: '👤',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'proj-2',
      name: 'Work',
      description: 'Work-related tasks',
      color: '#10B981',
      icon: '💼',
      createdAt: new Date().toISOString(),
    },
  ];

  defaultProjects.forEach(project => storage.projects.set(project.id, project));

  // Create sample tasks
  const sampleTasks = [
    {
      id: uuidv4(),
      title: 'Welcome to your Todo App!',
      description: 'This is a comprehensive task management system. Click to edit this task and explore all the features.',
      priority: 'high',
      status: 'not_started',
      projectId: 'proj-1',
      tags: ['welcome', 'demo'],
      assignee: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  sampleTasks.forEach(task => storage.tasks.set(task.id, task));
};

initializeData();

// Helper function to validate task data
const validateTask = (task) => {
  if (!task.title || task.title.trim().length === 0) {
    throw new Error('Task title is required');
  }
  if (task.title.length > 255) {
    throw new Error('Task title must be 255 characters or less');
  }
  if (task.description && task.description.length > 10000) {
    throw new Error('Task description must be 10,000 characters or less');
  }
  return true;
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  const { projectId, status, priority, assignee, tag, search } = req.query;
  let tasks = Array.from(storage.tasks.values());

  // Apply filters
  if (projectId) {
    tasks = tasks.filter(task => task.projectId === projectId);
  }
  if (status) {
    tasks = tasks.filter(task => task.status === status);
  }
  if (priority) {
    tasks = tasks.filter(task => task.priority === priority);
  }
  if (assignee) {
    tasks = tasks.filter(task => task.assignee === assignee);
  }
  if (tag) {
    tasks = tasks.filter(task => task.tags && task.tags.includes(tag));
  }
  if (search) {
    const searchLower = search.toLowerCase();
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower))
    );
  }

  // Sort by priority and creation date
  tasks.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
    const aPriority = priorityOrder[a.priority] ?? 3;
    const bPriority = priorityOrder[b.priority] ?? 3;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.json(tasks);
});

// Get single task
app.get('/api/tasks/:id', (req, res) => {
  const task = storage.tasks.get(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// Create task
app.post('/api/tasks', (req, res) => {
  try {
    const taskData = req.body;
    validateTask(taskData);

    const task = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'none',
      status: taskData.status || 'not_started',
      projectId: taskData.projectId || null,
      tags: taskData.tags || [],
      assignee: taskData.assignee || null,
      dueDate: taskData.dueDate || null,
      estimatedTime: taskData.estimatedTime || null,
      actualTime: taskData.actualTime || null,
      subtasks: taskData.subtasks || [],
      recurrence: taskData.recurrence || null,
      dependencies: taskData.dependencies || [],
      labels: taskData.labels || [],
      attachments: taskData.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
    };

    storage.tasks.set(task.id, task);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const task = storage.tasks.get(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updates = req.body;
    validateTask({ ...task, ...updates });

    const updatedTask = {
      ...task,
      ...updates,
      id: task.id, // Preserve ID
      createdAt: task.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    // Update completedAt timestamp
    if (updates.status === 'completed' && task.status !== 'completed') {
      updatedTask.completedAt = new Date().toISOString();
    } else if (updates.status !== 'completed') {
      updatedTask.completedAt = null;
    }

    storage.tasks.set(task.id, updatedTask);
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete task (move to trash)
app.delete('/api/tasks/:id', (req, res) => {
  const task = storage.tasks.get(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Move to trash
  const trashedTask = {
    ...task,
    deletedAt: new Date().toISOString(),
    permanentDeleteAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  };

  storage.trash.set(task.id, trashedTask);
  storage.tasks.delete(task.id);

  res.json({ message: 'Task moved to trash', task: trashedTask });
});

// Get trash items
app.get('/api/trash', (req, res) => {
  const trashItems = Array.from(storage.trash.values());
  res.json(trashItems);
});

// Restore from trash
app.post('/api/trash/:id/restore', (req, res) => {
  const task = storage.trash.get(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found in trash' });
  }

  // Remove trash metadata
  const { deletedAt, permanentDeleteAt, ...restoredTask } = task;
  restoredTask.updatedAt = new Date().toISOString();

  storage.tasks.set(task.id, restoredTask);
  storage.trash.delete(task.id);

  res.json({ message: 'Task restored', task: restoredTask });
});

// Permanently delete from trash
app.delete('/api/trash/:id', (req, res) => {
  const task = storage.trash.get(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found in trash' });
  }

  storage.trash.delete(task.id);
  res.json({ message: 'Task permanently deleted' });
});

// Project routes

// Get all projects
app.get('/api/projects', (req, res) => {
  const projects = Array.from(storage.projects.values());
  res.json(projects);
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const project = storage.projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// Create project
app.post('/api/projects', (req, res) => {
  const projectData = req.body;

  if (!projectData.name || projectData.name.trim().length === 0) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const project = {
    id: uuidv4(),
    name: projectData.name,
    description: projectData.description || '',
    color: projectData.color || '#6366F1',
    icon: projectData.icon || '📁',
    parentId: projectData.parentId || null,
    settings: projectData.settings || {},
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  storage.projects.set(project.id, project);
  res.status(201).json(project);
});

// Update project
app.put('/api/projects/:id', (req, res) => {
  const project = storage.projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const updates = req.body;
  const updatedProject = {
    ...project,
    ...updates,
    id: project.id,
    createdAt: project.createdAt,
    updatedAt: new Date().toISOString(),
  };

  storage.projects.set(project.id, updatedProject);
  res.json(updatedProject);
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  const project = storage.projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Check if project has tasks
  const projectTasks = Array.from(storage.tasks.values()).filter(
    task => task.projectId === req.params.id
  );

  if (projectTasks.length > 0) {
    return res.status(400).json({
      error: 'Cannot delete project with tasks. Please delete or move tasks first.',
      taskCount: projectTasks.length,
    });
  }

  storage.projects.delete(req.params.id);
  res.json({ message: 'Project deleted' });
});

// Get project statistics
app.get('/api/projects/:id/stats', (req, res) => {
  const project = storage.projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const tasks = Array.from(storage.tasks.values()).filter(
    task => task.projectId === req.params.id
  );

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    notStartedTasks: tasks.filter(t => t.status === 'not_started').length,
    blockedTasks: tasks.filter(t => t.status === 'blocked').length,
    highPriorityTasks: tasks.filter(t => t.priority === 'high').length,
    overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
  };

  res.json(stats);
});

// User routes

// Get all users
app.get('/api/users', (req, res) => {
  const users = Array.from(storage.users.values());
  res.json(users);
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const tasks = Array.from(storage.tasks.values());
  const projects = Array.from(storage.projects.values());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => !p.archived).length,
    tasksDueToday: tasks.filter(t => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }).length,
    overdueTasks: tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length,
    highPriorityTasks: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length,
  };

  res.json(stats);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Todo API Server running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Dashboard stats: http://localhost:${PORT}/api/dashboard/stats`);
});

module.exports = app;
