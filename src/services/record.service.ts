import { Hash, IRecord } from '../interfaces/Record';
import { recordModel } from '../models';

class RecordService {
    getRecord(hash: Hash): Promise<IRecord> {
        return recordModel.findByHash(hash);
    }
}

export default new RecordService();