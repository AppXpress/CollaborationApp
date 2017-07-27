import React, { Component } from 'react';

import {
	StyleSheet,
	View
} from 'react-native';

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
	ListItem,
	helpers
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

		if (this.props.getReply) {
			this.state.reply = this.props.getReply();
		}
	}

	// Submits the new or edited comment to GTN, creates the comment based on input,
	// then persists or creates depending if were editing or not
	async postComment() {
		this.setState({ loading: true });

		let appx;
		if (this.state.text.length > 10000){
			alert("Sorry, text postings are only supported up to 10000 characters, yours is "+this.state.text.length+".");
		} else {
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
	}
	this.setState({ loading: false });
}

	render() {
		return (
			<Page>
				<Card>
					{this.state.reply &&
						<View style={styles.reply}>
							<ComplexText
								secondary={this.state.reply.Author + ' of ' + this.state.reply.AuthorOrg}
								tertiary={this.state.reply.Date + ' at ' + helpers.formatTime(this.state.reply.Time)}
							/>
							<ComplexText main={this.state.reply.Body} />
						</View>
					}

					<TextInput
						label='Comment Text'
						value={this.state.text}
						onChangeText={(text) => this.setState({ text: text })}
						multiline
						rows={7}
					/>

					<Button
						title='Submit'
						hue='turquoise'
						primary
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

const styles = StyleSheet.create({
	reply: {
		margin: 10,
		padding: 10,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		borderColor: helpers.getColor('graphite-3'),
		borderWidth: 1
	}
});
