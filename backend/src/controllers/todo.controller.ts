import { Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const createTodoValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),
  body('status')
    .optional()
    .isIn(['active', 'completed', 'archived'])
    .withMessage('Invalid status'),
  body('dueDate').optional().isISO8601(),
  body('categoryId').optional().isString(),
  body('tags').optional().isArray()
];

export const createTodo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.user!.userId;
    const { title, description, priority, status, dueDate, categoryId, tags, notes } = req.body;

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        priority: priority || 'medium',
        status: status || 'active',
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
        userId,
        categoryId,
        tags: tags?.length
          ? {
              create: tags.map((tagId: string) => ({
                tag: { connect: { id: tagId } }
              }))
            }
          : undefined
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        subtasks: true
      }
    });

    res.status(201).json({ todo });
  } catch (error) {
    next(error);
  }
};

export const getTodos = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const {
      status,
      priority,
      categoryId,
      tagId,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '50'
    } = req.query;

    const where: any = { userId };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (categoryId) where.categoryId = categoryId;
    if (tagId) {
      where.tags = {
        some: { tagId: tagId as string }
      };
    }
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { notes: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          },
          subtasks: true
        },
        orderBy: { [sortBy as string]: order },
        skip,
        take: limitNum
      }),
      prisma.todo.count({ where })
    ]);

    res.json({
      todos,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTodo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const todo = await prisma.todo.findFirst({
      where: { id, userId },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        subtasks: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!todo) {
      throw new AppError(404, 'Todo not found');
    }

    res.json({ todo });
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { title, description, priority, status, dueDate, categoryId, tags, notes } = req.body;

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: { id, userId }
    });

    if (!existingTodo) {
      throw new AppError(404, 'Todo not found');
    }

    const updateData: any = {
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      notes,
      categoryId
    };

    // Handle completion timestamp
    if (status === 'completed' && existingTodo.status !== 'completed') {
      updateData.completedAt = new Date();
    } else if (status !== 'completed') {
      updateData.completedAt = null;
    }

    // Update tags if provided
    if (tags !== undefined) {
      // Delete existing tags
      await prisma.todoTag.deleteMany({
        where: { todoId: id }
      });

      if (tags.length > 0) {
        updateData.tags = {
          create: tags.map((tagId: string) => ({
            tag: { connect: { id: tagId } }
          }))
        };
      }
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        subtasks: true
      }
    });

    res.json({ todo });
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const todo = await prisma.todo.findFirst({
      where: { id, userId }
    });

    if (!todo) {
      throw new AppError(404, 'Todo not found');
    }

    await prisma.todo.delete({
      where: { id }
    });

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteTodos = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(400, 'Invalid ids array');
    }

    const result = await prisma.todo.deleteMany({
      where: {
        id: { in: ids },
        userId
      }
    });

    res.json({ message: `${result.count} todos deleted successfully`, count: result.count });
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateTodos = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { ids, updates } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(400, 'Invalid ids array');
    }

    const result = await prisma.todo.updateMany({
      where: {
        id: { in: ids },
        userId
      },
      data: updates
    });

    res.json({ message: `${result.count} todos updated successfully`, count: result.count });
  } catch (error) {
    next(error);
  }
};
