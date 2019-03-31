// tslint:disable-next-line
require('global-tunnel-ng').initialize();

import CliUserInterface from './CliUserInterface';
import FileConfig from './FileConfig';
import MacTempo from './MacTempo';

async function run() {
    const config = new FileConfig();
    const ui = new CliUserInterface();

    await new MacTempo(ui, config).transferHours();
}

run();
