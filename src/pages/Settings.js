import React, { Component } from 'react';

import {
	Button,
	Card,
	Navigation,
	Page,
	TextInput,
	Picker,
} from '../soho/All';

import {
	AppX,
	Utilities
} from '../gtn/All';

import Environments from '../gtn/Environments';

/**
 * Page component for choosing settings, such as global object and environment
 */
export default class Settings extends Component {

	constructor(props) {
		super(props);

		this.state = {};

		Navigation.set(this, {
			title: 'Settings'
		});
	}

	async componentDidMount() {
		var env = JSON.parse(await Utilities.storageGet('environment'));
		if (!env) {
			env = Environments[0];
		}

		this.setState({
			key: env.key,
			url: env.url,
			issue: env.issue,
			message: env.message
		});
	}

	async saveSettings() {
		await Utilities.storageSet('environment', JSON.stringify({
			url: this.state.url,
			key: this.state.key,
			issue: this.state.issue,
			message: this.state.message
		}));

		await this.props.loadEnvironment();
		this.props.navigator.pop();
	}

	/**
	 * Gets the name of the current environment based on the given values
	 */
	getEnv() {
		var env = Environments.find(item => {
			return item.url == this.state.url &&
				item.key == this.state.key &&
				item.issue == this.state.issue &&
				item.message == this.state.message;
		});

		if (env) {
			return env.name;
		}
	}

	/**
	 * Sets the envrionment based on the name
	 * 
	 * @param {string} name the new environment name
	 */
	setEnv(name) {
		var env = Environments.find(item => item.name == name);

		if (env) {
			this.setState({
				url: env.url,
				key: env.key,
				issue: env.issue,
				message: env.message
			});
		}
	}

	/**
	 * Displays a settings page with fields for environment varaibles and a save button
	 */
	render() {
		return (
			<Page>
				<Card>
					<Picker
						label='Environment'
						title='Select an Environment'
						selectedValue={this.getEnv()}
						onValueChange={name => this.setEnv(name)}
					>
						{Environments.map(item =>
							<Picker.Item label={item.name} key={item.name} value={item.name} />
						)}
					</Picker>

					<TextInput label='REST API URL'
						value={this.state.url}
						onChangeText={(text) => this.setState({ url: text })}
						autoCapitalize='none'
					/>
					<TextInput label='REST API Data Key'
						value={this.state.key}
						onChangeText={(text) => this.setState({ key: text })}
						autoCapitalize='none'
					/>
					<TextInput label='Issue Object Identifier'
						value={this.state.issue}
						onChangeText={(text) => this.setState({ issue: text })}
						autoCapitalize='none'
					/>
					<TextInput label='Message Object Identifier'
						value={this.state.message}
						onChangeText={(text) => this.setState({ message: text })}
						autoCapitalize='none'
					/>

					<Button
						primary
						title='Save'
						icon='save'
						onPress={() => this.saveSettings()}
					/>
				</Card>
			</Page>
		);
	}
}
