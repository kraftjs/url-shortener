import type { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';

import { recordService } from '../services';
import recordController from './record.controller';
import { testRecord } from '../../test/testUtils';
import { ApiError } from '../errors';

jest.mock('../services');

afterEach(() => jest.resetAllMocks());

describe('Method recordController.getRecord', () => {
    it('should respond with correct record when passed a valid hash', async () => {
        mocked(recordService.readRecord).mockResolvedValueOnce(testRecord);
        const mReq = { params: { hash: testRecord.hash } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.getRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledWith(testRecord);
        expect(mNext).toBeCalledTimes(0);
    });

    it('should call next with a resourceNotFound error if passed an invalid hash', async () => {
        mocked(recordService.readRecord).mockResolvedValueOnce(undefined);
        const mReq = { params: { hash: 'invalidHash' } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.getRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledTimes(0);
        expect(mNext).toBeCalledWith(ApiError.resourceNotFound('record with hash invalidHash not found'));
    });
});
