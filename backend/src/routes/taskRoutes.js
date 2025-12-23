import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete
} from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all task routes with authentication
router.use(authMiddleware);

// Task routes
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTaskComplete);

export default router;
