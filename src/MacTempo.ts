import Config from './Config';
import MaconomyClient from './MaconomyClient';
import MappedTimesheet from './MappedTimesheet';
import TempoClient from './TempoClient';
import Timesheet from './Timesheet';
import UserInterface from './UserInterface';
import Week from './Week';

class MacTempo {
    private readonly ui: UserInterface;
    private readonly config: Config;

    constructor(ui: UserInterface, config: Config) {
        this.ui = ui;
        this.config = config;
    }

    public async transferHours() {
        const {ui, config} = this;
        const week = await ui.getWeek();

        const timesheet = await this.fetchJiraTimesheets(week);

        const mappedTimesheet = new MappedTimesheet(
            config.getAccountMap(),
            timesheet
        );

        await this.updateMaconomy(mappedTimesheet);
    }

    private async fetchJiraTimesheets(week: Week) {
        const {config} = this;

        const jiraConfig = config.getJiraConfig();
        const jiraCredentials = await this.ui.getCredentials(
            'Jira',
            jiraConfig.getUsername()
        );
        const tempoClient = new TempoClient(
            config.getJiraConfig(),
            jiraCredentials
        );

        const timesheet = await tempoClient.getTimesheet(week.getRange());
        await tempoClient.logout();

        return timesheet;
    }

    private async updateMaconomy(timesheet: Timesheet) {
        const maconomyConfig = this.config.getMaconomyConfig();
        const maconomyCredentials = await this.ui.getCredentials(
            'Maconomy',
            maconomyConfig.getUsername()
        );

        await new MaconomyClient(
                maconomyConfig.getBaseUrl(),
                maconomyCredentials
            )
            .updateWith(timesheet);
    }
}

export default MacTempo;
