const got = require('got');
import {CookieJar} from 'tough-cookie';

import Timesheet from './Timesheet';
import Credentials from './Credentials';

/**
 * Communicates with Tempo.
 *
 * http://developer.tempo.io/doc/timesheets/api/rest/latest
 */
class TempoClient {
    private url: string;
    private username: string;
    private cookieJar: Promise<CookieJar>;
    private keyCache: {[issue: string]: Promise<string>} = {};

    constructor(url: string, credentials: Credentials) {
        this.url = url;
        this.username = credentials.username;
        const cookieJar = new CookieJar();

        this.cookieJar = got.post(
            `${url}/rest/auth/1/session`,
            {
                cookieJar,
                json: true,
                body: credentials
            }
        )
        .then(() => cookieJar);
    }

    async logout() {
        await got.delete(
            `${this.url}/rest/auth/1/session`,
            {cookieJar: await this.cookieJar}
        );
    }

    async getTimesheet(dateRange: {from: Date; to: Date}): Promise<Timesheet> {
        const worklogs = await this.fetchWorklogs(dateRange);

        const entries = await Promise.all(
            worklogs.map(async (worklog: Worklog): Promise<SimpleWorklog> => {
                const {
                    dateStarted,
                    timeSpentSeconds,
                    issue: {key}
                } = worklog;

                return {
                    date: dateStarted.split('T')[0],
                    projectId: await this.getProjectId(key),
                    seconds: timeSpentSeconds
                };
            }) as Array<Promise<SimpleWorklog>>
        );

        const timesheet = entries.reduce<Timesheet>(
            (timesheet: Timesheet, log: SimpleWorklog): Timesheet => ({
                ...timesheet,
                [log.projectId]: {
                    ...timesheet[log.projectId],
                    [log.date]: ((timesheet[log.projectId] || {} as any)[log.date] || 0) + log.seconds
                }
            }),
            {}
        );


        return Promise.resolve(timesheet);
    }

    async fetchWorklogs(dateRange: {from: Date; to: Date}) {
        const worklogsUrl = `${this.url}/rest/tempo-timesheets/3/worklogs` +
            `?dateFrom=${toSimpleIsoDate(dateRange.from)}` +
            `&dateTo=${toSimpleIsoDate(dateRange.to)}` +
            `&username=${this.username}`;

        return this.request(worklogsUrl).then((r: any) => r.body);
    }

    async getProjectId(issueKey: string) {
        const {keyCache} = this;

        if (keyCache[issueKey]) {
            return keyCache[issueKey];
        }

        // TODO: This should be customizable?
        const field = 'customfield_11961';

        const result = this.request(
                `${this.url}/rest/api/2/issue/${issueKey}?fields=${field}`
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
}

export default TempoClient;

interface Worklog {
    dateStarted: string;
    timeSpentSeconds: number;
    issue: {
        key: string;
    };
}

interface SimpleWorklog {
    date: string;
    projectId: string;
    seconds: number;
}

function toSimpleIsoDate(date: Date) {
    return date.toISOString().split('T')[0];
}
