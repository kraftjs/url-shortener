import db, { Table } from '../database/connection';
import { Hash, IRecord } from '../interfaces/Record';

class RecordModel {
    async findByHash(hash: Hash): Promise<IRecord | undefined> {
        try {
            return db.select().from(Table.RECORDS).where({ hash }).first();
        } catch (e) {
            throw new Error('something went wrong');
        }
    }
}

export default new RecordModel();