import db from '../src/database/connection';

const tablesToTruncate = ['records'];

beforeEach(() => {
    return Promise.all(
        tablesToTruncate.map((table) => {
            return db(table).truncate();
        }),
    );
});
