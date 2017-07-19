import React, { Component } from 'react';

import {
	AppX
} from '../gtn/All';

import {
	Button,
	Card,
	Field,
	Loading,
	Navigation,
	Page,
	TextInput
} from '../soho/All';

/**
 * Page component for writing messages
 */
export default class CreateMessage extends Component {

	constructor(props) {
		super(props);

		this.state = {};

		Navigation.set(this, {
			title: 'Message Editor',
			hue: 'turquoise'
		});
	}

	/**
	 * Saves a message on the system on the current issue
	 */
	async postMessage() {
		this.setState({ loading: true });

		var body = {
			type: AppX.objects.message,
			createdOn: new Date(),
			text: this.state.message,
			issue: {
				reference: 'Issue',
				rootType: '$IssueT3',
				rootId: this.props.id,
				externalType: '$IssueT3',
			},
			licensee: {
				'memberId': '5717989018004281',
			}
		};

		var appx = await AppX.create(body);

		if (appx.data) {
			this.props.navigator.pop();
			this.props.reload();
		} else {
			alert('We were\'nt able to create your message. Please try again later.');
		}

		this.setState({ loading: false });
	}

	/**
	 * Renders a textbox for typing a message and button to submit
	 */
	render() {
		return (
			<Page>
				<Card>
					<TextInput
						label='Message Text'
						onChangeText={(text) => this.setState({ message: text })}
						multiline
						rows={7}
					/>

					<Button
						primary
						hue='turquoise'
						title='Submit'
						onPress={this.postMessage.bind(this)}
					/>

					{this.state.loading &&
						<Loading block />
					}
				</Card>
			</Page>
		);
	}
}
