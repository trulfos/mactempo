import LunchConfig from './LunchConfig';
import {TimesheetEntry} from './Timesheet';

class LunchTimesheetEntry implements TimesheetEntry {
    private config: LunchConfig;
    private date: string;

    constructor(config: LunchConfig, date: string) {
        this.config = config;
        this.date = date;
    }

    public getDate() {
        return this.date;
    }

    public getAccount() {
        return this.config.account;
    }

    public getSeconds() {
        return this.config.seconds;
    }

    public getDescription() {
        return this.config.description;
    }
}

export {
    LunchTimesheetEntry as default
};
