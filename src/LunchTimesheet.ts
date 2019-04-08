import LunchConfig from './LunchConfig';
import LunchTimesheetEntry from './LunchTimesheetEntry';
import Timesheet, {TimesheetEntry} from './Timesheet';

/**
 * Creates a new timesheet where lunch is added according to the lunch
 * configuration provided.
 */
class LunchTimesheet implements Timesheet {
    private delegate: Timesheet;
    private config: LunchConfig;

    constructor(config: LunchConfig, delegate: Timesheet) {
        this.config = config;
        this.delegate = delegate;
    }

    public getEntries() {
        return this.delegate.getEntries().concat(
            this.generateLunchEntries()
        );
    }

    private generateLunchEntries() {
        const {config, delegate} = this;

        const dayMap = delegate
            .getEntries()
            .reduce(toDayMap, {});

        return Object.entries(dayMap)
            .filter(
                ([_, seconds]) => seconds >= config.minWorkSeconds
            )
            .map(
                ([date, _]) => new LunchTimesheetEntry(config, date)
            );
    }
}

function toDayMap(dayMap: {[k: string]: number}, entry: TimesheetEntry) {
    const key = entry.getDate();
    return {
        ...dayMap,
        [key]: (dayMap[key] || 0) + entry.getSeconds()
    };
}

export {
    LunchTimesheet as default
};
