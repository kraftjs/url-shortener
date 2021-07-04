import recordModel from './record.model'
import { testRecord } from "../../test/testUtils";

describe('findByHash', () => {
    it('should return a record if given a valid hash', async () => {
        const record = await recordModel.findByHash(testRecord.hash);
        expect(record).toEqual(testRecord);
    });
});
