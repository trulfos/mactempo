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

  getMaconomyBase() {
    return this.config.maconomyBase;
  }

  getJiraBase() {
    return this.config.jiraBase;
  }

  getAccountMap() {
    return this.config.accountMap;
  }
}

export default LiteralConfig;
