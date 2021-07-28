import express from 'express';
import exphbs from 'express-handlebars';
import cors from 'cors';
import path from 'path';

import router from './routes';
import { errorHandler, unknownEndpoint } from './middleware';

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;