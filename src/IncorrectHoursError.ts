class IncorrectHoursError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'IncorrectHoursError';
    }
}

export default IncorrectHoursError;
