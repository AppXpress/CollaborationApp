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
 * Picker component for displaying all organizations in a community
 */
export default class OrgPicker extends Component {
	constructor(props) {
		super(props);

		this.props = props;
		this.state = {
			value: this.props.selectedValue,
			orgs: []
		}

		// Gets the list of organizations
		AppX.query('Community').then(({ data }) => {
			var list = data.result[0].member;
			list.unshift({ name: 'None' });
			return this.setState({ orgs: list });
		});
	}

	componentWillReceiveProps(next) {
		this.setState({ value: next.selectedValue });
	}

	onValueChange(value) {
		this.setState({ value: value });
	}

	/**
	 * Displays the picker with the organizations mapped into a list of picker items
	 */
	render() {
		return (
			<Picker
				{...this.props}
				title='Select an organization'
				selectedValue={this.state.value}
				onValueChange={getHandler(this, 'onValueChange')}
			>
				{this.state.orgs.map(org => (
					<Picker.Item label={org.name} secondary={org.memberId} value={org.memberId} key={'Org' + org.memberId} />
				))}
			</Picker>
		);
	}
}
