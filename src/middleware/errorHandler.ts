import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        if (err.statusCode === 404) {
            return res.status(err.statusCode).render('404');
        } else if (err.statusCode === 400) {
            return res.status(err.statusCode).render('400');
        }
        return res.status(err.statusCode).json(err.message);
    }

    return res.status(500).render('500');
};

export default errorHandler;
