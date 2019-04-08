interface LunchConfig {
    account: string;
    seconds: number;
    minWorkSeconds: number;
    description: string;
}

function isLunchConfig(value: any): value is LunchConfig {
    return typeof value === 'object' && value &&
        typeof value.account === 'string' &&
        typeof value.length === 'number' &&
        typeof value.minHours === 'number' &&
        typeof value.description === 'string';
}

export {
    LunchConfig as default,
    isLunchConfig
};
