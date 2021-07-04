import recordService from './record.service';
import db, { Table } from '../database/connection';
import { testRecord } from '../../test/testUtils';

describe('Method recordService.readRecord', () => {
    it('should return a a record when passed a valid hash', async () => {
        const response = await recordService.readRecord(testRecord.hash);
        expect(response).toEqual(testRecord);
    });

    it('should return undefined when passing an invalid hash', async () => {
        await db(Table.RECORDS).del().where({ hash: testRecord.hash });
        const response = await recordService.readRecord(testRecord.hash);
        expect(response).toEqual(undefined);
    });
});
