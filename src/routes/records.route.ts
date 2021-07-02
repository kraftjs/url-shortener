import { Router } from "express";

import { recordController } from '../controllers'

const router = Router();

router.post('/', recordController.createRecord);
router.get('/', recordController.readRecords)
router.get('/:hash', recordController.readRecord)
router.patch('/:hash', recordController.updateRecord)
router.delete('/:hash', recordController.deleteRecord)

export default router;