import {
    AsyncStorage
} from 'react-native'

let environments = [];
let active;

// Loads saved environment when the file is run
AsyncStorage.getItem('environment').then(data => {
    active = data ? JSON.parse(data) : null;
});

/**
 * Returns the translated value for the property or the original value
 *
 * @param {string} value the value to translate
 */
export function translate(value) {
    let dictionary = getEnv().dictionary || {};
    if (value in dictionary) {
        return dictionary[value];
    }
    return value;
}

/**
 * Gets the current selected environment
 */
export function getEnv() {
    return active || environments[0];
}

/**
 * Switches to the given environment
 *
 * @param {object} env the new environment to use
 */
export function setEnv(env) {
    active = env;
    AsyncStorage.setItem('environment', JSON.stringify(env));
}

/**
 * Gets a list of environments available
 */
export function getEnvList() {
    return environments;
}

/**
 * Sets the available environments
 *
 * @param {array} data a list of environment objects
 */
export function setEnvList(data) {
    environments = data;
}
