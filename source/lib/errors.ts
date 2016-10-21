
export class ServiceError extends Error {
    code: string;

    constructor(code: string, message?: string) {
        super(message);

        this.code = code;
    }
}

export class InvalidHostError extends ServiceError {
    constructor() {
        super('InvalidHost', 'Invalid HOST header received in http request');
    }
}

export class UnknownServiceError extends ServiceError {
    constructor(service: string) {
        super('UnknownService', `Unknown service [${service}]`);
    }
}

export class ServiceNotAvailableError extends ServiceError {
    constructor(service: string) {
        super('ServiceNotAvailable', `Service [${service}] is not available`);
    }
}
