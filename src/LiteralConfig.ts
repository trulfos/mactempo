import Config from './Config';
import ConfigObject from './ConfigObject';

/**
 * Config based on file contents.
 *
 * The file is expected to reside in the user home directory.
 */
class LiteralConfig implements Config {
    private readonly config: ConfigObject;

    constructor(config: ConfigObject) {
        this.config = config;
    }

    public getMaconomyConfig() {
        const {maconomy} = this.config;

        return {
            getBaseUrl: () => maconomy.baseUrl,
            getUsername: () => maconomy.username
        };
    }

    public getJiraConfig() {
        const {jira} = this.config;

        return {
            getBaseUrl: () => jira.baseUrl,
            getAccountField: () => jira.accountField,
            getUsername: () => jira.username
        };
    }

    public getAccountMap() {
        return this.config.accountMap;
    }
}

export default LiteralConfig;
