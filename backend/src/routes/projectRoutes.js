import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  archiveProject
} from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all project routes with authentication
router.use(authMiddleware);

// Project routes
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.patch('/:id/archive', archiveProject);

export default router;
