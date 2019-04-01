interface TimesheetEntry {
    getDate(): string; // yyyy-mm-dd
    getAccount(): string;
    getSeconds(): number;
    getDescription(): string;
}

interface Timesheet {
    getEntries(): TimesheetEntry[];
}

export {Timesheet as default, TimesheetEntry};
