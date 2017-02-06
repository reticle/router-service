import logger from './logger';

export interface DomainConfiguration {
    domain: string;
    keyFile: string;
    certificatefile: string;
    target: string;
}

export class Settings {
    public httpPort: number = 8080;
    public httpsPort: number = 8443;

    public api: DomainConfiguration;
    public renderer: DomainConfiguration;
    public portal: DomainConfiguration;

    public validDomainsTlsCacheTtl: number = 300;
    public invalidDomainsTlsCacheTtl: number = 60;

    initialize(): void {
        // Service listening ports.
        try {
            const port = parseInt(process.env['RETICLE_HTTP_PORT'], 10);

            if (port) {
                this.httpPort = port;
            } else {
                logger.warn('Environment variable RETICLE_HTTP_PORT not set, using default port 8080');
            }
        } catch (exception) {
            logger.warn('Environment variable RETICLE_HTTP_PORT is not valid, using default port 8080');
        }

        try {
            const port = parseInt(process.env['RETICLE_HTTPS_PORT'], 10);

            if (port) {
                this.httpsPort = port;
            } else {
                logger.warn('Environment variable RETICLE_HTTPS_PORT not set, using default port 8443');
            }
        } catch (exception) {
            logger.warn('Environment variable RETICLE_HTTPS_PORT is not valid, using default port 8443');
        }

        // Domains, SSL certificates and targets.
        this.api = this.initializeDomain('API', 'http://api');
        this.renderer = this.initializeDomain('RENDERER', 'http://renderer');
        this.portal = this.initializeDomain('PORTAL', 'http://portal');
    }

    private initializeDomain(prefix: string, target: string): DomainConfiguration {
        const result: DomainConfiguration = {
            domain: undefined,
            keyFile: undefined,
            certificatefile: undefined,
            target: undefined
        };

        const domainEnvironmentName = `RETICLE_${prefix}_DOMAIN`;
        const keyFileEnvironmentName = `RETICLE_${prefix}_KEY_FILE`;
        const certificateFileEnvironmentName = `RETICLE_${prefix}_CERTIFICATE_FILE`;
        const targetEnvironmentName = `RETICLE_${prefix}_TARGET`;

        if (process.env[domainEnvironmentName]) {
            result.domain = process.env[domainEnvironmentName];
        } else {
            result.domain = 'localhost';
            logger.warn(`Environment variable ${domainEnvironmentName} not set, using default localhost`);
        }

        if (process.env[keyFileEnvironmentName] && process.env[certificateFileEnvironmentName]) {
            result.keyFile = process.env[keyFileEnvironmentName];
            result.certificatefile = process.env[certificateFileEnvironmentName];
        } else {
            logger.warn(`Environment variables ${keyFileEnvironmentName} and ${certificateFileEnvironmentName} not set, a self signed certificate will be used`);
        }

        if (process.env[targetEnvironmentName]) {
            result.target = process.env[targetEnvironmentName];
        } else {
            result.target = target;
            logger.warn(`Environment variable ${targetEnvironmentName} not set, using default ${target}`);
        }

        return result;
    }

}

export default new Settings();
