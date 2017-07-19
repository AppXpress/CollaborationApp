import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	Text
} from 'react-native';

import {
	getColor
} from './Tools';

/**
 * SoHo styled card container component
 */
export default class Card extends Component {
	constructor(props) {
		super(props);

		this.props = props;
	}

	/**
	 * Returns a view with SoHo card styling
	 */
	render() {
		return (
			<View style={styles.view}>
				{this.props.title &&
					<View style={styles.titleView}>
						<Text style={styles.title}>
							{this.props.title}
						</Text>
					</View>
				}
				{this.props.children}
			</View>
		);
	}
};

const styles = StyleSheet.create({
	titleView: {
		height: 50,
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderColor: getColor('graphite-3')
	},
	title: {
		paddingLeft: 20,
		fontSize: 16,
		color: getColor('graphite-10')
	},
	view: {
		margin: 10,
		backgroundColor: getColor('white-0'),
		borderRadius: 2,
		borderWidth: 1,
		borderColor: getColor('graphite-3')
	}
});
