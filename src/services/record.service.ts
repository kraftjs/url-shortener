import { createHash } from 'crypto';
import isURL from 'validator/lib/isURL';

import { recordModel } from '../models';
import { Hash, IRecord, Url } from '../interfaces/Record';
import { ErrorMessage } from '../errors';

class RecordService {
    private HOURS_SINCE_LAST_VISIT_BEFORE_RECORD_DELETION = 24;
    private HOUR_IN_MS = 1000 * 60 * 60;
    private INTERVAL_DELAY = 1000 * 60 * 15;

    get gracePeriod(): number {
        return this.HOURS_SINCE_LAST_VISIT_BEFORE_RECORD_DELETION * this.HOUR_IN_MS;
    }

    get intervalDelay(): number {
        return this.INTERVAL_DELAY;
    }

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

    monitorStaleRecords(): NodeJS.Timeout {
        return setInterval(this.removeStaleRecords, this.intervalDelay);
    }

    private removeStaleRecords = async () => {
        const expiration = new Date(Date.now() - this.gracePeriod);
        const staleRecords = await recordModel.findStaleRecords(expiration);
        if (staleRecords.length) {
            const hashesOfStaleRecords = staleRecords.map((staleRecord) => staleRecord.hash);
            await Promise.all(
                hashesOfStaleRecords.map(async (hash) => {
                    await recordModel.deleteRecord(hash);
                }),
            );
        }
    };
}

export default new RecordService();