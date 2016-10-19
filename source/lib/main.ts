import * as restify from 'restify';
import logger from './logger';

const server = restify.createServer();
server.get('/', (req, res) => {
    res.send(200, { it: 'works' });
});

server.listen(3000, () => logger.info('router-service listening on port 3000'));
