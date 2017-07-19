/**
 * Gets a function that runs a property callback in the component and on the parent
 * 
 * @param {object} obj the component to run the callback on
 * @param {string} name the name of the callback to run
 */
export function getHandler(obj, name) {
	return function () {
		if (obj.props[name]) {
			obj.props[name](...arguments);
		}
		if (obj[name]) {
			obj[name](...arguments);
		}
	}
}

/**
 * Gets a SoHo color by name
 * 
 * @param {string} name the name of the color to get
 * @param {string[]} args other names to lookup if the previous names couldn't be found
 */
export function getColor(name, ...args) {
	if (typeof name == 'string') {
		var data = name.split('-');

		if (data.length == 2) {
			var hue = data[0].charAt(0).toUpperCase() + data[0].slice(1);
			var value = parseInt(data[1]);

			if (colors[hue] && colors[hue][value]) {
				return colors[hue][value];
			}
		}
	}

	// Return default color if name was invalid
	if (args && args.length > 0) {
		return getColor(...args);
	}

	throw 'SoHo getColor: color could not be found';
}

const colors = {
	Ruby: {
		1: '#F4BCBC',
		2: '#EB9D9D',
		3: '#DE8181',
		4: '#D26D6D',
		5: '#C65F5F',
		6: '#B94E4E',
		7: '#AD4242',
		8: '#A13030',
		9: '#941E1E',
		10: '#880E0E'
	},
	Amber: {
		1: '#FBE9BF',
		2: '#F8E09C',
		3: '#F6D67B',
		4: '#F4C951',
		5: '#F2BC41',
		6: '#EFA836',
		7: '#EE9A36',
		8: '#E4882B',
		9: '#DB7726',
		10: '#D66221'
	},
	Emerald: {
		1: '#D5F6C0',
		2: '#C3E8AC',
		3: '#AFDC91',
		4: '#9CCE7C',
		5: '#89BF65',
		6: '#76B051',
		7: '#66A140',
		8: '#56932A',
		9: '#488421',
		10: '#397514'
	},
	Azure: {
		1: '#CBEBF4',
		2: '#ADD8EB',
		3: '#8DC9E6',
		4: '#69B5DD',
		5: '#54A1D3',
		6: '#368AC0',
		7: '#2578A9',
		8: '#1D5F8A',
		9: '#134D71',
		10: '#133C59'
	},
	Turquoise: {
		1: '#C0EDE3',
		2: '#A9E1D6',
		3: '#8ED1C6',
		4: '#7CC0B5',
		5: '#69ADA3',
		6: '#579E95',
		7: '#448D83',
		8: '#317C73',
		9: '#206B62',
		10: '#0E5B52'
	},
	Amethyst: {
		1: '#EDE3FC',
		2: '#DACCEC',
		3: '#C7B4DB',
		4: '#B59ECA',
		5: '#A38DB7',
		6: '#9279A6',
		7: '#806594',
		8: '#6E5282',
		9: '#5D3E70',
		10: '#4B2A5E'
	},
	Slate: {
		1: '#DEE1E8',
		2: '#C8CBD4',
		3: '#ABAEB7',
		4: '#888B94',
		5: '#656871',
		6: '#50535A',
		7: '#414247',
		8: '#313236',
		9: '#212224',
		10: '#1C1819'
	},
	Graphite: {
		1: '#F0F0F0',
		2: '#D8D8D8',
		3: '#BDBDBD',
		4: '#999999',
		5: '#737373',
		6: '#5C5C5C',
		7: '#454545',
		8: '#383838',
		9: '#292929',
		10: '#1A1A1A'
	},
	Alert: {
		1: '#E84F4F',
		2: '#FF9426',
		3: '#FFD726',
		4: '#80CE4D'
	},

	// The following are not defined in the SoHo color palettes
	// But are used frequently so I listed them here for re-use
	White: {
		0: '#FFFFFF'
	},
	Black: {
		0: '#000000'
	}
}
