import Credentials from './Credentials';
import Week from './Week';

interface UserInterface {
    /**
     * Request the week for which hours should be transfered.
     */
    getWeek(): Promise<Week>;

    /**
     * Request the credentials for an application, providing a suggested
     * username.
     */
    getCredentials(application: string, username?: string): Promise<Credentials>;
}

export {
    UserInterface as default
};
