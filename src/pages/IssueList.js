import React, { Component } from 'react';

import {
	FlatList
} from 'react-native';

import {
	AppX
} from '../gtn/All';

import {
	Button,
	Card,
	ComplexText,
	ListItem,
	Loading,
	Navigation,
	Page,
	TextInput,
	Modal,
	Picker,
	Tag
} from '../soho/All';

/**
 * Page component for viewing a list of issues
 */
export default class IssueList extends Component {

	constructor(props) {
		super(props);

		this.props = props;

		this.state = {
			filter: ''
		};

		Navigation.bind(this);

	}

	componentWillMount() {
		this.reload();
	}

	/**
	 * Sets the navigation appearance each time the user returns to the page
	 */
	willAppear() {
		Navigation.set(this, {
			title: 'Issue List',
			buttons: [
				{ icon: 'refresh', id: 'reload' },
				{ icon: 'user', id: 'logout' },
				{ icon: 'add', id: 'create' },
			]
		});
	}

	/**
	 * Returns the user to the login page
	 */
	logout() {
		this.props.navigator.resetTo({ screen: 'Login' });
	}

	/**
	 * Moves to the issue creator page
	 */
	create() {
		this.props.navigator.push({
			screen: 'CreateIssue',
			passProps: {
				reload: () => this.reload()
			}
		});
	}

	/**
	 * Reloads the issue items in the list
	 */
	async reload() {
		this.setState({
			issues: null,
			loading: true
		});

		var appx = await AppX.query(AppX.objects.issue, this.state.filter + ' ORDER BY modifyTimestamp DESC');
		if (appx.data) {
			this.setState({
				fullIssues: appx.data.result,
				issues: appx.data.result
			});
		} else {
			alert('We weren\'t able to load any issues. Please try again later!');
		}

		this.setState({ loading: false });
	}

	/**
	 * Function called by the filter page to set the query for the list
	 * 
	 * @param {string} query the oql query to use when getting issue items
	 */
	setFilter(query) {
		this.state.filter = query
		this.reload();
	}

	/**
	 * Renders an individual issue list item
	 * 
	 * @param {object} issue the issue to display
	 */
	renderIssue(issue) {
		return (
			<ListItem onPress={() => this.props.navigator.push({
				screen: 'IssueDetails',
				passProps: {
					id: issue.uid
				}
			})}>
				<ComplexText
					main={issue.subject}
					secondary={issue.createdBy}
					tertiary={issue.description}
				/>
				<Tag.List>
					<Tag>{issue.modifiedOn}</Tag>
					{issue.issueType && issue.issueType!='0' &&
						<Tag>{getType(issue.issueType)}</Tag>
					}
					{issue.severity && issue.severity!='0' && 
						<Tag alert={getSeverityAlert(issue.severity)}>
							{getSeverity(issue.severity)}
						</Tag>
					}
				</Tag.List>
			</ListItem>
		);
	}

	/**
	 * Renders a list item with a button to go to the filter page, and a flatlist of issue list items
	 */
	render() {
		return (
			<Page>
				<ListItem fill>
					<Button
						icon='filter'
						title='Filter'
						onPress={() => this.props.navigator.push({
							screen: 'FilterIssues',
							passProps: { setFilter: query => this.setFilter(query) }
						})}
					/>
				</ListItem>

				<FlatList
					data={this.state.issues}
					keyExtractor={item => item.uid}
					renderItem={({ item }) => this.renderIssue(item)}
					refreshing={this.state.loading}
				/>

				{this.state.loading &&
					<Loading />
				}
			</Page>
		);
	}
}

function getType(level) {
	if (level == 3) {
		return 'Quality Control';
	}
	if (level == 2) {
		return 'Factory Supply';
	}
	if (level == 1) {
		return 'Shipping';
	}
}

function getSeverity(level) {
	if (level == 3) {
		return 'High';
	}
	if (level == 2) {
		return 'Medium';
	}
	if (level == 1) {
		return 'Low';
	}
}

function getSeverityAlert(level) {
	if (level == 3) {
		return 1;
	}
	if (level == 2) {
		return 3;
	}
	if (level == 1) {
		return 4;
	}
}
