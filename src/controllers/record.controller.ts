import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors';
import { recordService } from '../services';

class RecordController {
    async readRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const { hash } = req.params;
            const record = await recordService.getRecord(hash);
            if (!record) {
                return next(ApiError.resourceNotFound(`record with hash ${hash} not found`));
            }
            res.json(record);
        } catch (err) {
            next(err);
        }
    }
}

export default new RecordController();
