import db, { Table } from '../database/connection';
import { Hash, IRecord, Url } from '../interfaces/Record';

class RecordModel {
    async findByHash(hash: Hash): Promise<IRecord | undefined> {
        try {
            return db.select().from(Table.RECORDS).where({ hash }).first();
        } catch (e) {
            throw new Error('something went wrong');
        }
    }

    async createRecord(hash: Hash, url: Url): Promise<IRecord> {
        try {
            const [savedRecord]: IRecord[] = await db(Table.RECORDS)
                .insert({ hash, url })
                .returning(['id', 'hash', 'url', 'visits', 'created_at', 'updated_at']);
            return savedRecord;
        } catch (e) {
            throw new Error('hash already exists');
        }
    }
}

export default new RecordModel();