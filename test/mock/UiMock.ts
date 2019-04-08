import {Credentials, UserInterface, Week} from '../../src';

interface CredentialsCall {
    application: string;
    username?: string;
}

class UiMock implements UserInterface {
    private credentials: Credentials;
    private calls: CredentialsCall[] = [];
    private date?: Date;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    public async getWeek() {
        const {date} = this;

        if (!date) {
            throw new Error('No date set in uiMock');
        }

        return new Week(date);
    }

    public async getCredentials(application: string, username?: string) {
        this.calls.push({
            application,
            username
        });

        return this.credentials;
    }

    public reset(date: Date) {
        this.date = date;
        this.calls = [];
    }

    public getCalls() {
        return this.calls;
    }
}

export default UiMock;
