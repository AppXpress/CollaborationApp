import React, { Component } from 'react';

import {
	View
} from 'react-native';

import {
	Button,
	Card,
	Navigation,
	Page,
	Switch,
	TextInput,
	Picker,
	Loading
} from '../soho/All';

import {
	AppX,
	Utilities
} from '../gtn/All';

import Environments from '../gtn/Environments';

/**
 * Page component for loggin in
 */
export default class Login extends Component {

	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			eid: '',
			loading: false
		};

		Navigation.set(this, {
			title: ' Welcome',
			buttons: [
				{ icon: 'settings', id: 'settings' }
			]
		});
	}

	settings() {
		this.props.navigator.push({
			screen: 'Settings',
			passProps: { loadEnvironment: () => this.loadEnvironment() }
		});
	}

	willAppear() {
		Navigation.set(this, {
			title: ' Welcome',
			buttons: [
				{ icon: 'settings', id: 'settings' }
			]
		});
	}

	async componentDidMount() {
		this.loadEnvironment();
		if (__DEV__) {
			await this.getCredentials();
		}
	}

	async getCredentials() {
		var username = await Utilities.storageGet('username');
		var password = await Utilities.storageGet('password');
		if (username) {
			this.setState({
				save: true,
				username: username,
				password: password
			});
		}
	}

	async setCredentials() {
		if (this.state.save) {
			await Utilities.storageSet('username', this.state.username);
			await Utilities.storageSet('password', this.state.password);
		}
		else {
			await Utilities.storageSet('username', '');
			await Utilities.storageSet('password', '');
		}
	}

	async loadEnvironment() {
		this.environment = JSON.parse(await Utilities.storageGet('environment'));
		if (!this.environment) {
			this.environment = Environments[0];
		}

		AppX.objects.issue = this.environment.issue;
		AppX.objects.message = this.environment.message;
	}

	/**
	 * Signs in the user with the current username, password, and eid
	 */
	async login(event) {
		this.setState({ loading: true });

		var appx = await AppX.login(this.state.username, this.state.password, this.state.eid, this.environment);

		this.setState({ loading: false });
		if (appx.data) {
			if (__DEV__) {
				this.setCredentials()
			}

			this.props.navigator.resetTo({
				screen: 'IssueList'
			});
		} else {
			setTimeout(() => { alert('Login failed. Please try again.') }, 1000);
		}
	}

	/**
	 * Renders a page with a login fields and a button to submit
	 */
	render() {
		return (
			<Page>
				<Card>
					<TextInput
						label='Username'
						value={this.state.username}
						onChangeText={(text) => this.setState({ username: text })}
						autoCapitalize='none'
						autoFocus={true}
						required
					/>
					<TextInput
						label='Password'
						value={this.state.password}
						onChangeText={(text) => this.setState({ password: text })}
						secureTextEntry={true}
						required
					/>
					<TextInput
						label='EID'
						value={this.state.eid}
						onChangeText={(text) => this.setState({ eid: text })}
						secureTextEntry={true}
						placeholder='Leave Blank if Unnecesary'
					/>
					{__DEV__ &&
						<View>
							<Switch
								label='(DEV) Remember user'
								value={this.state.save}
								onValueChange={(value) => { this.setState({ save: value }) }}
							/>
						</View>
					}
					<Button
						title='Login'
						onPress={this.login.bind(this)}
						disabled={this.state.loading || !this.state.username || !this.state.password}
						primary
					/>
					{this.state.loading &&
						<Loading block />
					}
				</Card>
			</Page>
		);
	}
}
