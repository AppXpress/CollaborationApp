import React, { Component } from 'react';

import {
	Platform,
	StyleSheet,
	TouchableNativeFeedback,
	TouchableHighlight,
	View,
	ListView,
	Text
} from 'react-native';

import {
	getHandler,
	getColor
} from './Tools';

/**
 * SoHo style field with label component
 */
export default class Field extends Component {

	/**
	 * Helper component that rendered multiple items side by side in a row
	 */
	static Row = (props) => {
		var i = 0;
		return (
			<View style={styles.row}>
				{props.children && props.children.map(child =>
					<View style={styles.column} key={i++}>
						{child}
					</View>
				)}
			</View>
		);
	}

	constructor(props) {
		super(props);

		this.props = props;
	}

	/**
	 * Renders the label and entry text
	 */
	render() {
		return (
			<View style={styles.view}>
				<Text style={styles.label}>
					{this.props.label}
				</Text>

				{this.props.entry &&
					<Text style={styles.entry}>
						{this.props.entry}
					</Text>
				}

				{this.props.children}
			</View>
		);
	}
};

const styles = StyleSheet.create({
	header: {
		fontSize: 16,
		color: getColor('graphite-10')
	},
	row: {
		flexDirection: 'row'
	},
	column: {
		flex: 1,
		flexDirection: 'column'
	},
	view: {
		padding: 10
	},
	label: {
		fontSize: 12,
		color: getColor('graphite-6')
	},
	entry: {
		fontSize: 14,
		color: getColor('graphite-10')
	}
});
