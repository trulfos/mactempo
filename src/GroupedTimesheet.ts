import Timesheet, {TimesheetEntry} from './Timesheet';

/**
 * Groups all entries in a timesheet by account and date.
 * 
 * This ensures there is only one entry per unique pair of account and date.
 */
class GroupedTimesheet implements Timesheet {
    private worklogs: TimesheetEntry[];

    constructor(worklogs: TimesheetEntry[]) {
        this.worklogs = worklogs;
    }

    getEntries() {
        const groups = this.worklogs
            .reduce<GroupMap>(addToGroupMap, {});

        return Object.values(groups);
    }
}

interface GroupMap {
    [groupKey: string]: TimesheetEntry;
}

function addToGroupMap(groups: GroupMap, entry: TimesheetEntry) {
    const groupKey = createGroupKey(entry);
    const group = groups[groupKey];
    const seconds = (group ? group.seconds : 0) + entry.seconds;

    return {
        ...groups,
        [groupKey]: { ...entry, seconds }
    };
}

function createGroupKey(entry: TimesheetEntry) {
    return `${encodeURIComponent(entry.account)}/${entry.date}`;
}

export {
    GroupedTimesheet as default
};
