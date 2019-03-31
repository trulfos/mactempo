import {password, prompt} from 'promptly';
import UserInterface from './UserInterface';
import Week from './Week';

const greeting = `
 __  __           _____
|  \\/  | __ _  __|_   _|__ _ __ ___  _ __   ___
| |\\/| |/ _\` |/ __|| |/ _ \\ '_ \` _ \\| '_ \\ / _ \\
| |  | | (_| | (__ | |  __/ | | | | | |_) | (_) |
|_|  |_|\\__,_|\\___||_|\\___|_| |_| |_| .__/ \\___/
                                    |_|
-------------------------------------------------
Your highway from Tempo to Maconomy. Please remember
to double check the hours after import and remember
that existing hours for the mapped accounts will be
replaced.

Have fun!
`;

// TODO: Rename (command line interface user interface??)
// tslint:disable:no-console
class CliUserInterface implements UserInterface {
    constructor() {
        console.log(greeting);
    }

    public async getWeek() {
        console.log('\nPlease provide a date in the week you wish to copy');

        return new Week(
            await this.getDate('Date in week')
        );
    }

    public async getCredentials(applicationName: string) {
        console.log(`\nPlease provide your credentials for ${applicationName}`);

        return {
            password: await password('Password: '),
            username: await prompt('Username: ')
        };
    }

    private async getDate(message: string) {
        const defaultValue = new Date().toISOString().split('T')[0];

        const config = {
            default: defaultValue,
            validator: dateValidator
        };

        return await prompt(`${message} [${defaultValue}]: `, config);
    }
}

function dateValidator(value: string) {
    if (isNaN(Date.parse(value))) {
        throw new Error('The provided date is not valid. Expected: YYYY-MM-DD');
    }

    return new Date(value);
}

export default CliUserInterface;
