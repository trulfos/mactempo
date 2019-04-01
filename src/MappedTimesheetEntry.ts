import AccountMap from './AccountMap';
import {TimesheetEntry} from './Timesheet';

class MappedTimesheetEntry implements TimesheetEntry {
    private readonly delegate: TimesheetEntry;
    private readonly accountMap: AccountMap;

    constructor(accountMap: AccountMap, delegate: TimesheetEntry) {
        this.delegate = delegate;
        this.accountMap = accountMap;
    }

    public getDate() {
        return this.delegate.getDate();
    }

    public getAccount() {
        const {delegate, accountMap} = this;
        const account = delegate.getAccount();

        if (!(account in accountMap)) {
            throw new Error(`No mapping for account ${account} configured!`);
        }

        return accountMap[account];
    }

    public getSeconds() {
        return this.delegate.getSeconds();
    }

    public getDescription() {
        return this.delegate.getDescription();
    }
}

export {
    MappedTimesheetEntry as default
};
