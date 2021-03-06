import {
	Platform
} from 'react-native';

import {
	translate,
	translateProperty
} from './EnvStore';

import Rest from './Rest';

/**
 * Storage for the environment names of objects
 */
export const objects = {};

/**
 * Authenticate the user with GT Nexus API
 * 
 * @param {string} user the username to authenticate with
 * @param {string} pass the password to authenticate with
 * @param {string} eid the eid to authenticate with
 * @param {object} env the environment to login to
 */
export async function login(user, pass, eid) {
	try {
		Rest.credentials(user, pass, eid);
		await new Rest().base().auth();

		return { data: true };
	} catch (error) {
		console.warn(error);
		return { error: error };
	}
}

/**
 * Fetches an instance of an object from the GT Nexus REST API
 * 
 * @param {string} type the object type to get
 * @param {string} uid the uid of the object to get
 * @param {bool?} meta whether or not to fetch full metadata
 */
export async function fetch(type, uid, meta) {
	type = translate(type);

	try {
		var query = new Rest()
			.base()
			.path(type)
			.path(uid);

		if (meta) {
			query.path('fetch_with_metadata');
		}

		var response = await query.get();

		return { data: await response.json() };
	} catch (error) {
		console.warn(error);
		return { error: error };
	}
}

/**
 * Runs an OQL query on the GT Nexus REST API
 * 
 * @param {string} type the type of object to run the query on
 * @param {string} oql the oql statement to use, or null to get all objects
 * @param {int} limit the number of items to get, or null to get all objects
 * @param {int} offset the offset of items to get, or null to get from 0
 */
export async function query(type, oql, limit, offset) {
	type = translate(type);

	try {
		var query = new Rest()
			.base()
			.path(type)
			.path('query')

		if (oql) {
			query.param('oql', oql);
		}
		if (limit) {
			query.param('limit', limit);
		}
		if (offset) {
			query.param('offset', offset);
		}

		var response = await query.get();

		return { data: await response.json() };
	} catch (error) {
		console.warn(error);
		return { error: error };
	}
}

/**
 * Creates an object on GT Nexus systems
 * 
 * @param {object} data the object data to create
 */
export async function create(data) {
	data.type = translate(data.type);

	try {
		var response = await new Rest()
			.base()
			.path(data.type)
			.post(JSON.stringify(data));

		return { data: await response.json() };
	} catch (error) {
		console.warn(error);
		return { error: error };
	}
}

/**
 * Saves changes in an object to GT Nexus
 * 
 * @param {object} data the data to save
 */
export async function persist(data) {
	data.type = translate(data.type);

	try {
		var response = await new Rest()
			.base()
			.header('If-Match', data.__metadata.fingerprint)
			.path(data.type)
			.path(data.uid)
			.post(JSON.stringify(data));

		var update = await response.json();

		for (let prop in data) {
			delete data[prop];
		}
		Object.assign(data, update.data);

		return { data: data };
	} catch (error) {
		console.warn(error);
		return { error: error };
	}
}

/**
 * Gets an objects design from GT Nexus REST API
 * 
 * @param {string} type the type of object to get the design for
 */
export async function design(type) {
	type = translate(type);

	try {
		var response = await new Rest()
			.base()
			.path(type)
			.get();

		return { data: await response.json() };
	} catch (error) {
		console.warn(error);
		return { error: error };
	}
}

/**
 * Runs the given workflow action on a GT Nexus object
 * 
 * @param {object} data the object to run the action on
 * @param {string} action the workflow action to perform
 */
export async function action(data, action) {
	data.type = translate(data.type);

	try {
		var response = await new Rest()
			.base()
			.header('If-Match', data.__metadata.fingerprint)
			.path(data.type)
			.path(data.uid)
			.path('actionSet')
			.path(action)
			.post(JSON.stringify(data));

		var data = await response.json();

		if (data.transition.message) {
			throw data.transition.message[0].text;
		}

		return { data: data };
	} catch (error) {
		console.warn(error);
		return { error: error };
	}
}


export async function fetchAttachList(type, uid) {
	type = translate(type);

	try {
		var response = await new Rest()
			.base()
			.path(type)
			.path(uid)
			.path('attachment')
			.get();

		return { data: await response.json() };
	} catch (error) {
		console.warn(error);
		return { error: error };
	}
}


export async function fetchAttachment(item) {
	try {
		var query = new Rest()
			.base()
			.path('media')
			.path(item.attachmentUid);

		if (item.mimeType == 'image/jpg') {
			query.fileExt('jpg');
		}
		if (item.mimeType == 'image/png') {
			query.fileExt('png');
		}

		var response = await query.get();

		var type = response.info().headers['Content-Type'];
		var data = await response.path();

		if (Platform.OS == 'android') {
			data = 'file://' + data;
		}

		return { data: data };
	} catch (error) {
		console.warn(error);
		return { error: error };
	}
}

export async function persistAttachment(data, attachment, name, description) {
	data.type = translate(data.type);

	try {
		var response = await new Rest()
			.base()
			.path(data.type)
			.path(data.uid)
			.path('attach')
			.header('Connection', 'Keep-Alive')
			.header('Content-Type', 'application/octect-stream')
			.header('Content-Disposition', `form-data; filename=${name}`)
			.header('Description', description)
			.post(Rest.wrap(attachment));

		return { data: response.json() };
	} catch (error) {
		console.warn(error);
		return { error: error };
	}
}
