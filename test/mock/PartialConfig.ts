import {ConfigObject} from '../../src';

interface PartialConfig {
    accountMap?: ConfigObject['accountMap'];
    maconomy?: Partial<ConfigObject['maconomy']>;
    jira?: Partial<ConfigObject['jira']>;
}

export {
    PartialConfig as default
};
