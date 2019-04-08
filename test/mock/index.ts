import nock from 'nock';
import {LiteralConfig, MacTempo} from '../../src';
import MaconomyMock from './MaconomyMock';
import PartialConfig from './PartialConfig';
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

const uiMock = new UiMock(credentials);

function configureApp(
    config: PartialConfig,
    date: string = '2019-03-18'
) {
    const configMock = new LiteralConfig({
        accountMap: {},
        ...config,
        jira: {
            baseUrl: 'https://jira.mycompany.com',
            accountField: 'customfield_11961',
            ...config.jira
        },
        maconomy: {
            baseUrl: 'https://touch.mycompany.com',
            ...config.maconomy
        }
    });

    tempoMock.reset();
    maconomyMock.reset();
    uiMock.reset(new Date(date));

    return new MacTempo(
        uiMock,
        configMock
    );
}

export {
    tempoMock,
    maconomyMock,
    uiMock,
    configureApp
};
