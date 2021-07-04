import db from '../src/database/connection';
import { IRecord } from '../src/interfaces/Record';

const hash = '1230jf1f123';
const url = 'www.example.org';

const testRecord: IRecord = {
    hash,
    url,
};

const createRecord = async () => {
    await db('records').insert({ hash, url });
    const { id, visits, created_at, updated_at } = await db.select().from('records').where({ hash }).first();
    testRecord.id = id;

    testRecord.visits = visits;
    testRecord.created_at = created_at;
    testRecord.updated_at = updated_at;
};

export { testRecord, createRecord };
