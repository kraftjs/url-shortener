import knex from 'knex';
import config from "../../knexfile";
import {IRecord} from "../interfaces/Record";

const nodeEnv = process.env.NODE_ENV || 'development';
const knexConfig = config[nodeEnv];
const db = knex<IRecord>(knexConfig);

export default db;