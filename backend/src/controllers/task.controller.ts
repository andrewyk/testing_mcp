import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dataStore } from '../models/dataStore';
import { ApiError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { Task } from '../types';

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const {
      title,
      description,
      priority = 'none',
      status = 'not_started',
      dueDate,
      dueTime,
      projectId,
      assigneeId,
      estimatedTime,
      tags = []
    } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      throw new ApiError('Title is required', 400);
    }

    if (title.length > 255) {
      throw new ApiError('Title must be 255 characters or less', 400);
    }

    // Create task
    const task: Task = {
      id: uuidv4(),
      title: title.trim(),
      description: description?.trim(),
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      dueTime,
      projectId,
      assigneeId,
      createdById: req.userId,
      estimatedTime,
      tags: tags || [],
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const createdTask = dataStore.createTask(task);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task: createdTask }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError('User not authenticated', 401);
    }

    // Get tasks for current user
    const tasks = dataStore.getTasksByUser(req.userId);

    // Apply filters from query params
    let filteredTasks = tasks;

    if (req.query.projectId) {
      filteredTasks = filteredTasks.filter(t => t.projectId === req.query.projectId);
    }

    if (req.query.priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === req.query.priority);
    }

    if (req.query.status) {
      filteredTasks = filteredTasks.filter(t => t.status === req.query.status);
    }

    if (req.query.completed !== undefined) {
      const isCompleted = req.query.completed === 'true';
      filteredTasks = filteredTasks.filter(t => t.completed === isCompleted);
    }

    // Sort tasks
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) || 'desc';

    filteredTasks.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Task];
      let bVal: any = b[sortBy as keyof Task];

      if (aVal instanceof Date) aVal = aVal.getTime();
      if (bVal instanceof Date) bVal = bVal.getTime();

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        tasks: filteredTasks,
        count: filteredTasks.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const task = dataStore.getTaskById(req.params.id);

    if (!task) {
      throw new ApiError('Task not found', 404);
    }

    // Check if user has access to this task
    if (task.createdById !== req.userId && task.assigneeId !== req.userId) {
      throw new ApiError('Access denied', 403);
    }

    res.status(200).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const task = dataStore.getTaskById(req.params.id);

    if (!task) {
      throw new ApiError('Task not found', 404);
    }

    // Check if user has access to this task
    if (task.createdById !== req.userId && task.assigneeId !== req.userId) {
      throw new ApiError('Access denied', 403);
    }

    const {
      title,
      description,
      priority,
      status,
      dueDate,
      dueTime,
      projectId,
      assigneeId,
      estimatedTime,
      actualTime,
      tags
    } = req.body;

    // Validate title if provided
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        throw new ApiError('Title cannot be empty', 400);
      }
      if (title.length > 255) {
        throw new ApiError('Title must be 255 characters or less', 400);
      }
    }

    const updates: Partial<Task> = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description?.trim();
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (dueTime !== undefined) updates.dueTime = dueTime;
    if (projectId !== undefined) updates.projectId = projectId;
    if (assigneeId !== undefined) updates.assigneeId = assigneeId;
    if (estimatedTime !== undefined) updates.estimatedTime = estimatedTime;
    if (actualTime !== undefined) updates.actualTime = actualTime;
    if (tags !== undefined) updates.tags = tags;

    const updatedTask = dataStore.updateTask(req.params.id, updates);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task: updatedTask }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const task = dataStore.getTaskById(req.params.id);

    if (!task) {
      throw new ApiError('Task not found', 404);
    }

    // Only creator can delete
    if (task.createdById !== req.userId) {
      throw new ApiError('Only the task creator can delete this task', 403);
    }

    dataStore.deleteTask(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const toggleTaskComplete = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const task = dataStore.getTaskById(req.params.id);

    if (!task) {
      throw new ApiError('Task not found', 404);
    }

    // Check if user has access to this task
    if (task.createdById !== req.userId && task.assigneeId !== req.userId) {
      throw new ApiError('Access denied', 403);
    }

    const updates: Partial<Task> = {
      completed: !task.completed,
      completedAt: !task.completed ? new Date() : undefined,
      status: !task.completed ? 'completed' : 'not_started'
    };

    const updatedTask = dataStore.updateTask(req.params.id, updates);

    res.status(200).json({
      success: true,
      message: `Task marked as ${updatedTask?.completed ? 'completed' : 'incomplete'}`,
      data: { task: updatedTask }
    });
  } catch (error) {
    next(error);
  }
};
