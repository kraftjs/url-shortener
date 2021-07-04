import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // todo: console.error(err)

    if (err instanceof ApiError) {
        return res.status(err.code).json(err.message);
    }

    return res.status(500).json(ApiError.internal('something went wrong'));
};

export default errorHandler;