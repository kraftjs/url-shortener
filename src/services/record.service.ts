import { createHash } from 'crypto';
import isURL from "validator/lib/isURL";

import { recordModel } from '../models';
import { Hash, IRecord, Url } from '../interfaces/Record';
import {ErrorMessages} from "../errors";

class RecordService {
    readRecord(hash: Hash): Promise<IRecord | undefined> {
        return recordModel.findByHash(hash);
    }

    async createRecord(url: Url): Promise<IRecord> {
        if (isURL(url, {require_protocol: false})) {
            const hash = await createHash('md5').update(url).digest('hex');
            return recordModel.insertRecord(hash, url);
        } else {
            throw new Error(ErrorMessages.BadRequest);
        }
    }
}

export default new RecordService();