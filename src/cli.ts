require('global-tunnel-ng').initialize();

import CliUserInterface from './CliUserInterface';
import FileConfig from './FileConfig';
import Application from './Application';

async function run() {
    const config = new FileConfig();
    const ui = new CliUserInterface();

    await new Application(ui, config).transferHours();
}

run();
