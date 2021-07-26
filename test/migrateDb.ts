import db from '../src/database/connection';

export default async () => {
    await db.migrate.latest();
    await db.destroy();
};
