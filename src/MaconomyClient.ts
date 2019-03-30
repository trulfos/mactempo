import Timesheet from './Timesheet';
import MaconomyError from './MaconomyError';
import IncorrectHoursError from './IncorrectHoursError';
import Week from './Week';
const got = require('got');

export interface Line {
    date: string,
    task: string,
    hours: string,
    projectId: string,
    text: string,
    dailyDescription: string,
    lineKey: string
}

interface Credentials {
    username: string;
    password: string;
}

const commonProps = {
    clean: false,
    calfocus: false,
    impersonate: false,
    maccharset: 'UTF-8',
    lang: 'en_US',
    locale: 'en_US'
};

export default class MaconomyClient {
    private url: string;
    private sessionId: Promise<string>;

    constructor(url: string, credentials: Credentials) {
        this.url = `${url}/DeltekTouch/Maconomy/Time/maconomyshared/backend/RemoteCall.php`;

        this.sessionId = this.executeRpc({
                inpObj: {
                    includeScreenLayouts: false,
                    operation: 'login',
                    ...credentials,
                    ...commonProps
                }
            })
            .then(response => response.sessionid);
    }

    async getExistingLines(date: Date) {
        const week = new Week(date);
        const startDate = formatDate(week.getFirst());
        const endDate = formatDate(week.getLast());

        const response: GetPeriodResponse = await this.executeRpc({
            inpObj: {
                inputTheDate: startDate,
                startDate,
                endDate,
                includeLineMetadata: true,
                lineFields: [
                    'JobNameVar',
                    'JobNumber',
                    'TaskName',
                    'EntryText',
                    'TaskDescriptionVar',
                    'CustomerNameVar',
                    'Invoiceable',
                    'ApprovalStatus',
                    'CommentProjectManager',
                    'TheDate',
                    'NumberOf',
                    'DailyDescription',
                    'ActivityNumber',
                    'ActivityTextVar',
                    'PermanentLine'
                ].join(','),
                operation: 'getperiod',
                sessionid: await this.sessionId,
                ...commonProps
            }
        });

        return response.Lines
        .map(
            line => ({
                account: `${line.Fields.JobNumber}/${line.Fields.TaskName}`,
                key: line.InstanceKey,
                date: line.Fields.TheDate
            })
        );
    }

    async updateWith(timesheet: Timesheet) {
        await toArgs(timesheet).reduce(
            (promise, {account, date, hours}) => promise.then(
                async lineCache => ({
                    ...lineCache,
                    [account]: await this.updateDateWith(
                        account,
                        date,
                        hours,
                        lineCache[account]
                    )
                })
            ),
            Promise.resolve({} as {[account: string]: string | undefined})
        );
    }

    private async updateDateWith(account: string, date: string, hours: number, lineKey?: string) {
        const [projectId, task] = account.split('/');
        const sessionId = await this.sessionId;

        if (!projectId || !task) {
            throw new Error(`Invalid Maconomy account/task id: ${account}`);
        }

        const entryDate = formatDate(new Date(date));

        const response = await this.executeRpc(
            {
                inpObj: {
                    theDate: entryDate,
                    InstanceKey: lineKey || '',
                    Fields: {
                        Favorite: '',
                        JobNumber: projectId,
                        TaskName: task,
                        DailyDescription: 'Utvikling',
                        NumberOf: `'${hours}'`,
                        EntryText: undefined,
                        PermanentLine: 'false',
                        InternalJob: 'true',
                        LineCurrentApprovalStatusDescriptionVar: '',
                        LineCurrentApprovalStatusVar: '',
                        CommentProjectManager: '',
                        Invoiceable: 'false',
                        ApprovalStatus: '',
                        EntryDate: entryDate,
                        createfavorite: 'undefined'
                    },
                    reopenIfSubmitted: false,
                    DisplayFields: [
                        'JobNameVar',
                        'EntryText',
                        'JobNumber',
                        'TaskName',
                        'TaskDescriptionVar',
                        'CustomerNameVar',
                        'Invoiceable',
                        'ApprovalStatus',
                        'CommentProjectManager',
                        'TheDate',
                        'NumberOf',
                        'DailyDescription',
                        'ActivityNumber',
                        'ActivityTextVar',
                        'PermanentLine'
                    ].join(','),
                    operation: 'savetimesheetentry',
                    sessionid: sessionId,
                    ...commonProps
                }
            }
        );

        return response.Line && response.Line.InstanceKey;
    }

    async executeRpc(request: object) {
        const body = {
            requestobj: JSON.stringify(request),
            functionname: 'executerequest',
            macurl: this.url
        };

        if (this.sessionId) {
            (body as any).sessionid = await this.sessionId;
        }

        return got.post(this.url, {
                body,
                form: true, // Request format
                json: true  // Response format
            })
            .then((res: any) => res.body)
            .then((json: any) => {
                if (!json.ok) {
                    throw new MaconomyError(json);
                }

                return json;
            });
    }
}

function formatDate(date: Date) {
    return date.toISOString().split('T')[0].replace(/-/g, '.');
}

function toArgs(timesheet: Timesheet) {
    return timesheet.getEntries()
        .map(
            ({account, seconds, date}) => ({
                account,
                date,
                hours: convertHours(seconds)
            })
        );
}

function convertHours(seconds: number) {
    if (seconds % 1800 !== 0) {
        throw new IncorrectHoursError(
            'The time given must be a multiple of half hours'
        );
    }

    return seconds / 3600;
}

interface GetPeriodResponse {
    operation: 'getperiod',
    sessionid: string,
    ok: boolean,
    message: string,
    EmployeeNumber: string,
    timeout: boolean,
    Lines: Array<{
        InstanceKey: string; //'TimeSheetLine28054C21-3D73-4A97-A69C-40863E245FA5',
        TimeStamp: string; // '2018-09-30 21:16:31.530',
        DisplayName: string,
        CanCopyTimeSheetLine: boolean,
        CanEditTimeSheetLine: boolean,
        CanDeleteTimeSheetLine: boolean,
        Fields: {
            TheDate: string;
            JobNumber: string;
            TaskName: string;
            TaskDescriptionVar: string;
            CustomerNameVar: string;
        };
    }>,
    BusinessDays: string[]; // ['2018.10.01',...,'2018.10.05']
    DayTotals: Array<{
        TheDate: string, // f. ex. '2018.10.07',
        ShortDate: string, // f. ex. '10/07',
        WeekDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday',
        ExternalRegisteredTimeQuantity: number,
        InternalRegisteredTimeQuantity: number,
        TotalRegisteredTimeQuantity: number,
        FixedWorkingTime: number,
        OvertimeHours: number,
        timeRegistrationUnit: string // f. ex. 'Hours'
    }>,
    ReopenTimesheetAction: boolean,
    SubmittedAction: boolean,
    EditableAction: boolean,
    CanAddTimeSheetLine: boolean,
    CanEditTimeSheetLine: boolean,
    CanDeleteTimeSheetLine: boolean,
    currentlyinuse: boolean,
    closed: 'N' | 'Y',
    weekNumber: number,
    part: string,
    submitted: 'N' | 'Y'
}
