import {recordDAO} from '../dao'

class RecordService {
    updateRecord(recordDto: IRecord) {

    }

    createRecord(recordDto) {
        const {hash, url} = recordDto;
        recordDAO.createRecord();
    }
}

export default new RecordService();