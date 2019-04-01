import {TimesheetEntry} from './Timesheet';

class LiteralTimesheetEntry implements TimesheetEntry {
    private readonly data: TimesheetEntryData;

    constructor(data: TimesheetEntryData) {
        this.data = data;
    }

    public getDate() {
        return this.data.date;
    }

    public getAccount() {
        return this.data.account;
    }

    public getSeconds() {
        return this.data.seconds;
    }

    public getDescription() {
        return this.data.description;
    }
}

interface TimesheetEntryData {
    date: string;
    account: string;
    seconds: number;
    description: string;
}

export {
    LiteralTimesheetEntry as default
};
