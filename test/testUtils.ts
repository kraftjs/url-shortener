import db, {Table} from '../src/database/connection';
import { IRecord, Hash, Url } from '../src/interfaces/Record';
import {createHash} from "crypto";

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

const parseRecord = (jsonRecord: {id: number, hash: Hash, url: Url, visits: number, created_at: string, updated_at: string}): IRecord => {
    const {id, hash, url, visits, created_at, updated_at} = jsonRecord;
    return {
        id,
        hash,
        url,
        visits,
        created_at: new Date(created_at),
        updated_at: new Date(updated_at),
    };
}

export { testRecord, createRecord, parseRecord };
