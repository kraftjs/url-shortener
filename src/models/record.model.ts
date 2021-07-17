import db, { Table } from '../database/connection';
import { Hash, IRecord, Url } from '../interfaces/Record';
import { ErrorMessages } from '../errors';

class RecordModel {
    async findByHash(hash: Hash): Promise<IRecord | undefined> {
        try {
            return db.select().from(Table.Records).where({ hash }).first();
        } catch (e) {
            throw new Error(ErrorMessages.Internal);
        }
    }

    async insertRecord(hash: Hash, url: Url): Promise<IRecord> {
        try {
            const [savedRecord]: IRecord[] = await db(Table.Records)
                .insert({ hash, url })
                .returning(['id', 'hash', 'url', 'visits', 'created_at', 'updated_at']);
            return savedRecord;
        } catch (e) {
            if (e instanceof Error && e.message.includes('duplicate key value')) {
                throw new Error(ErrorMessages.Conflict);
            }
            throw new Error(ErrorMessages.Internal);
        }
    }
}

export default new RecordModel();