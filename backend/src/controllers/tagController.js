import { body, validationResult } from 'express-validator';
import db from '../config/database.js';

export const validateTag = [
  body('name').trim().notEmpty().isLength({ max: 50 }),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/)
];

export const getTags = async (req, res) => {
  try {
    const tags = db.prepare(
      'SELECT * FROM tags WHERE user_id = ? ORDER BY name'
    ).all(req.userId);

    // Get usage count for each tag
    const tagsWithCounts = tags.map(tag => {
      const usageCount = db.prepare(
        'SELECT COUNT(*) as count FROM todo_tags WHERE tag_id = ?'
      ).get(tag.id).count;

      return { ...tag, usageCount };
    });

    res.json(tagsWithCounts);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTag = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, color = '#6B7280' } = req.body;

    // Check if tag already exists for this user
    const existing = db.prepare(
      'SELECT id FROM tags WHERE user_id = ? AND name = ?'
    ).get(req.userId, name);

    if (existing) {
      return res.status(400).json({ error: 'Tag already exists' });
    }

    const result = db.prepare(`
      INSERT INTO tags (user_id, name, color)
      VALUES (?, ?, ?)
    `).run(req.userId, name, color);

    const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ ...tag, usageCount: 0 });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTag = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, color } = req.body;

    const tag = db.prepare(
      'SELECT * FROM tags WHERE id = ? AND user_id = ?'
    ).get(id, req.userId);

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (color !== undefined) {
      updates.push('color = ?');
      params.push(color);
    }

    params.push(id, req.userId);

    if (updates.length > 0) {
      db.prepare(`
        UPDATE tags 
        SET ${updates.join(', ')}
        WHERE id = ? AND user_id = ?
      `).run(...params);
    }

    const updatedTag = db.prepare('SELECT * FROM tags WHERE id = ?').get(id);
    const usageCount = db.prepare(
      'SELECT COUNT(*) as count FROM todo_tags WHERE tag_id = ?'
    ).get(id).count;

    res.json({ ...updatedTag, usageCount });
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = db.prepare(
      'SELECT * FROM tags WHERE id = ? AND user_id = ?'
    ).get(id, req.userId);

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    db.prepare('DELETE FROM tags WHERE id = ? AND user_id = ?').run(id, req.userId);

    res.json({ message: 'Tag deleted' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
