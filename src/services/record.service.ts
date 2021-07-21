import { createHash } from 'crypto';
import isURL from 'validator/lib/isURL';

import { recordModel } from '../models';
import { Hash, IRecord, Url } from '../interfaces/Record';
import { ErrorMessage } from '../errors';

class RecordService {
    readAllRecords(): Promise<IRecord[]> {
        return recordModel.findAllRecords();
    }

    readRecord(hash: Hash): Promise<IRecord | undefined> {
        return recordModel.findByHash(hash);
    }

    createRecord(url: Url): Promise<IRecord> {
        if (isURL(url, { require_protocol: false })) {
            const hash = createHash('md5').update(url).digest('hex');
            return recordModel.insertRecord(hash, url);
        } else {
            throw new Error(ErrorMessage.BadRequest);
        }
    }
}

export default new RecordService();