import express from 'express';
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  validateTag
} from '../controllers/tagController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getTags);
router.post('/', auth, validateTag, createTag);
router.put('/:id', auth, validateTag, updateTag);
router.delete('/:id', auth, deleteTag);

export default router;
