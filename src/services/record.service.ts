import { Hash, IRecord } from '../interfaces/Record';
import { recordModel } from '../models';

class RecordService {
    async readRecord(hash: Hash): Promise<IRecord | undefined> {
        return recordModel.findByHash(hash);
    }
}

export default new RecordService();