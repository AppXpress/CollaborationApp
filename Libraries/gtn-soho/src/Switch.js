import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	Switch as SwitchBase,
	Text
} from 'react-native';

import {
	getHandler,
	getColor
} from '../helpers';

/**
 * Renders a SoHo styled switch component
 */
export default class Switch extends Component {
	constructor(props) {
		super(props);
	}

	/**
	 * Gets the color based on the current value
	 */
	getThumbTintColor() {
		if (this.props.value) {
			return getColor(this.props.hue + '-6', 'azure-6');
		}
		return getColor('white-0');
	}

	/**
	 * Renders a native switch component with the correct SoHo colors
	 */
	render() {
		return (
			<View style={styles.view}>
				<SwitchBase
					{...this.props}
					tintColor={getColor('graphite-4')}
					onTintColor={getColor(this.props.hue + '-3', 'azure-3')}
					thumbTintColor={this.getThumbTintColor()}
				/>

				<Text style={styles.label}>
					{this.props.label}
				</Text>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	view: {
		margin: 10,
		alignItems: 'center',
		flexDirection: 'row'
	},
	title: {
		paddingLeft: 10,
		fontSize: 14,
		color: getColor('graphite-10')
	}
});
