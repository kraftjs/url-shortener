import { Router } from 'express';

import { recordController } from '../controllers';

const router = Router();

router.get('/', recordController.getAllRecords);
router.post('/', recordController.postRecord);

router.get('/:hash', recordController.getRecord);

export default router;