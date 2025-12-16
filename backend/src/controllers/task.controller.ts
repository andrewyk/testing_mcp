import { Response, NextFunction } from 'express'
import { z } from 'zod'
import { ApiError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().optional(),
})

export const getTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Fetch tasks from database
    const tasks: any[] = []

    res.json({
      success: true,
      data: tasks,
    })
  } catch (error) {
    next(error)
  }
}

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    // TODO: Fetch task from database
    const task = null

    if (!task) {
      throw new ApiError(404, 'Task not found')
    }

    res.json({
      success: true,
      data: task,
    })
  } catch (error) {
    next(error)
  }
}

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = taskSchema.parse(req.body)

    // TODO: Save task to database
    const task = {
      id: 'temp-id',
      ...validatedData,
      creatorId: req.user?.id,
      createdAt: new Date().toISOString(),
    }

    res.status(201).json({
      success: true,
      data: task,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, error.errors[0].message))
    } else {
      next(error)
    }
  }
}

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const validatedData = taskSchema.partial().parse(req.body)

    // TODO: Update task in database
    const task = {
      id,
      ...validatedData,
      updatedAt: new Date().toISOString(),
    }

    res.json({
      success: true,
      data: task,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, error.errors[0].message))
    } else {
      next(error)
    }
  }
}

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    // TODO: Delete task from database

    res.json({
      success: true,
      message: 'Task deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
}
