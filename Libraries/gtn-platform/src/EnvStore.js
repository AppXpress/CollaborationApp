import {
    AsyncStorage
} from 'react-native'

let environments = [];
let active;

AsyncStorage.getItem('environment').then(data => {
    active = data ? JSON.parse(data) : null;
});

export function translate(value) {
    let dictionary = getEnv().dictionary || {};
    if (value in dictionary) {
        return dictionary[value];
    }
    return value;
}

export function translateProperty(object, property) {
    object[property] = translate(object[property]);
}

export function getEnv() {
    return active || environments[0];
}

export function setEnv(env) {
    active = env;
    AsyncStorage.setItem('environment', JSON.stringify(env));
}

export function getEnvList() {
    return environments;
}

export function setEnvList(data) {
    environments = data;
}
