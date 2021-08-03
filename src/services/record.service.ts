import { createHash } from 'crypto';
import isURL from 'validator/lib/isURL';

import { recordModel } from '../models';
import { Hash, IRecord, RECORD_TTL, Url } from '../interfaces/Record';
import { ErrorMessage } from '../errors';

class RecordService {
    public staleRecordsTimer;
    private HOURS_WITHOUT_ACTIVITY_UNTIL_DELETION = RECORD_TTL;
    private HOUR_IN_MS = 1000 * 60 * 60;
    private INTERVAL_DELAY = 1000 * 60 * 3;

    constructor() {
        if (process.env.NODE_ENV !== 'test') {
            this.staleRecordsTimer = this.monitorStaleRecords();
        }
    }

    get gracePeriod(): number {
        return this.HOURS_WITHOUT_ACTIVITY_UNTIL_DELETION * this.HOUR_IN_MS;
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

    updateAfterRedirect(hash: Hash): Promise<IRecord | undefined> {
        return recordModel.updateVisitsAndTime(hash);
    }

    createRecord(url: Url): Promise<IRecord> {
        if (isURL(url, { require_protocol: true })) {
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
