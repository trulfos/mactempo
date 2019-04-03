import AccountMap from './AccountMap';
import JiraConfig from './JiraConfig';

interface Config {
    getJiraConfig(): JiraConfig;
    getMaconomyBase(): string;
    getAccountMap(): AccountMap;
}

export default Config;
