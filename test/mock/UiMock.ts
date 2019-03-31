import {Credentials, UserInterface, Week} from '../../src';

class UiMock implements UserInterface {
    private credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    public async getWeek() {
        return new Week(new Date('2019-03-18'));
    }

    public async getCredentials() {
        return this.credentials;
    }
}

export default UiMock;
