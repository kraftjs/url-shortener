import { Hash, IRecord } from '../interfaces/Record';
import { recordModel } from '../models';

class RecordService {
    readRecord(hash: Hash): Promise<IRecord | undefined> {
        return recordModel.findByHash(hash);
    }
}

export default new RecordService();