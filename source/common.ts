
export interface Settings {
    servicePort: number;
    validDomainsTlsCacheTtl: number;
    invalidDomainsTlsCacheTtl: number;
}

export interface Logger {
    trace: (...args: any[]) => any;
    info: (...args: any[]) => any;
    warn: (...args: any[]) => any;
    debug: (...args: any[]) => any;
    error: (...args: any[]) => any;
}
