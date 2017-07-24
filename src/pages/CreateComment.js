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

		if(this.props.comment){
			this.state = {comment: this.props.comment.Body};
		}
	}

	async postComment() {
		this.setState({ loading: true });
		
		if(!this.props.comment){
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
		}else{
			var editBody = JSON.parse(JSON.stringify(this.props.comment));;
			editBody.Body = this.state.comment +' (edited)';
		}

		if(this.props.replyTo){
			body.ReplyTo = {
				rootId : this.props.replyTo,
				reference: 'Comment',
				rootType: '$CCCommentT1',
				externalType: '$CCCommentT1',
			};
		}

		if(this.props.comment){
			var appx = await AppX.persist(editBody);
		}else{
		console.log(body);
		var appx = await AppX.create(body);
		}

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
