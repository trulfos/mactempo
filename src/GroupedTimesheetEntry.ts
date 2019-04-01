import {TimesheetEntry} from './Timesheet';

class GroupedTimesheetEntry implements TimesheetEntry {
    private readonly sourceEntries: TimesheetEntry[];

    constructor(entries: TimesheetEntry[]) {
        this.sourceEntries = entries;
    }

    public getDate() {
        return this.sourceEntries[0].getDate();
    }

    public getAccount() {
        return this.sourceEntries[0].getAccount();
    }

    public getSeconds() {
        return this.sourceEntries
            .map(e => e.getSeconds())
            .reduce((a, b) => a + b);
    }

    public getDescription() {
        return this.sourceEntries
            .map(e => e.getDescription())
            .reduce(toUniqueList, [])
            .join(', ');
    }
}

export {
    GroupedTimesheetEntry as default
};

function toUniqueList(list: string[], value: string) {
    return list.includes(value)
        ? list
        : list.concat(value);
}
