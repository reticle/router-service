import 'mocha';
import 'should';

import { CertificateLoader } from '../lib/certificate-loader';

import logger from './fake-logger';
import cache from './fake-cache';

describe('CertificateCache', () => {

    it('should preserve constructor options', () => {
        const loader = new CertificateLoader({
            cache: cache,
            logger: logger,
            invalidDomainsTlsCacheTtl: 1234,
            validDomainsTlsCacheTtl: 4567
        });

        loader.cache.should.be.equal(cache);
        loader.logger.should.be.equal(logger);
        loader.invalidDomainsTlsCacheTtl.should.be.equal(1234);
        loader.validDomainsTlsCacheTtl.should.be.equal(4567);
    });

});
