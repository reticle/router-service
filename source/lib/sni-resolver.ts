import logger from './logger';
import certificateLoader from './certificate-loader';

export default async (name: string, callback: Function): Promise<void> => {
    logger.info('received SNI request for host', name);

    try {
        callback(null, await certificateLoader(name));
    } catch (error) {
        logger.error('an error ocurred while trying to get a secure context for domain', error);
        callback(error);
    }
};
