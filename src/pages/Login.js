import React, { Component } from 'react';

import {
	AsyncStorage,
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
} from 'gtn-soho';

import {
	AppX
} from 'gtn-platform';

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
			screen: 'Settings'
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
		if (__DEV__) {
			await this.getCredentials();
		}
	}

	//Gets username and pw from storage if in dev mode
	async getCredentials() {
		var username = await AsyncStorage.getItem('username');
		var password = await AsyncStorage.getItem('password');
		if (username) {
			this.setState({
				save: true,
				username: username,
				password: password
			});
		}
	}

	//Sets User login and organization for later use in voting etc.
	async setUserData() {
		var userinfo;
		await AppX.fetch('User', 'self').then(async result => {
			var info = result.data;
			global.userLogin = info.login;

			await AppX.fetch('OrganizationDetail', info.organizationUid).then(result => {
				global.userOrgName = result.data.name;
			});

		});
	}

	//Saves username and pw if in dev mode
	async setCredentials() {
		if (this.state.save) {
			await AsyncStorage.setItem('username', this.state.username);
			await AsyncStorage.setItem('password', this.state.password);
		}
		else {
			await AsyncStorage.setItem('username', '');
			await AsyncStorage.setItem('password', '');
		}
	}

	/**
	 * Signs in the user with the current username, password, and eid
	 */
	async login(event) {
		this.setState({ loading: true });

		var appx = await AppX.login(this.state.username, this.state.password, this.state.eid, this.environment);

		this.setUserData();
		this.setState({ loading: false });
		if (appx.data) {
			if (__DEV__) {
				this.setCredentials()
			}

			this.props.navigator.resetTo({
				screen: 'ThreadList'
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
					/>
					<TextInput
						label='Password'
						value={this.state.password}
						onChangeText={(text) => this.setState({ password: text })}
						secureTextEntry={true}
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
						disabled={!this.state.username || !this.state.password}
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
