import Credentials from '../../src/Credentials';
import UserInterface from '../../src/UserInterface';

class UiMock implements UserInterface {
    private credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    async getDateRange() {
        return {from: new Date('2019-03-18'), to: new Date('2019-03-20')};
    }

    async getCredentials() {
        return this.credentials;
    }
};

export default UiMock;
