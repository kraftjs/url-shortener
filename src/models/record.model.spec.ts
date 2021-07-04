import recordModel from './record.model';
import db, { Table } from '../database/connection';
import { testRecord } from '../../test/testUtils';

describe('Method recordModel.findByHash', () => {
    it('should return a promise that resolves to a record when passed a valid hash', async () => {
        const response = await recordModel.findByHash(testRecord.hash);
        expect(response).toEqual(testRecord);
    });

    it('should return a promise that resolves to undefined when passed a invalid hash', async () => {
        await db(Table.RECORDS).del().where({ hash: testRecord.hash });
        const response = await recordModel.findByHash(testRecord.hash);
        expect(response).toEqual(undefined);
    });
});
