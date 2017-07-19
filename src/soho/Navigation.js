import {
    Platform
} from 'react-native';

import {
    getColor
} from './Tools';

import Icon from './Icon';

/**
 * Helper function for binding page functions to navigation events
 * 
 * @param {object} page the page to bind navigation events on
 */
export function bind(page) {
    page.props.navigator.setOnNavigatorEvent(event => {
        if (page[event.id]) {
            page[event.id]();
        }
    });
}

/**
 * Helper function for setting navigation styles and options
 * 
 * @param {object} page the page to set the nav styles on
 * @param {object} config the styles to apply to the page
 */
export function set(page, config) {
    if (!config) {
        config = {};
    }
    if (!config.buttons) {
        config.buttons = [];
    }

    page.props.navigator.setTitle({ title: config.title });

    var style = {
        navBarTextFontFamily: 'soho',
        navBarSubtitleFontFamily: 'soho',
        navBarTextColor: getColor('white-0'),
        navBarButtonColor: getColor('white-0')
    };

    if (config.clear) {
        Object.assign(style, {
            navBarTranslucent: true,
            drawUnderNavBar: true,
            navBarBlur: true
        });
    } else {
        Object.assign(style, {
            navBarBackgroundColor: getColor(config.hue + '-7', 'azure-7'),
            statusBarColor: getColor(config.hue + '-8', 'azure-8'),
        });
    }

    page.props.navigator.setStyle(style);

    var buttons = [];
    config.buttons.map(button => {
        buttons.push({
            title: getTitle(button, buttons),
            id: button.id,
            buttonFontFamily: 'soho',
            showAsAction: buttons.length == 0 ? 'always' : 'never'
        });
    });

    page.props.navigator.setButtons({ rightButtons: buttons.reverse() });

    page.props.navigator.setOnNavigatorEvent(event => {
        if (page[event.id]) {
            page[event.id]();
        }
    });
}

/**
 * Helper for getting the right button title based on platform and button count
 * 
 * @param {object} button the current button to get the title for
 * @param {object[]} buttons the list of buttons
 */
function getTitle(button, buttons) {
    if (Platform.OS == 'android' && buttons.length > 0) {
        return Icon.getChar(button.icon) + '   ' + button.id.charAt(0).toUpperCase() + button.id.substring(1);
    } else {
        return Icon.getChar(button.icon);
    }
}
