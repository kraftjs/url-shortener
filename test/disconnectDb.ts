import db from '../src/database/connection';

afterAll(() => db.destroy());
