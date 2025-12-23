import { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const createCategoryValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('color').optional().isString()
];

export const createCategory = async (
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
    const { name, color } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId
      }
    });

    res.status(201).json({ category });
  } catch (error) {
    if ((error as any).code === 'P2002') {
      next(new AppError(400, 'Category with this name already exists'));
    } else {
      next(error);
    }
  }
};

export const getCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        _count: {
          select: { todos: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { name, color } = req.body;

    const category = await prisma.category.findFirst({
      where: { id, userId }
    });

    if (!category) {
      throw new AppError(404, 'Category not found');
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name, color }
    });

    res.json({ category: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: { id, userId }
    });

    if (!category) {
      throw new AppError(404, 'Category not found');
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
