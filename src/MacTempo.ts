import UserInterface from './UserInterface';
import TempoClient from './TempoClient';
import MappedTimesheet from './MappedTimesheet';
import MaconomyClient from './MaconomyClient';
import Config from './Config';

class MacTempo {
    private readonly ui: UserInterface;
    private readonly config: Config;

    constructor(ui: UserInterface, config: Config) {
        this.ui = ui;
        this.config = config;
    }

    async transferHours() {
        const {ui, config} = this;
        const week = await ui.getWeek();

        const jiraCredentials = await ui.getCredentials('Jira');
        const tempoClient = new TempoClient(config.getJiraBase(), jiraCredentials);
        const timesheet = await tempoClient.getTimesheet(week.getRange());
        await tempoClient.logout();

        const mappedTimesheet = new MappedTimesheet(
            config.getAccountMap(),
            timesheet
        );

        const maconomyCredentials = await ui.getCredentials('Maconomy');
        await new MaconomyClient(config.getMaconomyBase(), maconomyCredentials)
            .updateWith(mappedTimesheet);
    }
}

export default MacTempo;
