import React, { Component } from 'react';

import {
	StyleSheet,
	ScrollView,
	View
} from 'react-native';

import {
	getColor
} from './Tools';

/**
 * A page component in SoHo style
 */
export default class Page extends Component {
	constructor(props) {
		super(props);

		this.props = props;
	}

	/**
	 * Renders a styled scroll view or regular view wrapper for pages
	 */
	render() {
		if (this.props.fill) {
			return (
				<View style={[styles.view, styles.fill]}>
					{this.props.children}
				</View>
			);
		} else {
			return (
				<ScrollView style={styles.view}>
					{this.props.children}
				</ScrollView>
			);
		}
	}
};

const styles = StyleSheet.create({
	view: {
		backgroundColor: getColor('graphite-1')
	},
	fill: {
		flex: 1,
		alignItems: 'stretch'
	}
});
