import { hostname } from 'os';
import https from 'https';
import http from 'http';

import app from './app';

const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
const server = process.env.NODE_ENV === 'production' ? https.createServer(app) : http.createServer(app);
const port: number = process.env.PORT as unknown as number || 8080;

server.listen(port, hostname(), () => {
    console.log(`Server running at ${protocol}://${hostname()}:${port}/`);
});
