import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	ListView,
	Text,
	TextInput as TextInputBase
} from 'react-native';

import {
	Picker
} from '../soho/All';

import {
	getHandler
} from '../soho/Tools';

import * as AppX from './AppX';

/**
 * Picker component for displaying all users in a community
 */
export default class UserPicker extends Component {
	constructor(props) {
		super(props);

		this.props = props;
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
				onValueChange={getHandler(this, 'onValueChange')}
			>
				{this.state.users.map(user => (
					<Picker.Item label={user.login} value={user.uid} key={user.uid} />
				))}
			</Picker>
		);
	}
}
