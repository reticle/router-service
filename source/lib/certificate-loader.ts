import * as Bunyan from 'bunyan';
import * as NodeCache from 'node-cache';
import * as TLS from 'tls';
import * as FileSystem from 'fs';

import settings from './settings';
import logger from './logger';

export namespace CertificateLoader {
    export interface Cache {
        get(key: string): TLS.SecureContext;
        set(key: string, value: TLS.SecureContext, ttl: number): boolean;
    }

    export interface Options {
        logger?: Logger;
        cache?: Cache;
        validDomainsTlsCacheTtl?: number;
        invalidDomainsTlsCacheTtl?: number;
    }

    export interface KeyCertificatePair {
        key: string;
        certificate: string;
    }
}

export class CertificateLoader {

    logger: CertificateLoader.Logger;
    cache: CertificateLoader.Cache;
    validDomainsTlsCacheTtl: number;
    invalidDomainsTlsCacheTtl: number;
    defaultSecureContext: TLS.SecureContext;

    constructor(options: CertificateLoader.Options = {}) {
        this.logger = options.logger || logger;
        this.cache = options.cache || new NodeCache({ checkperiod: 60, useClones: false });
        this.validDomainsTlsCacheTtl = options.validDomainsTlsCacheTtl || settings.validDomainsTlsCacheTtl;
        this.invalidDomainsTlsCacheTtl = options.invalidDomainsTlsCacheTtl || settings.invalidDomainsTlsCacheTtl;

        this.defaultSecureContext = TLS.createSecureContext({
            key: FileSystem.readFileSync('./keys/default.key.pem', 'utf8'),
            cert: FileSystem.readFileSync('./keys/default.cert.pem', 'utf8')
        });
    }

    createSecureContext(pair: CertificateLoader.KeyCertificatePair): TLS.SecureContext {
        if (!pair || !pair.key || !pair.certificate) {
            return this.defaultSecureContext;
        }

        try {
            return TLS.createSecureContext({
                key: pair.key,
                cert: pair.certificate
            });
        } catch (exception) {
            this.logger.error(exception);
            return this.defaultSecureContext;
        }
    }

    async get(domain: string): Promise<TLS.SecureContext> {
        let context: TLS.SecureContext = this.cache.get(domain);
        if (context === undefined) {
            // const info = await coreservice.get('/domains/name');
            const info: CertificateLoader.KeyCertificatePair = undefined;

            if (info) {
                // Create and cache the context for a relatively long time.
                context = this.createSecureContext(info);
                this.cache.set(name, context, this.validDomainsTlsCacheTtl);
            } else {
                // Cache this domain name for a short time.
                context = this.defaultSecureContext;
                this.cache.set(name, context, this.invalidDomainsTlsCacheTtl);
            }
        }

        return context;
    }
}

export default new CertificateLoader();
