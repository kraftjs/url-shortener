import request from 'supertest';

import app from '../../app';
import db, { Table } from '../../database/connection';
import { parseJSON, testRecord } from '../../../test/testUtils';
import { ErrorMessage } from '../../errors';

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
    test('creates and responds with a record when passed a valid, non-duplicate url', async () => {
        await db(Table.Records).truncate().where({ hash: testRecord.hash });

        const response = await request(app)
            .post('/records')
            .send({ url: testRecord.url })
            .expect(200)
            .expect('Content-Type', /json/);

        const savedRecord = await db.select().from(Table.Records).where({ hash: testRecord.hash }).first();
        expect(parseJSON(response.body)).toEqual(savedRecord);

        const timeAdjustedTestRecord = {
            ...testRecord,
            created_at: savedRecord.created_at,
            updated_at: savedRecord.updated_at,
        };
        expect(parseJSON(response.body)).toEqual(timeAdjustedTestRecord);
    });

    test('responds with a 409 - Conflict error when passed a duplicate url', async () => {
        const response = await request(app)
            .post('/records')
            .send({ url: testRecord.url })
            .expect(409)
            .expect('Content-Type', /json/);

        expect(response.body).toEqual(ErrorMessage.Conflict);
    });

    test('responds with a 400 - Bad Request error when passed an invalid url', async () => {
        const response = await request(app)
            .post('/records')
            .send({ url: 'invalidUrl' })
            .expect(400)
            .expect('Content-Type', /json/);

        expect(response.body).toEqual(ErrorMessage.BadRequest);
    });
});