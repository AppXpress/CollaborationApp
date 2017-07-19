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
} from './Tools';

/**
 * A SoHo text input component
 */
export default class TextInput extends Component {
	constructor(props) {
		super(props);

		this.props = props;
		this.state = {
			leftEmpty: false,
			text: ''
		}
	}

	componentWillReceiveProps(next) {
		this.setState({ text: next.value });
	}

	/**
	 * Gets the error text for the field
	 */
	getError() {
		if (this.props.required) {
			if (this.state.blurred && !this.state.text) {
				return (
					<Text style={styles.error}>This field is required</Text>
				);
			}
		}
	}

	onChangeText(text) {
		this.setState({ text: text });
	}

	onFocus() {
		this.setState({ blurred: false });
	}

	onBlur() {
		this.setState({ blurred: true });
	}

	/**
	 * Gets the text input style based on the properties it has
	 */
	getTextStyle() {
		var style = {};

		if (this.props.editable == false) {
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
				{this.props.label &&
					<Text style={styles.label}>
						{this.props.label}
						{this.props.required && (
							<Text style={styles.error}>*</Text>
						)}
					</Text>
				}

				<TextInputBase
					autoCapitalize='sentences'
					{...this.props}
					style={this.getTextStyle()}
					underlineColorAndroid='transparent'
					onFocus={getHandler(this, 'onFocus')}
					onBlur={getHandler(this, 'onBlur')}
					onChangeText={getHandler(this, 'onChangeText')}
					value={this.props.value}
				/>

				{this.getError()}
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
	},
	error: {
		color: getColor('alert-1')
	}
});
