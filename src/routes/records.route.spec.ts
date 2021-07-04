import request from 'supertest';

import db, { Table } from '../database/connection';
import { testRecord } from '../../test/testUtils';
import app from '../app';

const server = app.listen(3000);

afterAll(() => server.close());

describe('HTTP GET on /records/:hash', () => {
    it('should return a record', async () => {

        const response = await request(app)
            .get(`/records/${testRecord.hash}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(response).toContain(testRecord);
    });

    it('should return undefined when passing an invalid hash', async () => {
        await db(Table.RECORDS).del().where({ hash: testRecord.hash });

        const response = await request(app)
            .get(`/records/${testRecord.hash}`)
            .expect(404)
            .expect('Content-Type', /json/);

        expect(response).toEqual(undefined);
    });
});
