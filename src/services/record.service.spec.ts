import { mocked } from 'ts-jest/utils';

import { recordModel } from '../models';
import recordService from './record.service';
import { testRecord } from '../../test/testUtils';
import { ErrorMessages } from '../errors';
import db, { Table } from '../database/connection';

jest.mock('../models');

afterEach(() => jest.resetAllMocks());

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
        mocked(recordModel.findByHash).mockResolvedValueOnce(Promise.reject(new Error('something went wrong')));
        expect(recordService.readRecord(testRecord.hash)).rejects.toThrow('something went wrong');
    });
});

describe('Method recordService.createRecord', () => {
    it('should return a promise that resolves to a record when passed a valid url', async () => {
        await db(Table.Records).truncate().where({ hash: testRecord.hash });

        mocked(recordModel.insertRecord).mockResolvedValueOnce(Promise.resolve(testRecord));
        await expect(recordService.createRecord(testRecord.url)).resolves.toEqual(testRecord);
    });

    it('should return a promise that rejects to an error when passed an invalid url', async () => {
        await expect(recordService.createRecord('invalidUrl')).rejects.toThrow(ErrorMessages.BadRequest);
    });

    it('should return a promise that rejects to an error when record already exists', async () => {
        mocked(recordModel.insertRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessages.Conflict)));
        await expect(recordService.createRecord(testRecord.url)).rejects.toThrow(ErrorMessages.Conflict);
    });

    it('should return a promise that rejects to an error when encountering a problem', async () => {
        mocked(recordModel.insertRecord).mockResolvedValueOnce(Promise.reject(new Error(ErrorMessages.Internal)));
        await expect(recordService.createRecord(testRecord.url)).rejects.toThrow(ErrorMessages.Internal);
    });
});
