import { body, validationResult, query } from 'express-validator';
import db from '../config/database.js';

export const validateTodo = [
  body('title').trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().isLength({ max: 2000 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('due_date').optional().isISO8601(),
  body('project_id').optional().isInt(),
  body('completed').optional().isBoolean()
];

export const getTodos = async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      project_id, 
      search, 
      sort = 'created_at', 
      order = 'desc' 
    } = req.query;

    let query = 'SELECT * FROM todos WHERE user_id = ? AND deleted = 0';
    const params = [req.userId];

    // Filters
    if (status === 'active') {
      query += ' AND completed = 0';
    } else if (status === 'completed') {
      query += ' AND completed = 1';
    }

    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (project_id) {
      query += ' AND project_id = ?';
      params.push(project_id);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Sorting
    const validSorts = ['created_at', 'updated_at', 'due_date', 'priority', 'title'];
    const validOrders = ['asc', 'desc'];
    
    if (validSorts.includes(sort)) {
      query += ` ORDER BY ${sort} ${validOrders.includes(order) ? order : 'desc'}`;
    }

    const todos = db.prepare(query).all(...params);

    // Get tags for each todo
    const todosWithTags = todos.map(todo => {
      const tags = db.prepare(`
        SELECT t.id, t.name, t.color 
        FROM tags t
        JOIN todo_tags tt ON t.id = tt.tag_id
        WHERE tt.todo_id = ?
      `).all(todo.id);

      const subtasks = db.prepare(
        'SELECT * FROM subtasks WHERE todo_id = ? ORDER BY position'
      ).all(todo.id);

      return { 
        ...todo, 
        tags,
        subtasks,
        completed: Boolean(todo.completed),
        deleted: Boolean(todo.deleted)
      };
    });

    res.json(todosWithTags);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const todo = db.prepare(
      'SELECT * FROM todos WHERE id = ? AND user_id = ? AND deleted = 0'
    ).get(id, req.userId);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const tags = db.prepare(`
      SELECT t.id, t.name, t.color 
      FROM tags t
      JOIN todo_tags tt ON t.id = tt.tag_id
      WHERE tt.todo_id = ?
    `).all(todo.id);

    const subtasks = db.prepare(
      'SELECT * FROM subtasks WHERE todo_id = ? ORDER BY position'
    ).all(todo.id);

    res.json({ 
      ...todo, 
      tags,
      subtasks,
      completed: Boolean(todo.completed),
      deleted: Boolean(todo.deleted)
    });
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      title, 
      description, 
      priority = 'medium', 
      due_date, 
      project_id,
      tags = [],
      subtasks = []
    } = req.body;

    const result = db.prepare(`
      INSERT INTO todos (user_id, title, description, priority, due_date, project_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.userId, title, description, priority, due_date || null, project_id || null);

    const todoId = result.lastInsertRowid;

    // Add tags if provided
    if (tags.length > 0) {
      const insertTag = db.prepare('INSERT OR IGNORE INTO todo_tags (todo_id, tag_id) VALUES (?, ?)');
      for (const tagId of tags) {
        insertTag.run(todoId, tagId);
      }
    }

    // Add subtasks if provided
    if (subtasks.length > 0) {
      const insertSubtask = db.prepare('INSERT INTO subtasks (todo_id, title, position) VALUES (?, ?, ?)');
      subtasks.forEach((subtask, index) => {
        insertSubtask.run(todoId, subtask.title, index);
      });
    }

    // Fetch the created todo with tags and subtasks
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(todoId);
    const todoTags = db.prepare(`
      SELECT t.id, t.name, t.color 
      FROM tags t
      JOIN todo_tags tt ON t.id = tt.tag_id
      WHERE tt.todo_id = ?
    `).all(todoId);
    const todoSubtasks = db.prepare('SELECT * FROM subtasks WHERE todo_id = ? ORDER BY position').all(todoId);

    res.status(201).json({ 
      ...todo, 
      tags: todoTags,
      subtasks: todoSubtasks,
      completed: Boolean(todo.completed),
      deleted: Boolean(todo.deleted)
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { 
      title, 
      description, 
      priority, 
      due_date, 
      project_id, 
      completed,
      tags,
      subtasks
    } = req.body;

    // Check if todo exists and belongs to user
    const todo = db.prepare(
      'SELECT * FROM todos WHERE id = ? AND user_id = ? AND deleted = 0'
    ).get(id, req.userId);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      params.push(priority);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
    }
    if (project_id !== undefined) {
      updates.push('project_id = ?');
      params.push(project_id);
    }
    if (completed !== undefined) {
      updates.push('completed = ?');
      params.push(completed ? 1 : 0);
      if (completed && !todo.completed) {
        updates.push('completed_at = CURRENT_TIMESTAMP');
      } else if (!completed && todo.completed) {
        updates.push('completed_at = NULL');
      }
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id, req.userId);

    if (updates.length > 0) {
      db.prepare(`
        UPDATE todos 
        SET ${updates.join(', ')}
        WHERE id = ? AND user_id = ?
      `).run(...params);
    }

    // Update tags if provided
    if (tags !== undefined) {
      db.prepare('DELETE FROM todo_tags WHERE todo_id = ?').run(id);
      if (tags.length > 0) {
        const insertTag = db.prepare('INSERT OR IGNORE INTO todo_tags (todo_id, tag_id) VALUES (?, ?)');
        for (const tagId of tags) {
          insertTag.run(id, tagId);
        }
      }
    }

    // Update subtasks if provided
    if (subtasks !== undefined) {
      db.prepare('DELETE FROM subtasks WHERE todo_id = ?').run(id);
      if (subtasks.length > 0) {
        const insertSubtask = db.prepare('INSERT INTO subtasks (todo_id, title, completed, position) VALUES (?, ?, ?, ?)');
        subtasks.forEach((subtask, index) => {
          insertSubtask.run(id, subtask.title, subtask.completed ? 1 : 0, index);
        });
      }
    }

    // Fetch updated todo
    const updatedTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    const todoTags = db.prepare(`
      SELECT t.id, t.name, t.color 
      FROM tags t
      JOIN todo_tags tt ON t.id = tt.tag_id
      WHERE tt.todo_id = ?
    `).all(id);
    const todoSubtasks = db.prepare('SELECT * FROM subtasks WHERE todo_id = ? ORDER BY position').all(id);

    res.json({ 
      ...updatedTodo, 
      tags: todoTags,
      subtasks: todoSubtasks,
      completed: Boolean(updatedTodo.completed),
      deleted: Boolean(updatedTodo.deleted)
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    const todo = db.prepare(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?'
    ).get(id, req.userId);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (permanent === 'true') {
      // Permanent delete
      db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?').run(id, req.userId);
      res.json({ message: 'Todo permanently deleted' });
    } else {
      // Soft delete
      db.prepare('UPDATE todos SET deleted = 1 WHERE id = ? AND user_id = ?').run(id, req.userId);
      res.json({ message: 'Todo moved to trash' });
    }
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = {
      total: db.prepare('SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND deleted = 0').get(req.userId).count,
      active: db.prepare('SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = 0 AND deleted = 0').get(req.userId).count,
      completed: db.prepare('SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = 1 AND deleted = 0').get(req.userId).count,
      overdue: db.prepare('SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = 0 AND deleted = 0 AND due_date < date("now")').get(req.userId).count,
      today: db.prepare('SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = 0 AND deleted = 0 AND date(due_date) = date("now")').get(req.userId).count,
      thisWeek: db.prepare('SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = 0 AND deleted = 0 AND date(due_date) BETWEEN date("now") AND date("now", "+7 days")').get(req.userId).count
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
