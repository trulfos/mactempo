import AccountMap from './AccountMap';
import MappedTimesheetEntry from './MappedTimesheetEntry';
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
        return this.delegate.getEntries().map(
            entry => new MappedTimesheetEntry(this.accountMap, entry)
        );
    }
}

export {
    MappedTimesheet as default
};
