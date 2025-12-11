import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import pool from '../config/database';
import Joi from 'joi';

const projectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#3B82F6'),
  icon: Joi.string().default('folder'),
});

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, color, icon } = value;
    const userId = req.user!.id;

    const result = await pool.query(
      `INSERT INTO projects (name, description, color, icon, owner_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, description, color, icon, owner_id, created_at`,
      [name, description || null, color, icon, userId]
    );

    const project = result.rows[0];

    res.status(201).json({
      message: 'Project created successfully',
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        color: project.color,
        icon: project.icon,
        ownerId: project.owner_id,
        createdAt: project.created_at,
      },
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      `SELECT p.*, u.username as owner_username,
              (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count
       FROM projects p
       JOIN users u ON p.owner_id = u.id
       WHERE p.owner_id = $1 AND p.is_archived = false
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json({
      projects: result.rows.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        color: project.color,
        icon: project.icon,
        ownerId: project.owner_id,
        ownerUsername: project.owner_username,
        taskCount: parseInt(project.task_count),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      })),
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

export const getProject = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = req.user!.id;

    const result = await pool.query(
      `SELECT p.*, u.username as owner_username,
              (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count
       FROM projects p
       JOIN users u ON p.owner_id = u.id
       WHERE p.id = $1 AND p.owner_id = $2`,
      [projectId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = result.rows[0];

    res.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        color: project.color,
        icon: project.icon,
        ownerId: project.owner_id,
        ownerUsername: project.owner_username,
        taskCount: parseInt(project.task_count),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      },
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = req.user!.id;
    const { name, description, color, icon } = req.body;

    // Check if project exists and user owns it
    const existingProject = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND owner_id = $2',
      [projectId, userId]
    );

    if (existingProject.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found or access denied' });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (name !== undefined) {
      paramCount++;
      updates.push(`name = $${paramCount}`);
      values.push(name);
    }

    if (description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      values.push(description);
    }

    if (color !== undefined) {
      paramCount++;
      updates.push(`color = $${paramCount}`);
      values.push(color);
    }

    if (icon !== undefined) {
      paramCount++;
      updates.push(`icon = $${paramCount}`);
      values.push(icon);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    values.push(projectId);

    const result = await pool.query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount + 1} RETURNING *`,
      values
    );

    const project = result.rows[0];

    res.json({
      message: 'Project updated successfully',
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        color: project.color,
        icon: project.icon,
        updatedAt: project.updated_at,
      },
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = req.user!.id;

    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING id',
      [projectId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found or access denied' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
