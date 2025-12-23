import { Router } from 'express';
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  bulkDeleteTodos,
  bulkUpdateTodos,
  createTodoValidation
} from '../controllers/todo.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createTodoValidation, createTodo);
router.get('/', getTodos);
router.get('/:id', getTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.post('/bulk-delete', bulkDeleteTodos);
router.post('/bulk-update', bulkUpdateTodos);

export default router;
