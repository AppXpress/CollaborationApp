import React, { Component } from 'react';

import {
	Dimensions,
	StyleSheet,
	View,
	ScrollView,
	Text,
	Modal as ModalBase
} from 'react-native';

import Button from './Button';
import Card from './Card';

import {
	getHandler,
	getColor
} from './Tools';

/**
 * SoHo style modal component
 */
export default class Modal extends Component {
	constructor(props) {
		super(props);

		this.props = props;
		this.state = {
			height: 0
		}
	}

	/**
	 * Sets the appropriate max height on mount and window size change
	 */
	componentDidMount() {
		var self = this;
		function setHeight(value) {
			self.setState({
				height: value
			});
		}

		setHeight(Dimensions.get('window').height);
		Dimensions.addEventListener('change', dimensions => {
			setHeight(dimensions.window.height);
		});
	}

	/**
	 * Gets a style object based on the max height
	 */
	getScrollStyle() {
		return { maxHeight: this.state.height - 150 };
	}

	/**
	 * Renders a base modal with a card, sized scroll view, cancel button, and submit button if onSubmit exists
	 */
	render() {
		return (
			<ModalBase
				{...this.props}
				visible={new Boolean(this.props.visible).valueOf()}
				transparent={true}
				animationType='fade'
				onRequestClose={getHandler(this, 'onRequestClose')}
			>
				<View style={styles.view}>
					<Card title={this.props.title}>
						<ScrollView style={this.getScrollStyle()}>
							{this.props.children}
						</ScrollView>
						<View style={styles.footer}>
							<View style={styles.footerItem}>
								<Button
									title='Cancel'
									onPress={() => getHandler(this, 'onClose')()}
								/>
							</View>
							{this.props.onSubmit &&
								<View style={styles.footerItem}>
									<Button
										title='Submit'
										hue={this.props.hue || 'azure'}
										onPress={() => getHandler(this, 'onSubmit')()}
									/>
								</View>
							}
						</View>
					</Card>
				</View>
			</ModalBase>
		);
	}
};

const styles = StyleSheet.create({
	view: {
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		justifyContent: 'center',
		flex: 1
	},
	footer: {
		borderTopWidth: 1,
		borderColor: getColor('graphite-3'),
		flexDirection: 'row'
	},
	footerItem: {
		flex: 1,
		flexDirection: 'column'
	}
});
