import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	Text,
	TextInput as TextInputBase
} from 'react-native';

import {
	getHandler,
	getColor
} from '../helpers';

/**
 * A SoHo text input component
 */
export default class TextInput extends Component {
	constructor(props) {
		super(props);
	}

	/**
	 * Gets the text input style based on the properties it has
	 */
	getTextStyle() {
		let style = {};

		if (this.props.disabled) {
			style.backgroundColor = getColor('graphite-2');
		}

		if (this.props.multiline) {
			style.padding = 10;
			style.textAlignVertical = 'top';

			if (this.props.rows) {
				style.height = (this.props.rows * 20 + 20);
			} else if (this.props.style && this.props.style.height) {
				style.height = this.props.style.height;
			} else {
				style.height = 40;
			}
		}

		return [styles.text, style];
	}

	/**
	 * Renders a text label and a styled base text input
	 */
	render() {
		return (
			<View style={styles.view}>
				<Text style={styles.label}>
					{this.props.label}
				</Text>

				<TextInputBase
					autoCapitalize='sentences'
					{...this.props}
					style={this.getTextStyle()}
					underlineColorAndroid='transparent'
				/>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	view: {
		margin: 10,
	},
	label: {
		fontSize: 12,
		color: getColor('graphite-6')
	},
	text: {
		height: 34,
		padding: 0,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 2,
		borderWidth: 1,
		borderColor: getColor('graphite-4'),
		fontSize: 14,
		color: getColor('graphite-10')
	}
});
