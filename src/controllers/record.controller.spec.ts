import type { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';

import { recordService } from '../services';
import recordController from './record.controller';
import { testRecord } from '../../test/testUtils';
import { ApiError, ErrorMessages } from '../errors';

jest.mock('../services');

afterEach(() => jest.resetAllMocks());

describe('Method recordController.getRecord', () => {
    it('should respond with correct record when passed a valid hash', async () => {
        mocked(recordService.readRecord).mockResolvedValueOnce(Promise.resolve(testRecord));
        const mReq = { params: { hash: testRecord.hash } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.getRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledWith(testRecord);
        expect(mNext).toBeCalledTimes(0);
    });

    it('should call next with a resourceNotFound error if passed an invalid hash', async () => {
        mocked(recordService.readRecord).mockResolvedValueOnce(Promise.resolve(undefined));
        const mReq = { params: { hash: 'invalidHash' } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.getRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledTimes(0);
        expect(mNext).toBeCalledWith(ApiError.resourceNotFound(ErrorMessages.ResourceNotFound));
    });

    it('should call next with the provided error if the promise returned by recordService is rejected', async () => {
        mocked(recordService.readRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessages.Internal)));
        const mReq = { params: { hash: 'invalidHash' } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.getRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledTimes(0);
        expect(mNext).not.toBeCalledWith(ApiError.resourceNotFound(ErrorMessages.ResourceNotFound));
        expect(mNext).toBeCalledWith(Error(ErrorMessages.Internal));
    });
});

describe('Method recordController.postRecord', () => {
    it('should respond with created record when passed a valid url', async () => {
        mocked(recordService.createRecord).mockResolvedValueOnce(Promise.resolve(testRecord));
        const mReq = { body: { url: testRecord.url } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.postRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledWith(testRecord);
        expect(mNext).toBeCalledTimes(0);
    });

    it('should call next with a conflict error if passed an already existing url', async () => {
        mocked(recordService.createRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessages.Conflict)));
        const mReq = { body: { url: testRecord.url } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.postRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledTimes(0);
        expect(mNext).toBeCalledWith(ApiError.resourceNotFound(ErrorMessages.Conflict));
    });

    it('should call next with a bad request error if passed an invalid url', async () => {
        mocked(recordService.createRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessages.BadRequest)));
        const mReq = { body: { url: 'badurl' } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.postRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledTimes(0);
        expect(mNext).toBeCalledWith(ApiError.resourceNotFound(ErrorMessages.BadRequest));
    });

    it('should call next with the provided error if the promise returned by recordService is rejected', async () => {
        mocked(recordService.createRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessages.Internal)));
        const mReq = { body: { url: testRecord.url } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.postRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledTimes(0);
        expect(mNext).not.toBeCalledWith(ApiError.resourceNotFound(ErrorMessages.Conflict));
        expect(mNext).not.toBeCalledWith(ApiError.resourceNotFound(ErrorMessages.BadRequest));
        expect(mNext).toBeCalledWith(Error(ErrorMessages.Internal));
    });
});
