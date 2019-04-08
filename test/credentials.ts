import test from 'tape';
import {configureApp, uiMock} from './mock';

test('requests credentials from ui', async t => {
    const app = configureApp({});

    await app.transferHours();

    const calls = uiMock.getCalls();
    t.equals(calls.length, 2);
    t.assert(calls.some(call => call.application === 'Maconomy'));
    t.assert(calls.some(call => call.application === 'Jira'));
    t.end();
});

test('provides no default username without explicit config', async t => {
    const app = configureApp({});

    await app.transferHours();

    t.assert(
        uiMock.getCalls().every(call => call.username === undefined)
    );
    t.end();
});

test('provides username from maconomy config when requesting credentials', async t => {
    const app = configureApp({
        maconomy: { username: 'truls' }
    });

    await app.transferHours();

    t.assert(
        uiMock.getCalls().some(
            call => call.application === 'Maconomy' && call.username === 'truls'
        ),
        'ui should be called with username for maconomy'
    );
    t.end();
});

test('provides username from maconomy config when requesting credentials', async t => {
    const app = configureApp({
        jira: { username: 'nils' }
    });

    await app.transferHours();

    t.assert(
        uiMock.getCalls().some(
            call => call.application === 'Jira' && call.username === 'nils'
        ),
        'ui should be called with username for Jira'
    );
    t.end();
});
