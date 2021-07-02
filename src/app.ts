// import config from './utils/config';
import express from 'express';
import cors from 'cors';
import router from "./routes";
// import middleware from './utils/middleware';
// import logger from './utils/logger';

const app = express();

// connect to db (?)

app.use(cors()); // or cors middleware
// express.static middleware
app.use(express.json());
app.use('/', router)
// unknownEndpoint middleware
// errorHandler middleware

export default app;