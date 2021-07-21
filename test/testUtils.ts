import db, { Table } from '../src/database/connection';
import { Hash, IRecord, Url } from '../src/interfaces/Record';
import { createHash } from 'crypto';

const url = 'www.example.org';
const hash = createHash('md5').update(url).digest('hex');

const testRecord: IRecord = {
    hash,
    url,
};

const createRecord = async () => {
    await db(Table.Records).insert({ hash, url });
    const { id, visits, created_at, updated_at } = await db.select().from(Table.Records).where({ hash }).first();
    testRecord.id = id;

    testRecord.visits = visits;
    testRecord.created_at = created_at;
    testRecord.updated_at = updated_at;
};

interface IJsonRecord {
    id: number;
    hash: Hash;
    url: Url;
    visits: number;
    created_at: string;
    updated_at: string;
}

const parseJSON = (jsonRecord: IJsonRecord | IJsonRecord[]): IRecord | IRecord[] => {
    if (jsonRecord instanceof Array) {
        return jsonRecord.map((json) => ({
            ...json,
            created_at: new Date(json.created_at),
            updated_at: new Date(json.updated_at),
        }));
    } else {
        return {
            ...jsonRecord,
            created_at: new Date(jsonRecord.created_at),
            updated_at: new Date(jsonRecord.updated_at),
        };
    }
};

export { testRecord, createRecord, parseJSON };
