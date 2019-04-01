import {Credentials, UserInterface, Week} from '../../src';

class UiMock implements UserInterface {
    private readonly credentials: Credentials;
    private readonly date: Date;

    constructor(credentials: Credentials, date: Date) {
        this.credentials = credentials;
        this.date = date;
    }

    public async getWeek() {
        return new Week(this.date);
    }

    public async getCredentials() {
        return this.credentials;
    }
}

export default UiMock;
