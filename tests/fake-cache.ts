export default {

    get: (key: string): { context: any } => {
        return undefined;
    },

    set: (key: string, value: { context: any }, ttl: number): boolean => {
        return true;
    }
};
