import { hostname } from 'os';
import http from 'http';

import app from './app';

const protocol = 'http';
const server = http.createServer(app);
const port: number = (process.env.PORT as unknown as number) || 8080;

server.listen(port, hostname(), () => {
    console.log(`Server running at ${protocol}://${hostname()}:${port}/`);
});
