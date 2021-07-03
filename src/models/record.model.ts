import db from '../database/connection';
import {IRecord} from "../interfaces/Record";

class RecordDAO {
    async findAll(): Promise<IRecord[]> {
        return db.select().from('records');
    }

    // async findByHash(record: IRecord): Promise<IRecord> {
    //     const {hash} = record;
    //     return db.select().from('records').where({hash}).first();
    // }

    async create(record: IRecord): Promise<IRecord> {
        const {hash, url, visits} = record;
        const [createdRecord] = await db('records')
            .insert({hash, url, visits})
            .returning(['id', 'hash', 'url', 'visits', 'created_at', 'updated_at'])

        return createdRecord
    }

    // async findByHashAndIncrementVisits(hash: string) {
    //     return db('records').increment('visits').where({ hash });
    // }

    async findByHashAndDelete(hash: string): Promise<number> {
        return db('records').where({ hash }).del();
    }
}

export default new RecordDAO();