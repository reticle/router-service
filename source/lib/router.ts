import * as Http from 'http';
import logger from './logger';
import resolver from './route-resolver';

const HttpProxy = require('http-proxy');

const keepAliveAgent = new Http.Agent({ keepAlive: true, maxSockets: 1000 });
const proxy = HttpProxy.createProxyServer({ agent: keepAliveAgent });

proxy.on('error', function (err, req, res) {
    logger.error(err);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });

    res.end(`Something went wrong (${err.toString()}. And we are reporting a custom error message.`);
});

export default (req: Http.ServerRequest, res: Http.ServerResponse) => {
    try {
        let targetUrl: string;

        const route = resolver(req.headers.host, req.url);
        if (route.url) {
            targetUrl = `http://${route.service}/${route.url}`;
        } else {
            targetUrl = `http://${route.service}`;
        }

        proxy.web(req, res, { target: targetUrl });
    } catch (error) {
        logger.error(error);

        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.toString() }));
    }
};
