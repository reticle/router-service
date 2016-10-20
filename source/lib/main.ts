import logger from './logger';
import settings from './settings';

// Initialize settings.
try {
    settings.initialize();
} catch (ex) {
    logger.error(ex);
    process.exit(1);
}

import * as restify from 'restify';

import CertificateCache from './certificate-loader';

const server = restify.createServer();
server.get('/', (req, res) => {
    res.send(200, { it: 'works' });
});

server.listen(settings.servicePort,
    () => logger.info(`Service listening on port ${settings.servicePort}`));
