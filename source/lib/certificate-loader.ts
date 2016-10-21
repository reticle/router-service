import * as NodeCache from 'node-cache';
import * as TLS from 'tls';
import * as FileSystem from 'fs';

import settings from './settings';
import logger from './logger';

interface KeyCertificatePair {
    key: string;
    cert: string;
}

const cache = new NodeCache({ checkperiod: 60, useClones: false });
const defaultSecureContext = createSecureContextFromFile('./keys/default.key.pem', './keys/default.cert.pem');

function createSecureContextFromFile(keyPath: string, certPath: string): TLS.SecureContext {
    return TLS.createSecureContext({
        key: FileSystem.readFileSync(keyPath, 'utf8'),
        cert: FileSystem.readFileSync(certPath, 'utf8')
    });
}

async function resolve(domain: string): Promise<TLS.SecureContext> {
    let context: TLS.SecureContext = cache.get<TLS.SecureContext>(domain);
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

        cache.set<TLS.SecureContext>(name, context, ttl);
    }

    return context;
}

namespace resolve {
    export function preloadFromFile(domain: string, keyPath: string, certPath: string): void {
        const context = createSecureContextFromFile(keyPath, certPath);
        cache.set<TLS.SecureContext>(domain, context);
    }
}

export default resolve;
