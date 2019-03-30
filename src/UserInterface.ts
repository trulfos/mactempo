import Credentials from './Credentials';

interface UserInterface {
    getDateRange(): Promise<DateRange>;
    getCredentials(application: string): Promise<Credentials>;
}

interface DateRange {
    from: Date;
    to: Date;
}

export {
    UserInterface as default,
    DateRange
};
