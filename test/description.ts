import test from 'tape';
import {configureApp, maconomyMock, tempoMock} from './mock';

const accountMap = {
    '9343X': '3423/1004'
};
const app = configureApp({accountMap});

test('uses Jira issue numbers for task description in Maconomy', async t => {
    tempoMock.reset([{
        timeSpentSeconds: 3600,
        account: '9343X',
        dateStarted: '2019-03-19T00:00:00.000Z',
        issueKey: 'MYPROJ-34'
    }]);
    maconomyMock.reset();

    await app.transferHours();

    const lines = maconomyMock.getLines();
    t.equal(lines[0].description, 'MYPROJ-34');
    t.end();
});

test('supports multiple issues in task description', async t => {
    tempoMock.reset([
        {
            timeSpentSeconds: 3600,
            account: '9343X',
            dateStarted: '2019-03-19T00:00:00.000Z',
            issueKey: 'MYPROJ-34'
        },
        {
            timeSpentSeconds: 3600,
            account: '9343X',
            dateStarted: '2019-03-19T00:00:00.000Z',
            issueKey: 'MYPROJ-35'
        }
    ]);
    maconomyMock.reset();

    await app.transferHours();

    const lines = maconomyMock.getLines();
    t.equal(lines[0].description, 'MYPROJ-34, MYPROJ-35');
    t.end();
});

test('deduplicates issue numbers in task description', async t => {
    const issue = {
        timeSpentSeconds: 3600,
        account: '9343X',
        dateStarted: '2019-03-19T00:00:00.000Z',
        issueKey: 'MYPROJ-34'
    };

    tempoMock.reset([
        issue,
        issue,
        issue
    ]);
    maconomyMock.reset();

    await app.transferHours();

    const lines = maconomyMock.getLines();
    t.equal(lines[0].description, 'MYPROJ-34');
    t.end();
});
