import * as bunyan from 'bunyan';
import * as NodeCache from 'node-cache';
import logger from './logger';

export namespace CertificateCache {
    export interface Options {
        logger?: bunyan.Logger;
    }
}

export class CertificateCache {

    protected logger: bunyan.Logger;

    constructor(options: CertificateCache.Options = {}) {
        this.logger = options.logger || logger;
    }

}

export default new CertificateCache();
