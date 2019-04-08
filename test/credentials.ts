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
