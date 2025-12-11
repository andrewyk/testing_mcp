import { Response } from 'express';
import Joi from 'joi';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

const tagSchema = Joi.object({
  name: Joi.string().max(100).required(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#6B7280'),
});

export const getTags = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT t.*, 
        (SELECT COUNT(*) FROM task_tags WHERE tag_id = t.id) as usage_count
      FROM tags t
      WHERE t.user_id = $1
      ORDER BY t.name ASC`,
      [req.user!.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

export const createTag = async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = tagSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, color } = value;

    const result = await pool.query(
      `INSERT INTO tags (name, color, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, color, req.user!.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Tag already exists' });
    }
    console.error('Create tag error:', error);
    res.status(500).json({ error: 'Failed to create tag' });
  }
};

export const updateTag = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const tagCheck = await pool.query(
      'SELECT id FROM tags WHERE id = $1 AND user_id = $2',
      [id, req.user!.id]
    );

    if (tagCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const result = await pool.query(
      `UPDATE tags SET name = COALESCE($1, name), color = COALESCE($2, color)
       WHERE id = $3 RETURNING *`,
      [name, color, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ error: 'Failed to update tag' });
  }
};

export const deleteTag = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tags WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
};
