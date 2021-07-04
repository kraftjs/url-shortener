import express from 'express';
import cors from 'cors'
import router from "./routes";
import {errorHandler, unknownEndpoint} from './middleware'

const app = express();

app.use(cors())
app.use(express.json());
app.use('/', router);
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;