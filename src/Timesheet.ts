interface TimesheetEntry {
    date: string; // yyyy-mm-dd
    account: string;
    seconds: number;
    description: string;
}

interface Timesheet {
    getEntries(): TimesheetEntry[];
}

export {Timesheet as default, TimesheetEntry};
