import db from '../database/connection';
import {Hash, IRecord} from "../interfaces/Record";

class RecordModel {
    async findByHash(hash: Hash): Promise<IRecord> {
        return db.select().from('records').where({hash}).first();
    }
}

export default new RecordModel();