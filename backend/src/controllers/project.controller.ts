import { Response, NextFunction } from 'express'
import { z } from 'zod'
import { ApiError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().default('#3B82F6'),
  icon: z.string().optional(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).default('ACTIVE'),
})

export const getProjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Fetch projects from database
    const projects: any[] = []

    res.json({
      success: true,
      data: projects,
    })
  } catch (error) {
    next(error)
  }
}

export const getProjectById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    // TODO: Fetch project from database
    const project = null

    if (!project) {
      throw new ApiError(404, 'Project not found')
    }

    res.json({
      success: true,
      data: project,
    })
  } catch (error) {
    next(error)
  }
}

export const createProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = projectSchema.parse(req.body)

    // TODO: Save project to database
    const project = {
      id: 'temp-id',
      ...validatedData,
      ownerId: req.user?.id,
      createdAt: new Date().toISOString(),
    }

    res.status(201).json({
      success: true,
      data: project,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, error.errors[0].message))
    } else {
      next(error)
    }
  }
}

export const updateProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const validatedData = projectSchema.partial().parse(req.body)

    // TODO: Update project in database
    const project = {
      id,
      ...validatedData,
      updatedAt: new Date().toISOString(),
    }

    res.json({
      success: true,
      data: project,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, error.errors[0].message))
    } else {
      next(error)
    }
  }
}

export const deleteProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    // TODO: Delete project from database

    res.json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
}
