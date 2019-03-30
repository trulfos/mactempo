import AccountMap, {isAccountMap} from './AccountMap';

interface ConfigObject {
  jiraBase: string;
  maconomyBase: string;
  accountMap: AccountMap;
}

function isConfigObject(value: any): value is ConfigObject {
  return typeof value === 'object' && value !== null &&
    typeof value.jiraBase === 'string' &&
    typeof value.maconomyBase === 'string' &&
    isAccountMap(value.accountMap);
}

export {
    ConfigObject as default,
    isConfigObject
};
