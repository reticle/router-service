import * as NodeCache from 'node-cache';
import * as TLS from 'tls';
import * as FileSystem from 'fs';
import * as Pem from 'pem';

import settings from './settings';
import logger from './logger';

interface KeyCertificatePair {
    key: string;
    cert: string;
}

const cache = new NodeCache({ checkperiod: 60, useClones: false });
let defaultSecureContext: TLS.SecureContext;

async function resolve(domain: string): Promise<TLS.SecureContext> {
    let context = cache.get<TLS.SecureContext>(domain);
    if (context === undefined) {
        // const info = await coreservice.get('/domains/name');
        const info: KeyCertificatePair = undefined;

        context = defaultSecureContext;
        let ttl = settings.invalidDomainsTlsCacheTtl;

        try {
            if (info) {
                context = TLS.createSecureContext(info);
                ttl = settings.invalidDomainsTlsCacheTtl;
            }
        } catch (exception) {
            logger.error(exception);
        }

        cache.set<TLS.SecureContext>(domain, context, ttl);
    }

    return context;
}

namespace resolve {
    export async function preloadFromFile(domain: string, keyPath: string, certPath: string): Promise<void> {
        const context = TLS.createSecureContext({
            key: FileSystem.readFileSync(keyPath, 'utf8'),
            cert: FileSystem.readFileSync(certPath, 'utf8')
        });

        cache.set<TLS.SecureContext>(domain, context);
    }

    export async function initializeDefaultCertificate(): Promise<void> {
        logger.info('Begin creating a new self signed certificate.');

        return new Promise<void>((resolve, reject) => {
            Pem.createCertificate({ days: 365, selfSigned: true }, (error: any, keys: any) => {
                if (error) {
                    logger.error('An error occurred while creating the self signed certificate.', error);
                    reject(error);
                } else {
                    logger.info('Finished creating the self signed certificate.');

                    defaultSecureContext = TLS.createSecureContext({
                        key: keys.serviceKey,
                        cert: keys.certificate
                    });

                    resolve();
                }
            });
        });
    }
}

export default resolve;
