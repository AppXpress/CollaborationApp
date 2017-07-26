import React, { Component } from 'react';

import {
	Platform,
	StyleSheet,
	TouchableNativeFeedback,
	TouchableHighlight,
	View
} from 'react-native';

import {
	getHandler
} from '../helpers';

/**
 * Helper component for getting the right touch component for each platform
 */
export default class Touchable extends Component {
	constructor(props) {
		super(props);
	}

	/**
	 * Renders the correct styled touchable item for each platform
	 */
	render() {
		if (Platform.OS == 'android') {
			return (
				<TouchableNativeFeedback
					{...this.props}
					delayPressIn={0}
					style={null}
					background={TouchableNativeFeedback.Ripple(
						'rgba(0, 0, 0, 0.6)',
						this.props.borderless
					)}
				>
					<View style={this.props.style}>
						{this.props.children}
					</View>
				</TouchableNativeFeedback>
			);
		} else {
			return (
				<TouchableHighlight
					{...this.props}
					delayPressIn={0}
					style={null}
					underlayColor={'transparent'}
				>
					<View style={this.props.style}>
						{this.props.children}
					</View>
				</TouchableHighlight>
			);
		}
	}
};
