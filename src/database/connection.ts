import knex from 'knex';

import config from './knexfile';

const nodeEnv = process.env.NODE_ENV || 'development';
const knexConfig = config[nodeEnv];
const db = knex(knexConfig);

export enum Table {
    Records = 'records',
}

export default db;
