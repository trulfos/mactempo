import AccountMap, {isAccountMap} from './AccountMap';
import LunchConfig, {isLunchConfig} from './LunchConfig';

interface ConfigObject {
    jira: {
        baseUrl: string;
        accountField: string;
        username?: string;
    };
    maconomy: {
        baseUrl: string;
        username?: string;
    };
    accountMap: AccountMap;
    lunch?: LunchConfig;
}

function isConfigObject(value: any): value is ConfigObject {
    return typeof value === 'object' && value !== null &&
        typeof value.jira === 'object' && value.jira !== null &&
        typeof value.jira.baseUrl === 'string' &&
        typeof value.jira.accountField === 'string' &&
        (!value.jira.username || typeof value.jira.username === 'string') &&
        typeof value.maconomy === 'object' && value.maconomy !== null &&
        typeof value.maconomy.baseUrl === 'string' &&
        (!value.maconomy.username || typeof value.maconomy.username === 'string') &&
        isAccountMap(value.accountMap) &&
        (!value.lunch || isLunchConfig(value.lunch));
}

export {
    ConfigObject as default,
    isConfigObject
};
