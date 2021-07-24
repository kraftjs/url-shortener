import { recordModel } from '../models';
import { testRecord } from '../../test/testUtils';
import recordService from './record.service';

jest.useFakeTimers();

const withRetries = async (fn: Function) => {
    const JestAssertionError = (() => {
        try {
            expect(false).toBe(true);
        } catch (e) {
            return e.constructor;
        }
    })();

    try {
        await fn();
    } catch (e) {
        if (e.constructor === JestAssertionError) {
            await withRetries(fn);
        } else {
            throw e;
        }
    }
};

describe('Method recordService.monitorStaleRecords', () => {
    test('removes stale records after grace period passes', async () => {
        const intervalId = recordService.monitorStaleRecords();

        const recordBeforeGracePeriod = await recordModel.findByHash(testRecord.hash);
        expect(recordBeforeGracePeriod).toEqual(testRecord);

        jest.advanceTimersByTime(recordService.gracePeriod + recordService.intervalDelay);

        await withRetries(async () => {
            await expect(recordModel.findByHash(testRecord.hash)).resolves.toEqual(undefined);
        });

        clearInterval(intervalId);
    });
});
