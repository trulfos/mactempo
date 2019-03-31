export default class MaconomyError extends Error {
    public response: any;

    constructor(response: any) {
        super(response.Message || response.message || 'Unknown');

        this.response = response;
        this.name = 'MaconomyError';
    }
}
