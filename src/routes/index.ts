import { Router } from 'express';
import recordsRouter from './records.route';

const router = Router();
router.use('/records', recordsRouter);

export default router;