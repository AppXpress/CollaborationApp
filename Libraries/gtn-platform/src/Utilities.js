import {
	AsyncStorage
} from 'react-native';

/**
 * Helper function for getting from async storage
 * 
 * @param {string} key the key of the data to get
 * @returns the data or null on failure
 */
export async function storageGet(key) {
	try {
		return await AsyncStorage.getItem(key);
	} catch (error) {
		console.log(error);
	}
}

/**
 * Helper function for setting async storage data
 * 
 * @param {string} key the key to save the data under
 * @param {*} value the data to save
 */
export async function storageSet(key, value) {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (error) {
		console.log(error);
	}
}
