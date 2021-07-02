const nodeEnv = process.env.NODE_ENV || 'development';
const knexConfig = require('../../knexfile')[nodeEnv];
const db = require('knex')(knexConfig);

export default db;