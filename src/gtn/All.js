module.exports = {
	get AppX() { return require('./AppX') },
	get OrgPicker() { return require('./OrgPicker').default },
	get UserPicker() { return require('./UserPicker').default },
	get Utilities() { return require('./Utilities') }
};
