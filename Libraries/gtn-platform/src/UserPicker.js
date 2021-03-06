import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	ListView,
	Text,
	TextInput as TextInputBase
} from 'react-native';

import {
	Picker,
	helpers
} from 'gtn-soho';

import * as AppX from './AppX';

/**
 * Picker component for displaying all users in a community
 */
export default class UserPicker extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: this.props.selectedValue,
			users: []
		}

		// Gets the list of users
		AppX.query('User').then(({ data }) => this.setState({ users: data.result }));
	}

	componentWillReceiveProps(next) {
		this.setState({ value: next.selectedValue });
	}

	onValueChange(value) {
		this.setState({ value: value });
	}

	/**
	 * Displays the picker with the users mapped into a list of picker items
	 */
	render() {
		return (
			<Picker
				{...this.props}
				title='Select a user'
				selectedValue={this.state.value}
				onValueChange={helpers.getHandler(this, 'onValueChange')}
			>
				{this.state.users.map(user => (
					<Picker.Item label={user.login} value={user.uid} key={user.uid} />
				))}
			</Picker>
		);
	}
}
