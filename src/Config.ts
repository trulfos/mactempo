import AccountMap from './AccountMap';

interface Config {
    getJiraBase(): string;
    getMaconomyBase(): string;
    getAccountMap(): AccountMap;
}

export default Config;
