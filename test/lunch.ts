import test from 'tape';
import {configureApp, maconomyMock, tempoMock} from './mock';

const config = {
    accountMap: {
        '9343X': '3423/1004',
        '3423-4': '4234/1002'
    },
    lunch: {
        account: '1043/1004',
        seconds: 1800,
        minWorkSeconds: 6 * 3600,
        description: 'Lunch'
    }
};

test('does not add lunch when no hours are logged', async t => {
    const app = configureApp(config);

    await app.transferHours();

    t.assert(maconomyMock.getLines().length === 0);
    t.end();
});

test('does not add lunch when too few hours are logged', async t => {
    const app = configureApp(config);
    tempoMock.reset([{
        timeSpentSeconds: 3600,
        account: '9343X',
        dateStarted: '2019-03-19T00:00:00.000Z',
        issueKey: 'MYPROJ-34'
    }]);

    await app.transferHours();

    t.assert(maconomyMock.getLines().length === 1);
    t.end();
});

test('adds lunch when enough hours are logged for one account', async t => {
    const app = configureApp(config);
    tempoMock.reset([{
        timeSpentSeconds: 6 * 3600,
        account: '9343X',
        dateStarted: '2019-03-19T00:00:00.000Z',
        issueKey: 'MYPROJ-34'
    }]);

    await app.transferHours();

    const lines = maconomyMock.getLines();
    t.equal(lines.length, 2);
    t.assert(
        lines.some(
            l => l.project === '1043' &&
                l.hours['2019.03.19'] === 0.5 &&
                l.description === 'Lunch'
        )
    );
    t.end();
});

test('adds lunch when enough hours are logged in total', async t => {
    const app = configureApp(config);
    tempoMock.reset([
        {
            timeSpentSeconds: 3 * 3600,
            account: '9343X',
            dateStarted: '2019-03-19T00:00:00.000Z',
            issueKey: 'MYPROJ-34'
        },
        {
            timeSpentSeconds: 4 * 3600,
            account: '3423-4',
            dateStarted: '2019-03-19T00:00:00.000Z',
            issueKey: 'MYPROJ-35'
        }
    ]);

    await app.transferHours();

    const lines = maconomyMock.getLines();
    t.equal(lines.length, 3);
    t.assert(
        lines.some(l => l.project === '1043' && l.hours['2019.03.19'] === 0.5)
    );
    t.end();
});

test('considers each day separately when adding lunch', async t => {
    const app = configureApp(config);
    tempoMock.reset([
        {
            timeSpentSeconds: 8 * 3600,
            account: '9343X',
            dateStarted: '2019-03-19T00:00:00.000Z',
            issueKey: 'MYPROJ-34'
        },
        {
            timeSpentSeconds: 7 * 3600,
            account: '9343X',
            dateStarted: '2019-03-21T00:00.000Z',
            issueKey: 'MYPROJ-34'
        },
        {
            timeSpentSeconds: 3 * 3600,
            account: '9343X',
            dateStarted: '2019-03-18T00:00.000Z',
            issueKey: 'MYPROJ-34'
        }
    ]);

    await app.transferHours();

    const lines = maconomyMock.getLines();
    t.assert(
        lines.some(
            l => l.project === '1043' &&
                !('2019.03.18' in l.hours) &&
                l.hours['2019.03.19'] === 0.5 &&
                l.hours['2019.03.21'] === 0.5 &&
                !('2019.03.20' in l.hours)
        )
    );
    t.end();
});
