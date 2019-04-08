import AccountMap from './AccountMap';
import JiraConfig from './JiraConfig';
import MaconomyConfig from './MaconomyConfig';

interface Config {
    getJiraConfig(): JiraConfig;
    getMaconomyConfig(): MaconomyConfig;
    getAccountMap(): AccountMap;
}

export default Config;
