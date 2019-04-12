class InvalidConfigError extends Error {
    constructor() {
        super('Invalid config object');
        this.name = 'InvalidConfigError';
    }
}

export {
    InvalidConfigError as default
};
