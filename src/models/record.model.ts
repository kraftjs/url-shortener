import db, { Table } from '../database/connection';
import { Hash, IRecord, Url } from '../interfaces/Record';
import { ErrorMessage } from '../errors';

class RecordModel {
    async findAllRecords(): Promise<IRecord[]> {
        try {
            return db.select().from(Table.Records);
        } catch (e) {
            throw new Error(ErrorMessage.Internal);
        }
    }

    async findByHash(hash: Hash): Promise<IRecord | undefined> {
        try {
            return db.select().from(Table.Records).where({ hash }).first();
        } catch (e) {
            throw new Error(ErrorMessage.Internal);
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
                throw new Error(ErrorMessage.Conflict);
            }
            throw new Error(ErrorMessage.Internal);
        }
    }
}

export default new RecordModel();