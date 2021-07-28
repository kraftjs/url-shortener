import type { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';

import { recordService } from '../services';
import recordController from './record.controller';
import { testRecord } from '../../test/testUtils';
import { ApiError, ErrorMessage } from '../errors';

jest.mock('../services');

afterEach(() => jest.resetAllMocks());

describe('Method recordController.viewHomePage', () => {
    it('should call render with the "home" view', () => {
        const mReq = {} as unknown as Request;
        const mRes = { render: jest.fn() } as unknown as Response;

        recordController.viewHomePage(mReq, mRes);

        expect(mRes.render).toBeCalledWith('home');
    });
});

describe('Method recordController.viewAllRecords', () => {
    it('should call render with the "records" view and a context object with an array of records', async () => {
        mocked(recordService.readAllRecords).mockResolvedValueOnce(Promise.resolve([testRecord]));

        const mReq = {} as unknown as Request;
        const mRes = { render: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        const contextObj = { records: [testRecord] };

        await recordController.viewAllRecords(mReq, mRes, mNext);

        expect(mNext).toBeCalledTimes(0);
        expect(mRes.render).toBeCalledWith('records', contextObj);
    });

    it('should call next with the provided error if the promise returned by recordService is rejected', async () => {
        mocked(recordService.readAllRecords).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Internal)));

        const mReq = {} as unknown as Request;
        const mRes = { render: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.viewAllRecords(mReq, mRes, mNext);

        expect(mRes.render).toBeCalledTimes(0);
        expect(mNext).toBeCalledWith(Error(ErrorMessage.Internal));
    });
});

describe('Method recordController.viewRecord', () => {
    it('should call render with the "record" view and a context object with a record', async () => {
        mocked(recordService.readRecord).mockResolvedValueOnce(Promise.resolve(testRecord));

        const mReq = { params: { hash: testRecord.hash } } as unknown as Request;
        const mRes = { render: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        const contextObj = { record: testRecord };

        await recordController.viewRecord(mReq, mRes, mNext);

        expect(mRes.render).toBeCalledWith('record', contextObj);
        expect(mNext).toBeCalledTimes(0);
    });

    it('should call next with a resourceNotFound error if passed an invalid hash', async () => {
        mocked(recordService.readRecord).mockResolvedValueOnce(Promise.resolve(undefined));

        const mReq = { params: { hash: 'invalidHash' } } as unknown as Request;
        const mRes = { render: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.viewRecord(mReq, mRes, mNext);

        expect(mRes.render).toBeCalledTimes(0);
        expect(mNext).toBeCalledWith(ApiError.resourceNotFound(ErrorMessage.ResourceNotFound));
    });

    it('should call next with the provided error if the promise returned by recordService is rejected', async () => {
        mocked(recordService.readRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Internal)));

        const mReq = { params: { hash: 'invalidHash' } } as unknown as Request;
        const mRes = { render: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.viewRecord(mReq, mRes, mNext);

        expect(mRes.render).toBeCalledTimes(0);
        expect(mNext).not.toBeCalledWith(ApiError.resourceNotFound(ErrorMessage.ResourceNotFound));
        expect(mNext).toBeCalledWith(Error(ErrorMessage.Internal));
    });
});

describe('Method recordController.postRecord', () => {
    it('should respond with created record when passed a valid url', async () => {
        mocked(recordService.createRecord).mockResolvedValueOnce(Promise.resolve(testRecord));

        const mReq = { body: { url: testRecord.url } } as unknown as Request;
        const mRes = { redirect: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.postRecord(mReq, mRes, mNext);

        expect(mRes.redirect).toBeCalledWith(303, `records/${testRecord.hash}`);
        expect(mNext).toBeCalledTimes(0);
    });

    it('should call next with a bad request error if passed an invalid url', async () => {
        mocked(recordService.createRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.BadRequest)));

        const mReq = { body: { url: 'badurl' } } as unknown as Request;
        const mRes = { redirect: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.postRecord(mReq, mRes, mNext);

        expect(mRes.redirect).toBeCalledTimes(0);
        expect(mNext).toBeCalledWith(ApiError.resourceNotFound(ErrorMessage.BadRequest));
    });

    it('should call next with the provided error if the promise returned by recordService is rejected', async () => {
        mocked(recordService.createRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Internal)));

        const mReq = { body: { url: testRecord.url } } as unknown as Request;
        const mRes = { redirect: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.postRecord(mReq, mRes, mNext);

        expect(mRes.redirect).toBeCalledTimes(0);
        expect(mNext).not.toBeCalledWith(ApiError.resourceNotFound(ErrorMessage.BadRequest));
        expect(mNext).toBeCalledWith(Error(ErrorMessage.Internal));
    });
});

describe('Method recordController.redirectRecord', () => {
    it('should respond with a url when passed a valid hash', async () => {
        mocked(recordService.readRecord).mockResolvedValueOnce(Promise.resolve(testRecord));

        const mReq = { params: { hash: testRecord.hash } } as unknown as Request;
        const mRes = { redirect: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.redirectRecord(mReq, mRes, mNext);

        expect(mRes.redirect).toBeCalledWith(301, testRecord.url);
        expect(mNext).toBeCalledTimes(0);
    });

    it('should call next with a resourceNotFound error if passed an invalid hash', async () => {
        mocked(recordService.readRecord).mockResolvedValueOnce(Promise.resolve(undefined));

        const mReq = { params: { hash: 'invalidHash' } } as unknown as Request;
        const mRes = { redirect: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.redirectRecord(mReq, mRes, mNext);

        expect(mRes.redirect).toBeCalledTimes(0);
        expect(mNext).toBeCalledWith(ApiError.resourceNotFound(ErrorMessage.ResourceNotFound));
    });

    it('should call next with the provided error if the promise returned by recordService is rejected', async () => {
        mocked(recordService.readRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Internal)));

        const mReq = { params: { hash: 'invalidHash' } } as unknown as Request;
        const mRes = { redirect: jest.fn() } as unknown as Response;
        const mNext = jest.fn();

        await recordController.redirectRecord(mReq, mRes, mNext);

        expect(mRes.redirect).toBeCalledTimes(0);
        expect(mNext).not.toBeCalledWith(ApiError.resourceNotFound(ErrorMessage.ResourceNotFound));
        expect(mNext).toBeCalledWith(Error(ErrorMessage.Internal));
    });
});

