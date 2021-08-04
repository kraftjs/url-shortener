import { Knex } from 'knex';
import { resolve } from 'path';
import dotenv from 'dotenv';

const path = resolve(__dirname, '../../.env');
dotenv.config({ path });

interface IKnexConfig {
    [key: string]: Knex.Config;
}

const config: IKnexConfig = {
    test: {
        client: 'pg',
        connection: process.env.TEST_DB_URL,
        migrations: {
            directory: './migrations',
        },
    },
    development: {
        client: 'pg',
        connection: process.env.DEV_DB_URL,
        migrations: {
            directory: './migrations',
        },
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './migrations',
        },
    },
};

export default config;
