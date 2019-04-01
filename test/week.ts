import test from 'tape';
import {configureApp, maconomyMock, tempoMock} from './mock';

const accountMap = {
    '9343X': '3423/1004'
};

function issueOn(date: string) {
    return {
        timeSpentSeconds: 3600,
        account: '9343X',
        dateStarted: `${date}T00:00:00.000Z`,
        issueKey: 'MYPROJ-34'
    };
}

test('considers sunday the last day of the week', async t => {
    const app = configureApp(accountMap, '2019-03-23');

    maconomyMock.reset();
    tempoMock.reset([
        issueOn('2019-03-18'), // Monday
        issueOn('2019-03-24'), // Sunday
        issueOn('2019-03-25') // Monday
    ]);

    await app.transferHours();

    const [{hours}] = maconomyMock.getLines();
    t.assert(
        '2019.03.18' in hours &&
        '2019.03.24' in hours &&
        !('2019.03.25' in hours)
    );

    t.end();
});

test('supports divided weeks at boundaries between months', async t => {
    const app = configureApp(accountMap, '2019-02-27');

    maconomyMock.reset();
    tempoMock.reset([
        issueOn('2019-02-28'), // Thursday
        issueOn('2019-03-01') // Friday
    ]);

    await app.transferHours();

    const [{hours}] = maconomyMock.getLines();
    t.assert(
        '2019.02.28' in hours &&
        !('2019.03.01' in hours)
    );

    t.end();
});

test('handles coinciding end of week and month', async t => {
    const app = configureApp(accountMap, '2019-03-31');

    maconomyMock.reset();
    tempoMock.reset([
        issueOn('2019-03-24'), // Sunday
        issueOn('2019-03-25'), // Monday
        issueOn('2019-03-31'), // Sunday
        issueOn('2019-04-01') // Monday
    ]);

    await app.transferHours();

    const [{hours}] = maconomyMock.getLines();
    t.assert(
        !('2019.03.24' in hours) &&
        '2019.03.25' in hours &&
        '2019.03.31' in hours &&
        !('2019.04.01' in hours)
    );

    t.end();
});
