import { mocked } from 'ts-jest/utils';

import { recordModel } from '../models';
import recordService from './record.service';
import { testRecord } from '../../test/testUtils';

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
