import logger from './logger';

export class Settings {
    public servicePort: number = 3000;

    initialize(): void {
        // Service listening port.
        try {
            const port = parseInt(process.env['RETICLE_SERVICE_PORT'], 10);

            if (port) {
                this.servicePort = port;
            } else {
                logger.warn('Environment variable RETICLE_SERVICE_PORT not set, using default port');
            }
        } catch (exception) {
            logger.warn('Environment variable RETICLE_SERVICE_PORT is not valid, using default port');
        }
    }
}

export default new Settings();
