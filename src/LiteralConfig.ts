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

    public getMaconomyBase() {
        return this.config.maconomy.baseUrl;
    }

    public getJiraConfig() {
        return {
            getBaseUrl: () => this.config.jira.baseUrl,
            getAccountField: () => this.config.jira.accountField
        };
    }

    public getAccountMap() {
        return this.config.accountMap;
    }
}

export default LiteralConfig;
