import AccountMap from './AccountMap';
import Timesheet from './Timesheet';

/**
 * Maps one timesheet to a different timesheet where all the accounts have been
 * mapped as specified by an account mapping.
 */
class MappedTimesheet implements Timesheet {
    private delegate: Timesheet;
    private accountMap: AccountMap;

    constructor(accountMap: AccountMap, delegate: Timesheet) {
        this.accountMap = accountMap;
        this.delegate = delegate;
    }

    public getEntries() {
        return this.delegate.getEntries()
            .map(entry => ({
                ...entry,
                account: this.mapAccount(entry.account)
            }));
    }

    private mapAccount(account: string) {
        const {accountMap} = this;

        if (!(account in accountMap)) {
            throw new Error(`No mapping for account ${account} configured!`);
        }

        return accountMap[account];
    }
}

export {
    MappedTimesheet as default
};
