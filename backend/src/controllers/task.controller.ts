import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import pool from '../config/database';
import Joi from 'joi';

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  projectId: Joi.number().integer().optional(),
  status: Joi.string().valid('todo', 'in_progress', 'done', 'cancelled').default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  dueDate: Joi.date().optional(),
  assigneeId: Joi.number().integer().optional(),
});

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description, projectId, status, priority, dueDate, assigneeId } = value;
    const userId = req.user!.id;

    const result = await pool.query(
      `INSERT INTO tasks (title, description, project_id, creator_id, assignee_id, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, title, description, project_id, creator_id, assignee_id, status, priority, due_date, created_at`,
      [title, description || null, projectId || null, userId, assigneeId || null, status, priority, dueDate || null]
    );

    const task = result.rows[0];

    res.status(201).json({
      message: 'Task created successfully',
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        projectId: task.project_id,
        creatorId: task.creator_id,
        assigneeId: task.assignee_id,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        createdAt: task.created_at,
      },
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, priority, projectId } = req.query;

    let query = `
      SELECT t.*, 
             u1.username as creator_username,
             u2.username as assignee_username,
             p.name as project_name
      FROM tasks t
      LEFT JOIN users u1 ON t.creator_id = u1.id
      LEFT JOIN users u2 ON t.assignee_id = u2.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE (t.creator_id = $1 OR t.assignee_id = $1)
    `;

    const params: any[] = [userId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND t.status = $${paramCount}`;
      params.push(status);
    }

    if (priority) {
      paramCount++;
      query += ` AND t.priority = $${paramCount}`;
      params.push(priority);
    }

    if (projectId) {
      paramCount++;
      query += ` AND t.project_id = $${paramCount}`;
      params.push(projectId);
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      tasks: result.rows.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        projectId: task.project_id,
        projectName: task.project_name,
        creatorId: task.creator_id,
        creatorUsername: task.creator_username,
        assigneeId: task.assignee_id,
        assigneeUsername: task.assignee_username,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        completedAt: task.completed_at,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      })),
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);
    const userId = req.user!.id;

    const result = await pool.query(
      `SELECT t.*, 
              u1.username as creator_username,
              u2.username as assignee_username,
              p.name as project_name
       FROM tasks t
       LEFT JOIN users u1 ON t.creator_id = u1.id
       LEFT JOIN users u2 ON t.assignee_id = u2.id
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.id = $1 AND (t.creator_id = $2 OR t.assignee_id = $2)`,
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = result.rows[0];

    res.json({
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        projectId: task.project_id,
        projectName: task.project_name,
        creatorId: task.creator_id,
        creatorUsername: task.creator_username,
        assigneeId: task.assignee_id,
        assigneeUsername: task.assignee_username,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        completedAt: task.completed_at,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      },
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to get task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);
    const userId = req.user!.id;
    const { title, description, status, priority, dueDate, assigneeId } = req.body;

    // Check if task exists and user has permission
    const existingTask = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND (creator_id = $2 OR assignee_id = $2)',
      [taskId, userId]
    );

    if (existingTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (title !== undefined) {
      paramCount++;
      updates.push(`title = $${paramCount}`);
      values.push(title);
    }

    if (description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      values.push(description);
    }

    if (status !== undefined) {
      paramCount++;
      updates.push(`status = $${paramCount}`);
      values.push(status);
      
      if (status === 'done') {
        paramCount++;
        updates.push(`completed_at = $${paramCount}`);
        values.push(new Date());
      }
    }

    if (priority !== undefined) {
      paramCount++;
      updates.push(`priority = $${paramCount}`);
      values.push(priority);
    }

    if (dueDate !== undefined) {
      paramCount++;
      updates.push(`due_date = $${paramCount}`);
      values.push(dueDate);
    }

    if (assigneeId !== undefined) {
      paramCount++;
      updates.push(`assignee_id = $${paramCount}`);
      values.push(assigneeId);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    values.push(taskId);

    const result = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramCount + 1} RETURNING *`,
      values
    );

    const task = result.rows[0];

    res.json({
      message: 'Task updated successfully',
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        updatedAt: task.updated_at,
      },
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);
    const userId = req.user!.id;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND creator_id = $2 RETURNING id',
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
