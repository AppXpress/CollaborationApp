import {
	AsyncStorage
} from 'react-native';

import {
	storageGet,
	storageSet,
	base64Encode
} from './Utilities';

import RNFetchBlob from 'react-native-fetch-blob'

const Fetch = RNFetchBlob.polyfill.Fetch

window.fetch = new Fetch({
	auto: true,
	binaryContentTypes: ['image/']
}).build()

/**
 * Builder class for performing REST API queries
 */
export default class Rest {

	static wrap = RNFetchBlob.wrap;

	static _token;
	static _credentials;
	static _environment;

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
		 * Runs a REST query on the system and returns the result
		 */
		this._run = async (method, body) => {
			var config = {};
			if (this._ext) {
				config = {
					fileCache: true,
					appendExt: this._ext
				};
			}

			var result = await RNFetchBlob
				.config(config)
				.fetch(method, this._getUrl(), this._headers, body);

			// Re-auths Retries if this is not an auth request and it hasn't retried already
			if (!this._auth && !this._retry && result.info().status == 401) {
				this._retry = true;
				await new Rest().base().auth();
				return await this._run(method, body);
			}

			if (result.info().status < 200 || result.info().status >= 300) {
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
	base(url, key) {
		if (url && key) {
			Rest._url = url;
			Rest._key = key;
		}

		this._url = Rest._url;
		this._params['dataKey'] = Rest._key;
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
	 * Authenticate the user with the previous or specified credentials
	 * 
	 * @param {string?} user the username
	 * @param {string?} pass the password
	 * @param {string?} eid the eidentity
	 */
	async auth(user, pass, eid) {
		if (user && pass) {
			var auth = user + ':' + pass;
			if (eid) {
				auth += ':' + eid;
			}
			Rest._credentials = base64Encode(auth);
		}

		this._auth = true;
		this._headers['Authorization'] = 'Basic ' + Rest._credentials;

		var response = await this._run('GET');
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
