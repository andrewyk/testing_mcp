import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority, search, dueDate } = req.query;

    let tasks;

    if (status) {
      tasks = Task.filterByStatus(userId, status);
    } else if (priority) {
      tasks = Task.filterByPriority(userId, priority);
    } else if (search) {
      tasks = Task.search(userId, search);
    } else if (dueDate) {
      const date = new Date(dueDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      tasks = Task.filterByDueDate(userId, startOfDay, endOfDay);
    } else {
      tasks = Task.findAll(userId);
    }

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = Task.findById(req.params.id, req.user.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      userId: req.user.id
    };

    // Validate required fields
    if (!taskData.title || taskData.title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    if (taskData.title.length > 255) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot exceed 255 characters'
      });
    }

    const task = Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = Task.update(req.params.id, req.user.id, req.body);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deleted = Task.delete(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

export const toggleTaskComplete = async (req, res) => {
  try {
    const task = Task.findById(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const updatedTask = Task.update(req.params.id, req.user.id, {
      completed: !task.completed,
      status: !task.completed ? 'completed' : 'not_started'
    });

    res.json({
      success: true,
      message: 'Task status updated successfully',
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task status',
      error: error.message
    });
  }
};
