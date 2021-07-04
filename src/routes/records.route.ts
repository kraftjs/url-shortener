import { Router } from 'express';

import { recordController } from '../controllers';

const router = Router();

router.get('/:hash', recordController.getRecord);

export default router;