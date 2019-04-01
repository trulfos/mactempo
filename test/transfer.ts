import test from 'tape';
import {IncorrectHoursError} from '../src';
import {configureApp, maconomyMock, tempoMock} from './mock';

/**
 * These tests checks whether the copying of hours from Tempo to Maconomy works,
 * considering mostly the base cases.
 */

const app = configureApp({
    '9343X': '3423/1004',
    '3423-4': '4234/1002'
});

test('copies nothing to Maconomy when no worklogs exist', async t => {
    tempoMock.reset();
    maconomyMock.reset();

    await app.transferHours();

    t.assert(maconomyMock.getLines().length === 0);
    t.end();
});

test('fails when hours are not a multiple of half hours', async t => {
    tempoMock.reset([{
        timeSpentSeconds: 233,
        account: '9343X',
        dateStarted: '2019-03-19T00:00:00.000Z',
        issueKey: 'MYPROJ-34'
    }]);

    try {
        await app.transferHours();
        t.fail('No exception thrown');
    } catch (e) {
        if (e instanceof IncorrectHoursError) {
            t.pass();
        } else {
            throw e;
        }
    }

    t.end();
});

test('creates a new line when given a single worklog', async t => {
    tempoMock.reset([{
        timeSpentSeconds: 1800,
        account: '9343X',
        dateStarted: '2019-03-19T00:00:00.000Z',
        issueKey: 'MYPROJ-34'
    }]);
    maconomyMock.reset();

    await app.transferHours();

    t.assert(maconomyMock.getLines().length === 1);
    t.end();
});

test('registers hours for a single worklog', async t => {
    tempoMock.reset([{
        timeSpentSeconds: 3600,
        account: '9343X',
        dateStarted: '2019-03-19T00:00:00.000Z',
        issueKey: 'MYPROJ-34'
    }]);
    maconomyMock.reset();

    await app.transferHours();

    const lines = maconomyMock.getLines();
    t.equal(lines.length, 1);

    const line = lines[0];
    t.equal(line.hours['2019.03.19'], 1);
    t.equal(line.project, '3423');
    t.equal(line.task, '1004');
    t.end();
});

test('leaves existing Maconomy lines alone', async t => {
    tempoMock.reset([{
        timeSpentSeconds: 3600,
        account: '9343X',
        dateStarted: '2019-03-19T00:00:00.000Z',
        issueKey: 'MYPROJ-34'
    }]);
    maconomyMock.reset([{
        id: 'TimeSheetLine-342',
        project: '1100433',
        task: '1003',
        hours: { '2019-03-19': 3 }
    }]);

    await app.transferHours();

    const lines = maconomyMock.getLines();
    t.equal(lines.length, 2);
    t.assert(
        lines.some(l => l.project === '1100433' && l.hours['2019-03-19'] === 3)
    );
    t.end();
});

test('creates single line for same account', async t => {
    tempoMock.reset([
        {
            timeSpentSeconds: 1800,
            account: '9343X',
            dateStarted: '2019-03-19T00:00:00.000Z',
            issueKey: 'MYPROJ-34'
        },
        {
            timeSpentSeconds: 3600,
            account: '9343X',
            dateStarted: '2019-03-19T00:00:00.000Z',
            issueKey: 'MYPROJ-55'
        },
        {
            timeSpentSeconds: 1800,
            account: '9343X',
            dateStarted: '2019-03-18:00:00.000Z',
            issueKey: 'MYPROJ-55'
        }
    ]);
    maconomyMock.reset();

    await app.transferHours();

    const lines = maconomyMock.getLines();
    t.equal(lines.length, 1);
    t.deepEqual(
        lines[0].hours,
        {
            '2019.03.18': 0.5,
            '2019.03.19': 1.5
        }
    );

    t.end();
});

test('creates multiple lines for different accounts', async t => {
    tempoMock.reset([
        {
            timeSpentSeconds: 1800,
            account: '9343X',
            dateStarted: '2019-03-19T00:00:00.000Z',
            issueKey: 'MYPROJ-34'
        },
        {
            timeSpentSeconds: 3600,
            account: '3423-4',
            dateStarted: '2019-03-19T00:00:00.000Z',
            issueKey: 'MYPROJ-55'
        }
    ]);
    maconomyMock.reset();

    await app.transferHours();

    const lines = maconomyMock.getLines();

    t.assert(
        lines.every(l => (
            l.project === '3423' && l.hours['2019.03.19'] === 0.5 ||
            l.hours['2019.03.19'] === 1
        ))
    );

    t.end();
});

test('logs out from jira when done', async t => {
    tempoMock.reset();
    maconomyMock.reset();
    const logoutCount = tempoMock.getLogoutCount();

    await app.transferHours();

    t.equal(tempoMock.getLogoutCount(), logoutCount + 1);
    t.end();
});
