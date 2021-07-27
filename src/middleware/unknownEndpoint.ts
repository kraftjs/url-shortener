import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors';

const unknownEndpoint = (req: Request, res: Response, next: NextFunction) => {
    next(ApiError.resourceNotFound('unknown endpoint'));
};

export default unknownEndpoint;