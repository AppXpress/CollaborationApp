import { Navigation } from 'react-native-navigation';

import Login from './pages/Login';
import IssueList from './pages/IssueList';
import FilterIssues from './pages/FilterIssues';
import IssueDetails from './pages/IssueDetails';
import CreateIssue from './pages/CreateIssue';
import CreateMessage from './pages/CreateMessage';
import CameraScreen from './pages/CameraScreen';
import CameraDisplay from './pages/CameraDisplay';
import Settings from './pages/Settings';

/**
*	Entry-point for all devices. Registers all necesarry pages
*	to the navigation library.
*/
Navigation.registerComponent('Login', () => Login);
Navigation.registerComponent('IssueList', () => IssueList);
Navigation.registerComponent('FilterIssues', () => FilterIssues)
Navigation.registerComponent('IssueDetails', () => IssueDetails);
Navigation.registerComponent('CreateIssue', () => CreateIssue);
Navigation.registerComponent(
    'ImageDisplay', () => require('./pages/ImageDisplay').default
);
Navigation.registerComponent('CreateMessage', () => CreateMessage);
Navigation.registerComponent('CameraScreen', () => CameraScreen);
Navigation.registerComponent('CameraDisplay', () => CameraDisplay);
Navigation.registerComponent('Settings', () => Settings);


Navigation.startSingleScreenApp({
    screen: { screen: 'Login' }
});
