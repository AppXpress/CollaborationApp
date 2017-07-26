import React, { Component } from 'react';

import {
	StyleSheet,
	ScrollView,
	RefreshControl,
	View
} from 'react-native';

import Loading from './Loading';

import {
	getColor
} from '../helpers';

/**
 * A page component in SoHo style
 */
export default class Page extends Component {
	constructor(props) {
		super(props);
	}

	/**
	 * Renders a styled scroll view or regular view wrapper for pages
	 */
	render() {
		return (
			<ScrollView
				style={styles.view}
				refreshControl={this.props.onRefresh &&
					<RefreshControl
						refreshing={false}
						onRefresh={this.props.onRefresh}
					/>
				}
			>
				{this.props.onRefresh && this.props.refreshing &&
					<Loading block />
				}

				{this.props.children}
			</ScrollView>
		);
	}
};

const styles = StyleSheet.create({
	view: {
		backgroundColor: getColor('graphite-1')
	},
	blockUI: {
		justifyContent: 'center',
		flex: 1
	}
});
