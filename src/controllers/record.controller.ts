import { NextFunction, Request, Response } from 'express';

import { ApiError, ErrorMessage } from '../errors';
import { recordService } from '../services';

class RecordController {
    viewHomePage(req: Request, res: Response) {
        res.render('home');
    }

    async viewAllRecords(req: Request, res: Response, next: NextFunction) {
        try {
            const records = await recordService.readAllRecords();
            const context = { records };
            res.render('records', context);
        } catch (err) {
            next(err);
        }
    }

    async viewRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const { hash } = req.params;
            const record = await recordService.readRecord(hash);
            if (!record) {
                return next(ApiError.resourceNotFound(ErrorMessage.ResourceNotFound));
            }
            const context = { record };
            res.render('record', context);
        } catch (err) {
            next(err);
        }
    }

    async postRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const { url } = req.body;
            const record = await recordService.createRecord(url);
            res.redirect(`records/${record.hash}`);
        } catch (err) {
            if (err instanceof Error && err.message === ErrorMessage.BadRequest) {
                return next(ApiError.badRequest(ErrorMessage.BadRequest));
            }
            next(err);
        }
    }

    async redirectRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const { hash } = req.params;
            const record = await recordService.readRecord(hash);
            if (!record) {
                return next(ApiError.resourceNotFound(ErrorMessage.ResourceNotFound));
            }
            res.redirect(record.url);
            await recordService.updateAfterRedirect(hash);
        } catch (err) {
            next(err);
        }
    }
}

export default new RecordController();
