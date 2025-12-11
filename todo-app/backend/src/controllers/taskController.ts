import { Response } from 'express';
import Joi from 'joi';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

const taskSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().max(10000).allow('', null),
  priority: Joi.string().valid('none', 'low', 'medium', 'high').default('none'),
  status: Joi.string()
    .valid('not_started', 'in_progress', 'waiting', 'blocked', 'completed')
    .default('not_started'),
  due_date: Joi.date().allow(null),
  estimated_time: Joi.number().integer().min(0).allow(null),
  project_id: Joi.number().integer().allow(null),
  assigned_to: Joi.number().integer().allow(null),
  parent_task_id: Joi.number().integer().allow(null),
  tags: Joi.array().items(Joi.number().integer()),
});

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority, project_id, due_date, search } = req.query;
    
    let query = `
      SELECT t.*, 
        json_agg(DISTINCT jsonb_build_object('id', tag.id, 'name', tag.name, 'color', tag.color)) 
        FILTER (WHERE tag.id IS NOT NULL) as tags,
        p.name as project_name
      FROM tasks t
      LEFT JOIN task_tags tt ON t.id = tt.task_id
      LEFT JOIN tags tag ON tt.tag_id = tag.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.user_id = $1
    `;
    
    const params: any[] = [req.user!.id];
    let paramIndex = 2;

    if (status) {
      query += ` AND t.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (priority) {
      query += ` AND t.priority = $${paramIndex}`;
      params.push(priority);
      paramIndex++;
    }

    if (project_id) {
      query += ` AND t.project_id = $${paramIndex}`;
      params.push(project_id);
      paramIndex++;
    }

    if (due_date) {
      query += ` AND DATE(t.due_date) = $${paramIndex}`;
      params.push(due_date);
      paramIndex++;
    }

    if (search) {
      query += ` AND (t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ' GROUP BY t.id, p.name ORDER BY t.position, t.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT t.*, 
        json_agg(DISTINCT jsonb_build_object('id', tag.id, 'name', tag.name, 'color', tag.color)) 
        FILTER (WHERE tag.id IS NOT NULL) as tags,
        p.name as project_name,
        u.username as assigned_to_username
      FROM tasks t
      LEFT JOIN task_tags tt ON t.id = tt.task_id
      LEFT JOIN tags tag ON tt.tag_id = tag.id
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = $1 AND t.user_id = $2
      GROUP BY t.id, p.name, u.username`,
      [id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      title,
      description,
      priority,
      status,
      due_date,
      estimated_time,
      project_id,
      assigned_to,
      parent_task_id,
      tags,
    } = value;

    const result = await pool.query(
      `INSERT INTO tasks (
        title, description, priority, status, due_date, estimated_time,
        project_id, user_id, assigned_to, parent_task_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        title,
        description,
        priority,
        status,
        due_date,
        estimated_time,
        project_id,
        req.user!.id,
        assigned_to,
        parent_task_id,
      ]
    );

    const task = result.rows[0];

    if (tags && tags.length > 0) {
      const tagValues = tags.map((tagId: number) => `(${task.id}, ${tagId})`).join(',');
      await pool.query(`INSERT INTO task_tags (task_id, tag_id) VALUES ${tagValues}`);
    }

    await pool.query(
      `INSERT INTO activity_log (action, entity_type, entity_id, user_id, task_id)
       VALUES ($1, $2, $3, $4, $5)`,
      ['created', 'task', task.id, req.user!.id, task.id]
    );

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const taskCheck = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user!.id]
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const allowedFields = [
      'title',
      'description',
      'priority',
      'status',
      'due_date',
      'estimated_time',
      'actual_time',
      'project_id',
      'assigned_to',
      'completed_at',
    ];

    const updateFields = Object.keys(updates).filter((key) =>
      allowedFields.includes(key)
    );

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const setClause = updateFields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');
    const values = updateFields.map((field) => updates[field]);

    if (updates.status === 'completed' && !updates.completed_at) {
      updateFields.push('completed_at');
      values.push(new Date());
    }

    const result = await pool.query(
      `UPDATE tasks SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );

    if (updates.tags !== undefined) {
      await pool.query('DELETE FROM task_tags WHERE task_id = $1', [id]);
      if (updates.tags.length > 0) {
        const tagValues = updates.tags
          .map((tagId: number) => `(${id}, ${tagId})`)
          .join(',');
        await pool.query(
          `INSERT INTO task_tags (task_id, tag_id) VALUES ${tagValues}`
        );
      }
    }

    await pool.query(
      `INSERT INTO activity_log (action, entity_type, entity_id, user_id, task_id, changes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['updated', 'task', id, req.user!.id, id, JSON.stringify(updates)]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await pool.query(
      `INSERT INTO activity_log (action, entity_type, entity_id, user_id)
       VALUES ($1, $2, $3, $4)`,
      ['deleted', 'task', id, req.user!.id]
    );

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
