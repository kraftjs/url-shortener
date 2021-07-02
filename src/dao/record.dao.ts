import db from '../database/connection';

class RecordDAO {
    async createRecord() {
        await db('records').insert({});
    }

    async readRecord() {
        await db.select().from('records').where();
    }

    async updateRecord() {
        await db('records')
    }

    async deleteRecord() {
        await db('records').del().where({});
    }
}

export default new RecordDAO();