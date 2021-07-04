import db, { Table } from '../database/connection';
import { Hash, IRecord } from '../interfaces/Record';

class RecordModel {
    async findByHash(hash: Hash): Promise<IRecord | undefined> {
        return db.select().from(Table.RECORDS).where({ hash }).first();
    }
}

export default new RecordModel();