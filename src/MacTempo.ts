import UserInterface from './UserInterface';
import TempoClient from './TempoClient';
import Timesheet from './Timesheet';
import MaconomyClient from './MaconomyClient';
import AccountMap from './AccountMap';
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
        const dateRange = await ui.getDateRange();
        const jiraCredentials = await ui.getCredentials('Jira');

        const tempoClient = new TempoClient(config.getJiraBase(), jiraCredentials);
        const timesheet = await tempoClient.getTimesheet(dateRange);
        await tempoClient.logout();

        const mappedTimesheet = mapAccounts(timesheet, config.getAccountMap());

        const maconomyCredentials = await ui.getCredentials('Maconomy');
        await new MaconomyClient(config.getMaconomyBase(), maconomyCredentials)
        .updateWith(mappedTimesheet);
    }
}

//TODO: Move the map accounts code to a mapped timesheet
function mapAccount(account: string, accountMap: AccountMap) {
    if (!(account in accountMap)) {
        throw new Error(`No mapping for account ${account} configured!`);
    }

    return accountMap[account];
}

function mapAccounts(timesheet: Timesheet, accountMap: AccountMap): Timesheet {
    return Object.keys(timesheet).reduce<Timesheet>(
        (accounts, account) => ({
            ...accounts,
            [mapAccount(account, accountMap)]: timesheet[account]
        }),
        {}
    );
}

export default MacTempo;
