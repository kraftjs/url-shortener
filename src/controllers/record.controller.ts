import { NextFunction, Request, Response } from 'express';
import { ApiError, ErrorMessages } from '../errors';
import { recordService } from '../services';

class RecordController {
    async getRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const { hash } = req.params;
            const record = await recordService.readRecord(hash);
            if (!record) {
                return next(ApiError.resourceNotFound(ErrorMessages.ResourceNotFound));
            }
            res.json(record);
        } catch (err) {
            next(err);
        }
    }

    async postRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const { url } = req.body;
            const record = await recordService.createRecord(url);
            res.json(record);
        } catch (err) {
            if (err instanceof Error && err.message === ErrorMessages.Conflict) {
                return next(ApiError.conflict(ErrorMessages.Conflict));
            } else if (err instanceof Error && err.message === ErrorMessages.BadRequest) {
                return next(ApiError.badRequest(ErrorMessages.BadRequest));
            }
            next(err);
        }
    }
}

export default new RecordController();
