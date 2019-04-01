import nock from 'nock';
import {AccountMap, LiteralConfig, MacTempo} from '../../src';
import MaconomyMock from './MaconomyMock';
import TempoMock from './TempoMock';
import UiMock from './UiMock';

// Block all requests to unmocked hosts
nock.disableNetConnect();

const credentials = {
    username: 'max',
    password: 'soccer123'
};

const uiMock = new UiMock(credentials);

const tempoMock = new TempoMock(
    'https://jira.mycompany.com',
    credentials
);

const maconomyMock = new MaconomyMock(
    'https://touch.mycompany.com',
    credentials
);

function configureApp(accountMap: AccountMap) {
    const configMock = new LiteralConfig({
        jiraBase: 'https://jira.mycompany.com',
        maconomyBase: 'https://touch.mycompany.com',
        accountMap
    });

    return new MacTempo(
        uiMock,
        configMock
    );
}

export {
    tempoMock,
    maconomyMock,
    configureApp
};
