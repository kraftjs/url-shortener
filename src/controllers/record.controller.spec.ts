import type { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';

import { recordService } from '../services';
import recordController from './record.controller';
import { testRecord } from '../../test/testUtils';
import { ApiError, ErrorMessage } from '../errors';

jest.mock('../services');

afterEach(() => jest.resetAllMocks());

describe('Method recordController.getAllRecords', () => {
    it('should respond with an array of records', async () => {
        mocked(recordService.readAllRecords).mockResolvedValueOnce(Promise.resolve([testRecord]));

        const mReq = {} as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.getAllRecords(mReq, mRes, mNext);

        expect(mNext).toBeCalledTimes(0);
        expect(mRes.json).toBeCalledWith([testRecord]);
    });

    it('should call next with the provided error if the promise returned by recordService is rejected', async () => {
        mocked(recordService.readAllRecords).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Internal)));

        const mReq = {} as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.getAllRecords(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledTimes(0);
        expect(mNext).toBeCalledWith(Error(ErrorMessage.Internal));
    });
});

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
        expect(mNext).toBeCalledWith(ApiError.resourceNotFound(ErrorMessage.ResourceNotFound));
    });

    it('should call next with the provided error if the promise returned by recordService is rejected', async () => {
        mocked(recordService.readRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Internal)));

        const mReq = { params: { hash: 'invalidHash' } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.getRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledTimes(0);
        expect(mNext).not.toBeCalledWith(ApiError.resourceNotFound(ErrorMessage.ResourceNotFound));
        expect(mNext).toBeCalledWith(Error(ErrorMessage.Internal));
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
        mocked(recordService.createRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Conflict)));

        const mReq = { body: { url: testRecord.url } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.postRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledTimes(0);
        expect(mNext).toBeCalledWith(ApiError.resourceNotFound(ErrorMessage.Conflict));
    });

    it('should call next with a bad request error if passed an invalid url', async () => {
        mocked(recordService.createRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.BadRequest)));

        const mReq = { body: { url: 'badurl' } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.postRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledTimes(0);
        expect(mNext).toBeCalledWith(ApiError.resourceNotFound(ErrorMessage.BadRequest));
    });

    it('should call next with the provided error if the promise returned by recordService is rejected', async () => {
        mocked(recordService.createRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Internal)));

        const mReq = { body: { url: testRecord.url } } as unknown as Request;
        const mRes = { json: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.postRecord(mReq, mRes, mNext);

        expect(mRes.json).toBeCalledTimes(0);
        expect(mNext).not.toBeCalledWith(ApiError.resourceNotFound(ErrorMessage.Conflict));
        expect(mNext).not.toBeCalledWith(ApiError.resourceNotFound(ErrorMessage.BadRequest));
        expect(mNext).toBeCalledWith(Error(ErrorMessage.Internal));
    });
});
