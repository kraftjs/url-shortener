import { Router } from 'express';

import { recordController } from '../../controllers';

const router = Router();

router.get('/:hash', recordController.getRecord);
router.get('/', recordController.getAllRecords);
router.post('/', recordController.postRecord);

export default router;