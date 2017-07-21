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

/**
 * Encodes a string into its base 64 representation
 * 
 * @param {string} toEncode the string to encode
 * @returns the base 64 value
 */
export function base64Encode(toEncode) {

	var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var padding = "";
	var encodedString = "";

	//checking if credential string has length of multiple of 3
	if ((toEncode.length % 3) > 0) {
		var i = (toEncode.length % 3);
		for (; i < 3; i++) {
			padding += "=";
			toEncode += "\0";
		}
	}

	//iterating through all triplets in input string
	for (var i = 0; i < toEncode.length; i += 3) {

		//every triplet gets mapped to a 24 bit number
		var n = (toEncode.charCodeAt(i) << 16) + (toEncode.charCodeAt(i + 1) << 8) + (toEncode.charCodeAt(i + 2));

		//this new number gets seperated into four 6 bit numbers
		n = [(n >>> 18) & 63, (n >>> 12) & 63, (n >>> 6) & 63, n & 63];

		//use new numbers as indices from base64 char list
		encodedString += base64chars[n[0]] + base64chars[n[1]] + base64chars[n[2]] + base64chars[n[3]];

	}
	encodedString = encodedString.substring(0, encodedString.length - padding.length) + padding;

	//to create final token add "Basic "

	return encodedString;

}
