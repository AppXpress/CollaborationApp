import React, { Component } from 'react';

import {
	AppX
} from 'gtn-platform';

import {
	Button,
	Card,
	Field,
	Loading,
	Navigation,
	Page,
	TextInput
} from 'gtn-soho';

export default class CreateComment extends Component {

	constructor(props) {
		super(props);

		this.state = {};

		Navigation.set(this, {
			title: 'Comment Editor',
			hue: 'turquoise'
		});
	}

	async postComment() {
		this.setState({ loading: true });

		var body = {
			type: '$CCCommentT1',
			Date: new Date(),
			Body: this.state.comment,
			Parent: {
				reference: 'Thread',
				rootType: '$CCThreadT1',
				rootId: this.props.id,
				externalType: '$CCThreadT1',
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
			alert('We were\'nt able to create your comment. Please try again later.');
		}

		this.setState({ loading: false });
	}

	render() {
		return (
			<Page>
				<Card>
					<TextInput
						label='Comment Text'
						onChangeText={(text) => this.setState({ comment: text })}
						multiline
						rows={7}
					/>

					<Button
						primary
						hue='turquoise'
						title='Submit'
						onPress={() => this.postComment()}
					/>

					{this.state.loading &&
						<Loading block />
					}
				</Card>
			</Page>
		);
	}
}
