import { body, validationResult } from 'express-validator';
import db from '../config/database.js';

export const validateProject = [
  body('name').trim().notEmpty().isLength({ max: 100 }),
  body('description').optional().isLength({ max: 500 }),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/)
];

export const getProjects = async (req, res) => {
  try {
    const projects = db.prepare(
      'SELECT * FROM projects WHERE user_id = ? AND archived = 0 ORDER BY created_at DESC'
    ).all(req.userId);

    // Get todo count for each project
    const projectsWithCounts = projects.map(project => {
      const todoCount = db.prepare(
        'SELECT COUNT(*) as count FROM todos WHERE project_id = ? AND deleted = 0'
      ).get(project.id).count;

      return { ...project, todoCount, archived: Boolean(project.archived) };
    });

    res.json(projectsWithCounts);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = db.prepare(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?'
    ).get(id, req.userId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const todoCount = db.prepare(
      'SELECT COUNT(*) as count FROM todos WHERE project_id = ? AND deleted = 0'
    ).get(project.id).count;

    res.json({ ...project, todoCount, archived: Boolean(project.archived) });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, color = '#3B82F6' } = req.body;

    const result = db.prepare(`
      INSERT INTO projects (user_id, name, description, color)
      VALUES (?, ?, ?, ?)
    `).run(req.userId, name, description || null, color);

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ ...project, todoCount: 0, archived: Boolean(project.archived) });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, color, archived } = req.body;

    const project = db.prepare(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?'
    ).get(id, req.userId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (color !== undefined) {
      updates.push('color = ?');
      params.push(color);
    }
    if (archived !== undefined) {
      updates.push('archived = ?');
      params.push(archived ? 1 : 0);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id, req.userId);

    if (updates.length > 0) {
      db.prepare(`
        UPDATE projects 
        SET ${updates.join(', ')}
        WHERE id = ? AND user_id = ?
      `).run(...params);
    }

    const updatedProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    const todoCount = db.prepare(
      'SELECT COUNT(*) as count FROM todos WHERE project_id = ? AND deleted = 0'
    ).get(id).count;

    res.json({ ...updatedProject, todoCount, archived: Boolean(updatedProject.archived) });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = db.prepare(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?'
    ).get(id, req.userId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Set todos' project_id to NULL before deleting project
    db.prepare('UPDATE todos SET project_id = NULL WHERE project_id = ?').run(id);
    
    db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').run(id, req.userId);

    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
