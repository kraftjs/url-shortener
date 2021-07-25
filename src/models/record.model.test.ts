import recordModel from './record.model';
import db, { Table } from '../database/connection';
import { testRecord } from '../../test/testUtils';
import { ErrorMessage } from '../errors';

describe('retrieving records with recordModel.findAllRecords', () => {
    test('returns a promise that resolves to an array of records', async () => {
        const response = await recordModel.findAllRecords();
        expect(response).toEqual([testRecord]);
    });

    test('returns a promise that resolves to an empty array when there are no records', async () => {
        await db(Table.Records).del().where({ hash: testRecord.hash });
        const response = await recordModel.findAllRecords();
        expect(response).toEqual([]);
    });
});

describe('retrieving records with recordModel.findStaleRecords', () => {
    test('returns a promise that resolves to an array of records', async () => {
        // testRecord is older than the provided time (now) so we return it
        let staleRecords = await recordModel.findStaleRecords(new Date());
        expect(staleRecords).toEqual([testRecord]);

        // testRecord is newer than the provided time (10s ago) so we don't return it
        staleRecords = await recordModel.findStaleRecords(new Date(Date.now() - 10_000));
        expect(staleRecords).toEqual([]);
    });
});

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

describe('updating a record with recordModel.updateVisitsAndTime', () => {
    test('returns a promise that resolves to an updated record when passed a valid hash', async () => {
        const response = await recordModel.updateVisitsAndTime(testRecord.hash);
        expect(response).not.toEqual(undefined);
        expect(response?.visits).toBe(testRecord.visits + 1);
        expect(response?.updated_at).not.toEqual(testRecord.updated_at);
    });

    test('returns a promise that resolves to undefined when passed an invalid hash', async () => {
        await db(Table.Records).del().where({ hash: testRecord.hash });
        const response = await recordModel.updateVisitsAndTime(testRecord.hash);
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
        await expect(recordModel.insertRecord(testRecord.hash, testRecord.url)).rejects.toThrow(ErrorMessage.Conflict);
    });
});

describe('deleting a record with recordModel.deleteRecord', () => {
    test('returns a promise that resolves to the number of deleted records', async () => {
        let numOfDeletedRecords = await recordModel.deleteRecord(testRecord.hash);
        expect(numOfDeletedRecords).toBe(1);

        await expect(recordModel.findByHash(testRecord.hash)).resolves.toEqual(undefined);

        numOfDeletedRecords = await recordModel.deleteRecord(testRecord.hash);
        expect(numOfDeletedRecords).toBe(0);
    });
});
