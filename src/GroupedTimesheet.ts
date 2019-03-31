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

    public getEntries() {
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
    const groupEntry = group
        ? {
            ...entry,
            seconds: group.seconds + entry.seconds,
            description: `${group.description}, ${entry.description}`
        }
        : entry;

    return {
        ...groups,
        [groupKey]: groupEntry
    };
}

function createGroupKey(entry: TimesheetEntry) {
    return `${encodeURIComponent(entry.account)}/${entry.date}`;
}

export {
    GroupedTimesheet as default
};
