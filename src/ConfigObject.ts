import AccountMap, {isAccountMap} from './AccountMap';

interface ConfigObject {
    jira: {
        baseUrl: string;
        accountField: string;
    };
    maconomy: {
        baseUrl: string;
    };
    accountMap: AccountMap;
}

function isConfigObject(value: any): value is ConfigObject {
    return typeof value === 'object' && value !== null &&
        typeof value.jira === 'object' && value.jira !== null &&
        typeof value.jira.baseUrl === 'string' &&
        typeof value.jira.accountField === 'string' &&
        typeof value.maconomy === 'object' && value.maconomy !== null &&
        typeof value.maconomy.baseUrl === 'string' &&
        isAccountMap(value.accountMap);
}

export {
    ConfigObject as default,
    isConfigObject
};
