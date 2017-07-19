import {
    Navigation
} from 'react-native-navigation';

import Login from './pages/Login';
import Settings from './pages/Settings';

/**
 *	Entry-point for all devices. Registers all necesarry pages
 *	to the navigation library.
 */
Navigation.registerComponent('Login', () => Login);
Navigation.registerComponent('Settings', () => Settings);


Navigation.startSingleScreenApp({
    screen: {
        screen: 'Login'
    }
});
