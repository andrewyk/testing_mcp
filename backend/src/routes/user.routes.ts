import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', (req, res) => {
  res.json({ status: 'success', users: [] });
});

export default router;
