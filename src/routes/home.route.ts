import { Router } from 'express';

import { recordController } from '../controllers';

const router = Router();

router.get('/', recordController.viewHomePage);
router.get('/:hash', recordController.redirectRecord);

export default router;
