module.exports = {
	get AppX() { return require('./src/AppX') },
	get OrgPicker() { return require('./src/OrgPicker').default },
	get UserPicker() { return require('./src/UserPicker').default },
	get Utilities() { return require('./src/Utilities') }
};
