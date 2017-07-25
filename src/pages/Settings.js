import React, { Component } from 'react';

import {
	AsyncStorage
} from 'react-native';

import {
	Button,
	Card,
	Navigation,
	Page,
	TextInput,
	Picker,
} from 'gtn-soho';

import {
	AppX,
	EnvStore
} from 'gtn-platform';

import Environments from '../Environments';

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
		let env = EnvStore.getEnv();

		console.log(env);

		this.setState({
			key: env.key,
			url: env.url,
			thread: env.dictionary['&thread'],
			comment: env.dictionary['&comment']
		});
	}

	async saveSettings() {
		EnvStore.setEnv({
			url: this.state.url,
			key: this.state.key,
			dictionary: {
				'&thread': this.state.thread,
				'&comment': this.state.comment
			}
		});

		this.props.navigator.pop();
	}

	/**
	 * Gets the name of the current environment based on the given values
	 */
	getEnv() {
		var env = Environments.find(item => {
			return item.url == this.state.url &&
				item.key == this.state.key &&
				item.dictionary['&thread'] == this.state.thread &&
				item.dictionary['&comment'] == this.state.comment;
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
				thread: env.dictionary['&thread'],
				comment: env.dictionary['&comment']
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
					<TextInput label='Thread Object Identifier'
						value={this.state.thread}
						onChangeText={(text) => this.setState({ thread: text })}
						autoCapitalize='none'
					/>
					<TextInput label='Comment Object Identifier'
						value={this.state.comment}
						onChangeText={(text) => this.setState({ comment: text })}
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
