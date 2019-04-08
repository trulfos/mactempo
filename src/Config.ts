import AccountMap from './AccountMap';
import JiraConfig from './JiraConfig';
import LunchConfig from './LunchConfig';
import MaconomyConfig from './MaconomyConfig';

interface Config {
    getJiraConfig(): JiraConfig;
    getMaconomyConfig(): MaconomyConfig;
    getAccountMap(): AccountMap;
    getLunchConfig(): LunchConfig | undefined;
}

export default Config;
