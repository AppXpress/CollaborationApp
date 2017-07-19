import React, { Component } from 'react';

import { } from 'react-native';

import {
	Button,
	Card,
	Loading,
	Navigation,
	Page,
	Picker,
	TextInput
} from '../soho/All';

import {
	AppX,
	OrgPicker
} from '../gtn/All';

import {
	IssueList
} from './IssueList.js';

/**
 * Page component for editing or creating issues
 */
export default class CreateIssue extends Component {

	constructor(props) {
		super(props);

		this.state = {};

		Navigation.set(this, {
			title: 'Issue Editor',
			hue: 'amethyst'
		});

		if (this.props.issue) {
			this.state.subject = this.props.issue.subject;
			this.state.issueType = this.props.issue.issueType;
			this.state.severity = this.props.issue.severity;
			this.state.description = this.props.issue.description;
			if (this.props.issue.assignedTo) {
				this.state.assignedTo = this.props.issue.assignedTo.memberId;
			}
		}
	}

	/**
	 * Saves the current issue being edited or creates it if it doesn't exist
	 */
	async persist() {
		this.setState({ loading: true });

		var issue = {};
		if (this.props.issue) {
			for (var key in this.props.issue) {
				issue[key] = this.props.issue[key];
			}
		} else {
			issue.type = AppX.objects.issue;
			issue.licensee = {
				memberId: '5717989018004281'
			};
		}

		issue.subject = this.state.subject;
		issue.issueType = this.state.issueType;
		issue.severity = this.state.severity;
		issue.description = this.state.description;
		issue.assignedTo = { memberId: this.state.assignedTo };

		if (!this.state.issueType) {
			delete issue.issueType;
		}
		if (!this.state.severity) {
			delete issue.severity;
		}
		if (!this.state.assignedTo) {
			delete issue.assignedTo;
		}

		var appx;
		if (this.props.issue) {
			appx = await AppX.persist(issue);
		} else {
			appx = await AppX.create(issue);
		}

		this.setState({ loading: false });

		if (appx.data) {
			this.props.navigator.pop();
			this.props.reload();
		} else {
			setTimeout(() => { alert('Something went wrong!'); }, 800);
		}


	}

	/**
	 * Renders field editors for each property in an issue
	 */
	render() {
		return (
			<Page>
				<Card>
					<TextInput
						label='Subject'
						value={this.state.subject}
						onChangeText={(text) => this.setState({ subject: text })}
					/>
					<TextInput
						label='Description'
						value={this.state.description}
						onChangeText={(text) => this.setState({ description: text })}
						multiline
						rows={5}
					/>
					<Picker
						label='Issue Type'
						title='Select an issue type'
						selectedValue={this.state.issueType}
						onValueChange={(item, index) => this.setState({ issueType: item })}
					>
						<Picker.Item label='None' value={null} />
						<Picker.Item label="Shipping" value='1' />
						<Picker.Item label="Factory Supply" value='2' />
						<Picker.Item label="Quality Control" value='3' />
					</Picker>
					<Picker
						label='Severity'
						title='Select a severity'
						selectedValue={this.state.severity}
						onValueChange={(item, index) => this.setState({ severity: item })}
					>
						<Picker.Item label='None' value={null} />
						<Picker.Item label="Low" value="1" />
						<Picker.Item label="Medium" value="2" />
						<Picker.Item label="High" value="3" />
					</Picker>

					<OrgPicker
						label='Assigned to'
						selectedValue={this.state.assignedTo}
						onValueChange={(item, index) => this.setState({ assignedTo: item })}
					/>

					<Button
						primary
						hue='amethyst'
						title={this.props.issue ? 'Update' : 'Create'}
						onPress={() => this.persist()}
					/>

					{this.state.loading &&
						<Loading block />
					}
				</Card>
			</Page>
		);
	}
}
