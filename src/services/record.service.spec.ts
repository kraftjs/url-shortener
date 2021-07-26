import { mocked } from 'ts-jest/utils';

import { recordModel } from '../models';
import recordService from './record.service';
import { testRecord } from '../../test/testUtils';
import { ErrorMessage } from '../errors';
import db, { Table } from '../database/connection';

jest.mock('../models');

afterEach(() => jest.resetAllMocks());

describe('Method recordService.readAllRecords', () => {
    it('should return a promise that resolves to a list of records', () => {
        mocked(recordModel.findAllRecords).mockResolvedValueOnce(Promise.resolve([testRecord]));
        expect(recordService.readAllRecords()).resolves.toEqual([testRecord]);
    });

    it('should return a promise that rejects to an error when encountering a problem', () => {
        mocked(recordModel.findAllRecords).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Internal)));
        expect(recordService.readAllRecords()).rejects.toThrow(ErrorMessage.Internal);
    });
});

describe('Method recordService.readRecord', () => {
    it('should return a promise that resolves to a record when passed a valid hash', () => {
        mocked(recordModel.findByHash).mockResolvedValueOnce(Promise.resolve(testRecord));
        expect(recordService.readRecord(testRecord.hash)).resolves.toEqual(testRecord);
    });

    it('should return a promise that resolves to undefined when passed an invalid hash', () => {
        mocked(recordModel.findByHash).mockResolvedValueOnce(Promise.resolve(undefined));
        expect(recordService.readRecord(testRecord.hash)).resolves.toEqual(undefined);
    });

    it('should return a promise that rejects to an error when encountering a problem', () => {
        mocked(recordModel.findByHash).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Internal)));
        expect(recordService.readRecord(testRecord.hash)).rejects.toThrow(ErrorMessage.Internal);
    });
});

describe('Method recordService.updateAfterRedirect', () => {
    it('should return a promise that resolves to a record', () => {
        mocked(recordModel.updateVisitsAndTime).mockResolvedValueOnce(Promise.resolve(testRecord));
        expect(recordService.updateAfterRedirect(testRecord.hash)).resolves.toEqual(testRecord);
    });

    it('should return a promise that resolves to undefined when passed an invalid hash', () => {
        mocked(recordModel.updateVisitsAndTime).mockResolvedValueOnce(Promise.resolve(undefined));
        expect(recordService.updateAfterRedirect(testRecord.hash)).resolves.toEqual(undefined);
    });

    it('should return a promise that rejects to an error when encountering a problem', () => {
        mocked(recordModel.updateVisitsAndTime).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Internal)));
        expect(recordService.updateAfterRedirect(testRecord.hash)).rejects.toThrow(ErrorMessage.Internal);
    });
});

describe('Method recordService.createRecord', () => {
    it('should return a promise that resolves to a record when passed a valid url', async () => {
        await db(Table.Records).truncate().where({ hash: testRecord.hash });

        mocked(recordModel.insertRecord).mockResolvedValueOnce(Promise.resolve(testRecord));
        await expect(recordService.createRecord(testRecord.url)).resolves.toEqual(testRecord);
    });

    it('should throw an error when passed an invalid url', () => {
        expect(() => {
            recordService.createRecord('invalidUrl');
        }).toThrow(ErrorMessage.BadRequest);
    });

    it('should return a promise that rejects to an error when record already exists', () => {
        mocked(recordModel.insertRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Conflict)));
        expect(recordService.createRecord(testRecord.url)).rejects.toThrow(ErrorMessage.Conflict);
    });

    it('should return a promise that rejects to an error when encountering a problem', () => {
        mocked(recordModel.insertRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessage.Internal)));
        expect(recordService.createRecord(testRecord.url)).rejects.toThrow(ErrorMessage.Internal);
    });
});
