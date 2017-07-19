import {
    Navigation
} from 'react-native-navigation';

/**
 *	Entry-point for all devices. Registers all necesarry pages
 *	to the navigation library.
 */
Navigation.registerComponent('Login', () => require('./pages/Login').default);
Navigation.registerComponent('Settings', () => require('./pages/Settings').default);
Navigation.registerComponent('ThreadList', () => require('./pages/ThreadList').default);
Navigation.registerComponent('ThreadView', () => require('./pages/ThreadView').default);

Navigation.startSingleScreenApp({
    screen: {
        screen: 'Login'
    }
});
