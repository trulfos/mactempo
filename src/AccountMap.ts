/**
 * Represents a map from one account to another.
 */
interface AccountMap {
    [input: string]: string;
}

function isAccountMap(value: unknown): value is AccountMap {
    if (typeof value !== 'object' || value == null) {
        return false;
    }

    return Object.entries(value)
        .every(entry => entry.every(v => typeof v === 'string'));
}

export {
   AccountMap as default,
   isAccountMap
};
