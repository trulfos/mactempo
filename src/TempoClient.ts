import got from 'got';
import {CookieJar} from 'tough-cookie';

import Credentials from './Credentials';
import GroupedTimesheet from './GroupedTimesheet';
import JiraConfig from './JiraConfig';
import LiteralTimesheetEntry from './LiteralTimesheetEntry';
import Timesheet, {TimesheetEntry} from './Timesheet';

/**
 * Communicates with Tempo.
 *
 * http://developer.tempo.io/doc/timesheets/api/rest/latest
 */
class TempoClient {
    private config: JiraConfig;
    private username: string;
    private cookieJar: Promise<CookieJar>;
    private keyCache: {[issue: string]: Promise<string>} = {};

    constructor(config: JiraConfig, credentials: Credentials) {
        this.config = config;
        this.username = credentials.username;
        const cookieJar = new CookieJar();

        this.cookieJar = got.post(
            `${this.getUrl()}/rest/auth/1/session`,
            {
                cookieJar,
                json: true,
                body: credentials
            }
        )
        .then(() => cookieJar);
    }

    public async logout() {
        await got.delete(
            `${this.getUrl()}/rest/auth/1/session`,
            {cookieJar: await this.cookieJar}
        );
    }

    public async getTimesheet(dateRange: {from: Date; to: Date}): Promise<Timesheet> {
        const worklogs = await this.fetchWorklogs(dateRange);

        const entries = await Promise.all(
            worklogs.map(async (worklog: Worklog): Promise<TimesheetEntry> => {
                const {
                    dateStarted,
                    timeSpentSeconds,
                    issue: {key}
                } = worklog;

                return new LiteralTimesheetEntry({
                    date: dateStarted.split('T')[0],
                    account: await this.getAccount(key),
                    seconds: timeSpentSeconds,
                    description: key
                });
            }) as Array<Promise<TimesheetEntry>>
        );

        return Promise.resolve(
            new GroupedTimesheet(entries)
        );
    }

    public async fetchWorklogs(dateRange: {from: Date; to: Date}) {
        const worklogsUrl = `${this.getUrl()}/rest/tempo-timesheets/3/worklogs` +
            `?dateFrom=${toSimpleIsoDate(dateRange.from)}` +
            `&dateTo=${toSimpleIsoDate(dateRange.to)}` +
            `&username=${this.username}`;

        return this.request(worklogsUrl).then((r: any) => r.body);
    }

    public async getAccount(issueKey: string) {
        const {keyCache} = this;

        if (keyCache[issueKey]) {
            return keyCache[issueKey];
        }

        const field = this.config.getAccountField();
        const result = this.request(
                `${this.getUrl()}/rest/api/2/issue/${issueKey}?fields=${field}`
            )
            .then((response: any) => response.body.fields[field].key);

        keyCache[issueKey] = result;

        return result;
    }

    private async request(url: string) {
        const options = {
            cookieJar: await this.cookieJar,
            json: true
        };

        return got(url, options);
    }

    private getUrl() {
        return this.config.getBaseUrl();
    }
}

export default TempoClient;

interface Worklog {
    dateStarted: string;
    timeSpentSeconds: number;
    issue: {
        key: string;
    };
}

function toSimpleIsoDate(date: Date) {
    return date.toISOString().split('T')[0];
}
