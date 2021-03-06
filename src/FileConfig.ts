import {existsSync, readFileSync} from 'fs';
import {homedir} from 'os';
import {resolve} from 'path';
import LiteralConfig from './LiteralConfig';

/**
 * Config based on file contents.
 *
 * The file is expected to reside in the user home directory.
 */
class FileConfig extends LiteralConfig {
    constructor() {
        const path = getPath();
        const configCandidate = readJson(path);

        super(configCandidate);
    }
}

function getPath() {
    const path = resolve(homedir(), '.mactempo');

    if (!existsSync(path)) {
        throw new Error(`Could not find config file ${path}`);
    }

    return path;
}

function readJson(path: string): unknown {
    return JSON.parse(
        readFileSync(path, {encoding: 'utf-8'})
    );
}

export default FileConfig;
