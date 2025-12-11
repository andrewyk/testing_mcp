import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dataStore } from '../models/dataStore';
import { ApiError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { Project } from '../types';

export const createProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const { name, description, color, icon } = req.body;

    // Validation
    if (!name || name.trim().length === 0) {
      throw new ApiError('Project name is required', 400);
    }

    // Create project
    const project: Project = {
      id: uuidv4(),
      name: name.trim(),
      description: description?.trim(),
      color,
      icon,
      ownerId: req.userId,
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const createdProject = dataStore.createProject(project);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project: createdProject }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError('User not authenticated', 401);
    }

    // Get projects owned by user
    const projects = dataStore.getProjectsByOwner(req.userId);

    // Filter archived projects if requested
    let filteredProjects = projects;
    if (req.query.archived !== undefined) {
      const showArchived = req.query.archived === 'true';
      filteredProjects = projects.filter(p => p.archived === showArchived);
    }

    res.status(200).json({
      success: true,
      data: {
        projects: filteredProjects,
        count: filteredProjects.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const project = dataStore.getProjectById(req.params.id);

    if (!project) {
      throw new ApiError('Project not found', 404);
    }

    // Check if user owns this project
    if (project.ownerId !== req.userId) {
      throw new ApiError('Access denied', 403);
    }

    // Get tasks for this project
    const tasks = dataStore.getTasksByProject(project.id);

    res.status(200).json({
      success: true,
      data: {
        project,
        tasks,
        taskCount: tasks.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const project = dataStore.getProjectById(req.params.id);

    if (!project) {
      throw new ApiError('Project not found', 404);
    }

    // Check if user owns this project
    if (project.ownerId !== req.userId) {
      throw new ApiError('Access denied', 403);
    }

    const { name, description, color, icon, archived } = req.body;

    // Validate name if provided
    if (name !== undefined && (!name || name.trim().length === 0)) {
      throw new ApiError('Project name cannot be empty', 400);
    }

    const updates: Partial<Project> = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description?.trim();
    if (color !== undefined) updates.color = color;
    if (icon !== undefined) updates.icon = icon;
    if (archived !== undefined) updates.archived = archived;

    const updatedProject = dataStore.updateProject(req.params.id, updates);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: { project: updatedProject }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const project = dataStore.getProjectById(req.params.id);

    if (!project) {
      throw new ApiError('Project not found', 404);
    }

    // Check if user owns this project
    if (project.ownerId !== req.userId) {
      throw new ApiError('Access denied', 403);
    }

    // Check if project has tasks
    const tasks = dataStore.getTasksByProject(project.id);
    if (tasks.length > 0) {
      throw new ApiError(
        'Cannot delete project with tasks. Please delete or move all tasks first.',
        400
      );
    }

    dataStore.deleteProject(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
