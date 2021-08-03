import request from 'supertest';

import app from '../../app';
import db, { Table } from '../../database/connection';
import { testRecord } from '../../../test/testUtils';

const server = app.listen(3000);

afterAll(() => server.close());

describe('HTTP GET on /records', () => {
    test('returns a list of records', async () => {
        await request(app).get('/records').expect(200).expect('Content-Type', 'text/html; charset=utf-8');
    });
});

describe('HTTP GET on /records/:hash', () => {
    test('returns a record when passed a valid hash param', async () => {
        await request(app)
            .get(`/records/${testRecord.hash}`)
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8');
    });

    test('returns a resourceNotFound error when passed an invalid hash param', async () => {
        await db(Table.Records).truncate().where({ hash: testRecord.hash });

        await request(app)
            .get(`/records/${testRecord.hash}`)
            .expect(404)
            .expect('Content-Type', 'text/html; charset=utf-8');
    });
});

describe('HTTP POST on /records', () => {
    test('when passed a valid, non-duplicate url it creates the record and redirects to the new record page', async () => {
        await db(Table.Records).truncate().where({ hash: testRecord.hash });

        await request(app)
            .post('/records')
            .send({ url: testRecord.url })
            .expect(303)
            .expect('Content-Type', 'text/plain; charset=utf-8')
            .expect('Location', `records/${testRecord.hash}`);

        const savedRecord = await db.select().from(Table.Records).where({ hash: testRecord.hash }).first();
        const timeAdjustedTestRecord = {
            ...testRecord,
            created_at: savedRecord.created_at,
            updated_at: savedRecord.updated_at,
        };
        expect(savedRecord).toEqual(timeAdjustedTestRecord);
    });

    test('redirects to existing record page when passed a duplicate url', async () => {
        const preExistingRecord = await db.select().from(Table.Records).where({ hash: testRecord.hash }).first();

        await request(app)
            .post('/records')
            .send({ url: testRecord.url })
            .expect(303)
            .expect('Content-Type', 'text/plain; charset=utf-8')
            .expect('Location', `records/${testRecord.hash}`);

        expect(preExistingRecord).toEqual(testRecord);
    });

    test('responds with a 400 - Bad Request error when passed an invalid url', async () => {
        await request(app)
            .post('/records')
            .send({ url: 'invalidUrl' })
            .expect(400)
            .expect('Content-Type', 'text/html; charset=utf-8');
    });
});
