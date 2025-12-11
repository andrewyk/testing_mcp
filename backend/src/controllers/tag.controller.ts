import { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const createTagValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('color').optional().isString()
];

export const createTag = async (
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

    const tag = await prisma.tag.create({
      data: {
        name,
        color,
        userId
      }
    });

    res.status(201).json({ tag });
  } catch (error) {
    if ((error as any).code === 'P2002') {
      next(new AppError(400, 'Tag with this name already exists'));
    } else {
      next(error);
    }
  }
};

export const getTags = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const tags = await prisma.tag.findMany({
      where: { userId },
      include: {
        _count: {
          select: { todos: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ tags });
  } catch (error) {
    next(error);
  }
};

export const updateTag = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { name, color } = req.body;

    const tag = await prisma.tag.findFirst({
      where: { id, userId }
    });

    if (!tag) {
      throw new AppError(404, 'Tag not found');
    }

    const updated = await prisma.tag.update({
      where: { id },
      data: { name, color }
    });

    res.json({ tag: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const tag = await prisma.tag.findFirst({
      where: { id, userId }
    });

    if (!tag) {
      throw new AppError(404, 'Tag not found');
    }

    await prisma.tag.delete({
      where: { id }
    });

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    next(error);
  }
};
