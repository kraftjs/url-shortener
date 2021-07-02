require('dotenv').config();

module.exports = {
    test: {
        client: 'pg',
        connection: process.env.TEST_DB_URL,
        debug: true,
        migrations: {
            directory: './src/database/migrations',
        },
    },

    development: {
        client: 'pg',
        connection: process.env.DEV_DB_URL,
        debug: true,
        migrations: {
            directory: './src/database/migrations',
        },
    },

    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        debug: true,
        migrations: {
            directory: './src/database/migrations',
        },
    },
};
