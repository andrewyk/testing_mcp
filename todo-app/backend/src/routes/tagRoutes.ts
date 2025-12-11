import { Router } from 'express';
import { getTags, createTag, updateTag, deleteTag } from '../controllers/tagController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getTags);
router.post('/', createTag);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;
