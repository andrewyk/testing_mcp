import express from 'express';
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  getStats,
  validateTodo
} from '../controllers/todoController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getTodos);
router.get('/stats', auth, getStats);
router.get('/:id', auth, getTodo);
router.post('/', auth, validateTodo, createTodo);
router.put('/:id', auth, validateTodo, updateTodo);
router.delete('/:id', auth, deleteTodo);

export default router;
