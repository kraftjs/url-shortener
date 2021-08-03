import { Router } from 'express';

import redirectRouter from './home.route';
import recordsRouter from './records/records.route';

const router = Router();
router.use('/records', recordsRouter);
router.use('/', redirectRouter);

export default router;
