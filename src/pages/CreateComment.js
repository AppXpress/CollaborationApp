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

		if (this.props.getComment) {
			this.state.comment = this.props.getComment();
			this.state.text = this.state.comment.Body;
		}
	}

	// Submits the new or edited comment to GTN, creates the comment based on input,
	// then persists or creates depending if were editing or not
	async postComment() {
		this.setState({ loading: true });

		let appx;
		if (this.state.comment) {
			this.state.comment.Body = this.state.text + ' (edited)';
			appx = await AppX.persist(this.state.comment);
		} else {
			let body = {
				type: '&comment',
				Body: this.state.text,
				Parent: {
					reference: 'Thread',
					rootType: '&thread',
					rootId: this.props.getThread().uid,
					externalType: '&thread',
				}
			};

			if (this.props.getReply) {
				body.ReplyTo = {
					rootId: this.props.getReply().uid,
					reference: 'Comment',
					rootType: '&comment'
				};
			}

			appx = await AppX.create(body);
		}

		if (appx.data) {
			if (this.props.getReply) {
				this.props.navigator.pop({ animate: false });
			}
			this.props.navigator.pop();
			this.props.update();
		} else {
			alert('We were\'nt able to save your comment. Please try again later.');
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
						value={this.state.text}
						label='Comment Text'
						onChangeText={(text) => this.setState({ text: text })}
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
