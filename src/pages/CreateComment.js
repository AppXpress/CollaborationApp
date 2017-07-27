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
	TextInput,
	ComplexText,
	ListItem
} from 'gtn-soho';

export default class CreateComment extends Component {

	constructor(props) {
		super(props);

		this.state = {};

		Navigation.set(this, {
			title: 'Comment Editor',
			hue: 'turquoise'
		});

		if (this.props.comment) {
			this.state = { comment: this.props.comment.Body };
		}
	}

	// Submits the new or edited comment to GTN, creates the comment based on input,
	// then persists or creates depending if were editing or not
	async postComment() {
		this.setState({ loading: true });

		if (!this.props.comment) {  //if new comment
			var body = {
				type: '&comment',
				Date: new Date(),  //today
				Body: this.state.comment,
				Parent: {
					reference: 'Thread',
					rootType: '&thread',
					rootId: this.props.id,
					externalType: '&thread',
				},
				licensee: {
					'memberId': '5717989018004281',
				}
			};
		} else {
			var editBody = JSON.parse(JSON.stringify(this.props.comment));;  //make JSON object from comment being edited
			editBody.Body = this.state.comment + ' (edited)';
		}

		if (this.props.replyTo) {  //if replying to a comment
			body.ReplyTo = {
				rootId: this.props.replyTo,
				reference: 'Comment',
				rootType: '&comment',
				externalType: '&comment',
			};
		}

		if (this.props.comment) {
			var appx = await AppX.persist(editBody);
		} else {
			var appx = await AppX.create(body);
		}


		if (appx.data) {
			if (this.props.replyTo || this.props.comment) {
				this.props.navigator.pop({ animated: false });
				this.props.navigator.pop();
				this.props.reload();
			} else {
				this.props.navigator.pop();
				this.props.reload();
			}
		} else {
			alert('We were\'nt able to create your comment. Please try again later.');
		}

		this.setState({ loading: false });
	}

	render() {
		return (
			<Page>
				<Card>
					{this.props.replyBody &&
						<ListItem>
							<ComplexText
								main="Replying To:"
								secondary={this.props.replyBody}
								tertiary={this.props.replyAuthor}
							/>
						</ListItem>
					}
					<TextInput
						value={this.state.comment}
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
