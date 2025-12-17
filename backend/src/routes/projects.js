import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  validateProject
} from '../controllers/projectController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getProjects);
router.get('/:id', auth, getProject);
router.post('/', auth, validateProject, createProject);
router.put('/:id', auth, validateProject, updateProject);
router.delete('/:id', auth, deleteProject);

export default router;
