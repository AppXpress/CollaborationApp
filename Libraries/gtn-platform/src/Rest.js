import {
	AsyncStorage
} from 'react-native';

import {
	getEnv
} from './EnvStore';

import base64 from 'base-64';

import RNFetchBlob from 'react-native-fetch-blob'

/**
 * Builder class for performing REST API queries
 */
export default class Rest {

	static wrap = RNFetchBlob.wrap;

	static _token;
	static _credentials;
	static _environment;

	/**
	 * Stores user credentials for use in requests
	 *
	 * @param {string?} user the username
	 * @param {string?} pass the password
	 * @param {string?} eid the eidentity
	 */
	static credentials(user, pass, eid) {
		var auth = user + ':' + pass;
		if (eid) {
			auth += ':' + eid;
		}
		Rest._credentials = base64.encode(auth);
	}

	/**
	 * Creates a new Rest API call
	 */
	constructor() {
		this._url = '';
		this._params = {};
		this._headers = {};

		/**
		 * Combines path and query parameters into a URL
		 */
		this._getUrl = () => {
			var params = '';

			for (var key in this._params) {
				if (params) {
					params += '&';
				}
				params += key + '=' + this._params[key];
			}

			if (!params) {
				return encodeURI(this._url);
			}

			return encodeURI(this._url + '?' + params);
		}

		/**
		 * Sends a REST query to the system and returns the result
		 */
		this._send = async (method, body) => {
			let config = {};
			if (this._ext) {
				config = {
					fileCache: true,
					appendExt: this._ext
				};
			}

			return await RNFetchBlob
				.config(config)
				.fetch(method, this._getUrl(), this._headers, body);
		}

		/**
		 * Runs a REST query using the send command but with additional error handling
		 */
		this._run = async (method, body) => {
			let result = await this._send(method, body);

			// If it returned an auth error, retry
			if (result.info().status == 401) {
				let result = await this.auth(method, body);
			}

			let status = result.info().status;
			if (status < 200 || status >= 300) {
				throw new Error('Rest API call failed');
			}

			return result;
		}
	}

	/**
	 * Populates the query with the default or specified environment and headers
	 * 
	 * @param {string?} url the environment url to use
	 * @param {string?} key the data key to use
	 */
	base() {
		let env = getEnv();
		this._url = env.url;
		this._params['dataKey'] = env.key;
		this._headers['Authorization'] = Rest._token;
		this._headers['Content-Type'] = 'application/json';
		return this;
	}

	/**
	 * Adds a path to the end of the URL
	 * 
	 * @param {string} dir the path segment to add
	 */
	path(dir) {
		this._url += '/' + dir;
		return this;
	}

	/**
	 * Adds a URL parameter to the query
	 * 
	 * @param {string} key the parameter key
	 * @param {string} value the parameter value
	 */
	param(key, value) {
		this._params[key] = value;
		return this;
	}

	/**
	 * Adds a header to the REST query
	 * 
	 * @param {string} key the header key
	 * @param {string} value the header value
	 */
	header(key, value) {
		this._headers[key] = value;
		return this;
	}

	/**
	 * Saves the response body with the specified file extension
	 * 
	 * @param {string} ext the extension to use
	 */
	fileExt(ext) {
		this._ext = ext;
		return this;
	}

	/**
	 * Runs a request and stores the token on completion
	 * 
	 * @param {string} method optional method for controlling request
	 * @param {*} body optional body for sending with the auth request
	 */
	async auth(method, body) {
		this._headers['Authorization'] = 'Basic ' + Rest._credentials;

		var response = await this._send(method || 'GET');
		Rest._token = response.info().headers.Authorization;

		return response;
	}

	/**
	 * Asynchronously runs a get API call and returns the result
	 */
	async get() {
		return await this._run('GET');
	}

	/**
	 * Asynchronously runs a post API call and returns the result
	 * 
	 * @param {*} body the body to run the post request with
	 */
	async post(body) {
		return await this._run('POST', body);
	}
}
