interface TimesheetT {
    [account: string]: {
        [date: string]: number;
    };
}

interface TimesheetEntry {
    date: string; // yyyy-mm-dd
    account: string;
    seconds: number;
}

interface Timesheet {
    getEntries(): TimesheetEntry[];
}

export {TimesheetT, Timesheet as default, TimesheetEntry};
