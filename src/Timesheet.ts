export default interface Timesheet {
    [account: string]: {
        [date: string]: number;
    };
}
