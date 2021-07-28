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

    async findStaleRecords(expiration: Date): Promise<IRecord[]> {
        try {
            return db.select().from(Table.Records).where('updated_at', '<', expiration);
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

    async updateVisitsAndTime(hash: Hash): Promise<IRecord | undefined> {
        try {
            const [updatedRecord] = await db(Table.Records)
                .increment('visits', 1)
                .update('updated_at', db.fn.now())
                .where({ hash })
                .returning(['id', 'hash', 'url', 'visits', 'created_at', 'updated_at']);
            return updatedRecord;
        } catch (e) {
            throw new Error(ErrorMessage.Internal);
        }
    }

    async insertRecord(hash: Hash, url: Url): Promise<IRecord> {
        try {
            const preExistingRecord = await this.findByHash(hash);
            if (preExistingRecord) {
                return preExistingRecord;
            }

            const [savedRecord]: IRecord[] = await db(Table.Records)
                .insert({ hash, url })
                .returning(['id', 'hash', 'url', 'visits', 'created_at', 'updated_at']);
            return savedRecord;
        } catch (e) {
            throw new Error(ErrorMessage.Internal);
        }
    }

    async deleteRecord(hash: Hash): Promise<number> {
        try {
            return db(Table.Records).del().where({ hash });
        } catch (e) {
            throw new Error(ErrorMessage.Internal);
        }
    }
}

export default new RecordModel();