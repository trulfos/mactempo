import Credentials from './Credentials';
import Week from './Week';

interface UserInterface {
    getWeek(): Promise<Week>;
    getCredentials(application: string): Promise<Credentials>;
}

export {
    UserInterface as default
};
