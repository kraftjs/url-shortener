import { createHash } from 'crypto';

import db, { Table } from '../src/database/connection';
import { Hash, IRecord, Url } from '../src/interfaces/Record';

const url = 'www.example.org';
const hash = createHash('md5').update(url).digest('hex');

let testRecord: IRecord;
const createRecord = async () => {
    await db(Table.Records).insert({ hash, url });
    testRecord = await db.select().from(Table.Records).where({ hash }).first();
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
