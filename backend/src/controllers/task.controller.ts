import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Task, Project, Tag } from '../models';
import { AppError } from '../middleware/errorHandler';
import { Op } from 'sequelize';

export const getTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { projectId, status, priority, dueDate, search } = req.query;

    const where: any = { userId };

    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (dueDate === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      where.dueDate = { [Op.between]: [today, tomorrow] };
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const tasks = await Task.findAll({
      where,
      include: [
        { association: 'project', attributes: ['id', 'name', 'color'] },
        { association: 'assignee', attributes: ['id', 'name', 'email'] },
        { association: 'tags', attributes: ['id', 'name', 'color'] },
        { association: 'subtasks', attributes: ['id', 'title', 'isCompleted'] },
      ],
      order: [['position', 'ASC'], ['createdAt', 'DESC']],
    });

    res.json({
      status: 'success',
      results: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const task = await Task.findOne({
      where: { id, userId },
      include: [
        { association: 'project', attributes: ['id', 'name', 'color'] },
        { association: 'assignee', attributes: ['id', 'name', 'email'] },
        { association: 'tags', attributes: ['id', 'name', 'color'] },
        { association: 'subtasks', attributes: ['id', 'title', 'isCompleted'] },
      ],
    });

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    res.json({
      status: 'success',
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const taskData = { ...req.body, userId };

    const task = await Task.create(taskData);

    if (req.body.tags && Array.isArray(req.body.tags)) {
      await (task as any).setTags(req.body.tags);
    }

    const createdTask = await Task.findByPk(task.id, {
      include: [
        { association: 'project', attributes: ['id', 'name', 'color'] },
        { association: 'tags', attributes: ['id', 'name', 'color'] },
      ],
    });

    res.status(201).json({
      status: 'success',
      task: createdTask,
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
    const { id } = req.params;
    const userId = req.user?.id;

    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    await task.update(req.body);

    if (req.body.tags && Array.isArray(req.body.tags)) {
      await (task as any).setTags(req.body.tags);
    }

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { association: 'project', attributes: ['id', 'name', 'color'] },
        { association: 'assignee', attributes: ['id', 'name', 'email'] },
        { association: 'tags', attributes: ['id', 'name', 'color'] },
      ],
    });

    res.json({
      status: 'success',
      task: updatedTask,
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
    const { id } = req.params;
    const userId = req.user?.id;

    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    await task.destroy();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
