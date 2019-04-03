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

const tempoMock = new TempoMock(
    'https://jira.mycompany.com',
    credentials
);

const maconomyMock = new MaconomyMock(
    'https://touch.mycompany.com',
    credentials
);

function configureApp(accountMap: AccountMap, date?: string) {
    const configMock = new LiteralConfig({
        jira: {
            baseUrl: 'https://jira.mycompany.com',
            accountField: 'customfield_11961',
        },
        maconomy: {
            baseUrl: 'https://touch.mycompany.com'
        },
        accountMap
    });

    const uiMock = new UiMock(
        credentials,
        new Date(date || '2019-03-18')
    );

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
