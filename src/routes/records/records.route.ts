import { Router } from 'express';

import { recordController } from '../../controllers';

const router = Router();

router.get('/:hash', recordController.viewRecord);
router.get('/', recordController.viewAllRecords);
router.post('/', recordController.postRecord);

export default router;