import 'mocha';
import 'should';
import { Settings } from '../source/settings';
import logger from '../source/logger';

// Disable logging.
//logger.level(50);

describe('Settings', () => {
    let settings: Settings;

    // Setup a valid environment before each test.
    beforeEach(() => {
        process.env = {
            'RETICLE_SERVICE_PORT': 1234,
        };

        settings = new Settings();
    });

    // Test initialization.
    describe('Service Port', () => {
        it('should read a valid value', () => {
            settings.initialize();
            settings.servicePort.should.equal(1234);
        });

        it('should assign a default port if not set', () => {
            delete process.env['RETICLE_SERVICE_PORT'];

            settings.initialize();
            settings.servicePort.should.equal(3000);
        });

        it('should assign a default port if empty', () => {
            process.env['RETICLE_SERVICE_PORT'] = '';

            settings.initialize();
            settings.servicePort.should.equal(3000);
        });

        it('should assign a default port if it contains an invalid value', () => {
            process.env['RETICLE_SERVICE_PORT'] = 'NOT A NUMBER';

            settings.initialize();
            settings.servicePort.should.equal(3000);
        });
    });
});
