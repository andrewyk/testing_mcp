import { Router } from 'express';
import {
  createTag,
  getTags,
  updateTag,
  deleteTag,
  createTagValidation
} from '../controllers/tag.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createTagValidation, createTag);
router.get('/', getTags);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;
