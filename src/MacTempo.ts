import Config from './Config';
import LunchTimesheet from './LunchTimesheet';
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

        let timesheet = await this.fetchJiraTimesheets(week);

        timesheet = new MappedTimesheet(
            config.getAccountMap(),
            timesheet
        );

        const lunchConfig = config.getLunchConfig();
        if (lunchConfig) {
            timesheet = new LunchTimesheet(lunchConfig, timesheet);
        }

        await this.updateMaconomy(timesheet);
    }

    private async fetchJiraTimesheets(week: Week) {
        const config = this.config.getJiraConfig();
        const credentials = await this.ui.getCredentials(
            'Jira',
            config.getUsername()
        );
        const client = new TempoClient(config, credentials);

        const timesheet = await client.getTimesheet(week.getRange());
        await client.logout();

        return timesheet;
    }

    private async updateMaconomy(timesheet: Timesheet) {
        const config = this.config.getMaconomyConfig();
        const credentials = await this.ui.getCredentials(
            'Maconomy',
            config.getUsername()
        );

        await new MaconomyClient(
                config.getBaseUrl(),
                credentials
            )
            .updateWith(timesheet);
    }
}

export default MacTempo;
