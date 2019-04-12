import Config from './Config';
import ConfigObject, {isConfigObject} from './ConfigObject';
import InvalidConfigError from './InvalidConfigError';

/**
 * Config based on file contents.
 *
 * The file is expected to reside in the user home directory.
 */
class LiteralConfig implements Config {
    private readonly config: ConfigObject;

    constructor(config: any) {
        if (!isConfigObject(config)) {
            throw new InvalidConfigError();
        }

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

    public getLunchConfig() {
        return this.config.lunch;
    }
}

export default LiteralConfig;
