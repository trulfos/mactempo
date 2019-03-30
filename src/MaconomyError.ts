export default class MaconomyError extends Error {
    response: any;

    constructor(response: any) {
        super(response.Message || response.message || 'Unknown');

        this.response = response;
        this.name = 'MaconomyError';
    }
}
