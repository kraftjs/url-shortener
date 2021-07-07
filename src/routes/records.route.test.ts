import request from 'supertest';
import app from '../app';
import db, { Table } from '../database/connection';
import { testRecord } from '../../test/testUtils';

const server = app.listen(3000);

afterAll(() => server.close());

describe('HTTP GET on /records/:hash', () => {
    test('returns a record when passed a valid hash param', async () => {
        const response = await request(app)
            .get(`/records/${testRecord.hash}`)
            .expect(200)
            .expect('Content-Type', /json/);

        const stringifiedTestRecord = JSON.parse(JSON.stringify(testRecord))

        expect(response.body).toEqual(stringifiedTestRecord);
    });

    test('returns a resourceNotFound error when passed an invalid hash param', async () => {
        await db(Table.RECORDS).del().where({ hash: testRecord.hash });

        const response = await request(app)
            .get(`/records/${testRecord.hash}`)
            .expect(404)
            .expect('Content-Type', /json/);

        expect(response.body).toEqual('record not found');
    });
});
