import recordModel from './record.model';
import db, { Table } from '../database/connection';
import { testRecord } from '../../test/testUtils';
import {ErrorMessages} from "../errors";

describe('retrieving a record with recordModel.findByHash', () => {
    test('returns a promise that resolves to a record when passed a valid hash', async () => {
        const response = await recordModel.findByHash(testRecord.hash);
        expect(response).toEqual(testRecord);
    });

    test('returns a promise that resolves to undefined when passed an invalid hash', async () => {
        await db(Table.Records).del().where({ hash: testRecord.hash });
        const response = await recordModel.findByHash(testRecord.hash);
        expect(response).toEqual(undefined);
    });
});

describe('inserting a record with recordModel.insertRecord', () => {
    test('inserts a record and returns a promise that resolves to a record when passed a new hash and url', async () => {
        await db(Table.Records).truncate().where({ hash: testRecord.hash });

        const savedRecord = await recordModel.insertRecord(testRecord.hash, testRecord.url);
        expect(savedRecord).toEqual({
            ...testRecord,
            created_at: savedRecord.created_at,
            updated_at: savedRecord.updated_at,
        });

        const response = await db.select().from(Table.Records).where({ hash: testRecord.hash }).first();
        expect(response).toEqual(savedRecord);
    });

    test('rejects and returns an error when not passed a unique hash', async () => {
        await expect(recordModel.insertRecord(testRecord.hash, testRecord.url)).rejects.toThrow(
            ErrorMessages.Conflict,
        );
    });
});
