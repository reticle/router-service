import * as Http from 'http';
import * as Https from 'https';

import logger from './logger';
import settings from './settings';
import certificateLoader from './certificate-loader';
import sniResolver from './sni-resolver';
import router from './router';
import routeResolver from './route-resolver';

async function initialize(): Promise<void> {
    settings.initialize();

    await certificateLoader.initializeDefaultCertificate();

    if (settings.api.keyFile) {
        await certificateLoader.preloadFromFile(settings.api.domain, settings.api.keyFile, settings.api.certificatefile);
    }

    if (settings.renderer.keyFile) {
        await certificateLoader.preloadFromFile(settings.renderer.domain, settings.renderer.keyFile, settings.renderer.certificatefile);
    }

    if (settings.portal.keyFile) {
        await certificateLoader.preloadFromFile(settings.portal.domain, settings.portal.keyFile, settings.portal.certificatefile);
    }

    routeResolver.configure(routeResolver.Services.Api, settings.api.domain, settings.api.target);
    routeResolver.configure(routeResolver.Services.Renderer, settings.renderer.domain, settings.renderer.target);
    routeResolver.configure(routeResolver.Services.Portal, settings.portal.domain, settings.portal.target);
}


initialize()
    .then(() => {
        // HTTP + HTTPS servers that will process all requests to the platform.
        const insecureServer = Http.createServer(router);
        const secureServer = Https.createServer({ SNICallback: sniResolver }, router);

        insecureServer.listen(settings.httpPort);
        secureServer.listen(settings.httpsPort);
    })
    .catch((error) => {
        logger.error(error);
    });
