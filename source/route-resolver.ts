import * as Errors from './errors';

export interface Route {
    service: string;
    url?: string;
}

let apiHost: string = undefined;
let portalHost: string = undefined;
let rendererHost: string = undefined;
let apiRoute: Route = undefined;
let portalRoute: Route = undefined;
let rendererRoute: Route = undefined;
let defaultTarget: string = undefined;

function resolve(host: string, url: string): Route {
    if (!host) {
        throw new Errors.InvalidHostError();
    }

    if (host.startsWith('localhost')) {
        if (url.startsWith('/v1/')) {
            return apiRoute;
        }

        if (url.startsWith('/portal/') || url.startsWith('/platform/')) {
            return portalRoute;
        }

        return rendererRoute;
    }

    if (host.startsWith(apiHost)) {
        return apiRoute;
    }

    if (host.startsWith(rendererHost)) {
        return rendererRoute;
    }

    if (host.startsWith(portalHost)) {
        return portalRoute;
    }

    return { service: defaultTarget, url: host };
}

namespace resolve {
    export enum Services {
        Api,
        Renderer,
        Portal
    }

    export function configure(service: Services, host: string, target: string): void {
        const route: Route = { service: target };
        switch (service) {
            case Services.Api: {
                apiHost = host;
                apiRoute = route;
                break;
            }

            case Services.Renderer: {
                rendererHost = host;
                rendererRoute = route;
                defaultTarget = target;
                break;
            }

            case Services.Portal: {
                portalHost = host;
                portalRoute = route;
                break;
            }

            default: {
                throw new Error(`Unknown service ${service}`);
            }
        }
    }
}

export default resolve;
