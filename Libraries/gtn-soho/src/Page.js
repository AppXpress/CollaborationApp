import React, { Component } from 'react';

import {
	StyleSheet,
	ScrollView,
	RefreshControl,
	Modal,
	View
} from 'react-native';

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
						refreshing={this.props.refreshing}
						onRefresh={this.props.onRefresh}
					/>
				}
			>
				{this.props.onRefresh && this.props.refreshing &&
					<Modal
						visible={true}
						transparent={true}
						onRequestClose={() => { }}
					>
						<View style={styles.blockUI}></View>
					</Modal>
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
