import {
    AsyncStorage
} from 'react-native'

let environments = [];
let dictionary = {};

export function translate(value) {
    if (value in dictionary) {
        return dictionary[value];
    }
    return value;
}

export function translateProperty(object, property) {
    object[property] = translate(object[property]);
}

export function getEnv() {

}

export function getEnvList() {
    return environments;
}


export function loadEnvList(data) {
    environments = data;
}
