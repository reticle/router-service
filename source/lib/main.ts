import * as Http from 'http';
import * as Https from 'https';

import logger from './logger';
import settings from './settings';
import sniResolver from './sni-resolver';
import router from './router';
import routeResolver from './route-resolver';

// Initialize settings.
try {
    settings.initialize();

    routeResolver.configure('api', 'localhost', 'apis');

} catch (ex) {
    logger.error(ex);
    process.exit(1);
}


// HTTP + HTTPS servers that will process all requests to the platform.
const insecureServer = Http.createServer(router);
const secureServer = Https.createServer({ SNICallback: sniResolver }, router);

insecureServer.listen(8080);
secureServer.listen(8443);
