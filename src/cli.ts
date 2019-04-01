// tslint:disable-next-line
require('global-tunnel-ng').initialize();

import CommandLineUserInterface from './CommandLineUserInterface';
import FileConfig from './FileConfig';
import MacTempo from './MacTempo';

async function run() {
    const config = new FileConfig();
    const ui = new CommandLineUserInterface();

    await new MacTempo(ui, config).transferHours();
}

run();
