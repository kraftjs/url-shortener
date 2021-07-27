import request from 'supertest';

import app from '../app';
import db, { Table } from '../database/connection';
import { testRecord } from '../../test/testUtils';
import { IRecord } from '../interfaces/Record';

const server = app.listen(3000);

afterAll(() => server.close());

describe('HTTP GET on "/"', () => {
    test('responds with 200 and html', async () => {
        await request(app).get('/').expect(200).expect('Content-Type', 'text/html; charset=utf-8');
    });
});

describe('HTTP GET on "/:hash"', () => {
    test('redirects to a url if hash is stored in db and increments visit count and updates updated_at', async () => {
        await request(app).get(`/${testRecord.hash}`).expect(302).expect('Location', testRecord.url);

        const redirectedRecord: IRecord = await db
            .select()
            .from(Table.Records)
            .where({ hash: testRecord.hash })
            .first();

        expect(redirectedRecord.visits).toBe(testRecord.visits + 1);
        expect(redirectedRecord.updated_at).not.toEqual(testRecord.updated_at);
    });

    test('returns an error when passed an unstored hash', async () => {
        await db(Table.Records).truncate().where({ hash: testRecord.hash });

        await request(app).get(`/${testRecord.hash}`).expect(404).expect('Content-Type', 'text/html; charset=utf-8');
    });
});