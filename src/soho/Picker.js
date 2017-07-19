import React, { Component } from 'react';

import {
	Dimensions,
	StyleSheet,
	View,
	FlatList,
	ScrollView,
	Text,
	Picker as PickerBase
} from 'react-native';

import Button from './Button';
import Card from './Card';
import ComplexText from './ComplexText';
import Icon from './Icon';
import ListItem from './ListItem';
import Modal from './Modal';
import Touchable from './Touchable';

import {
	getHandler,
	getColor
} from './Tools';

/**
 * Picker component styled like SoHo
 */
export default class Picker extends Component {

	/**
	 * Helper component for listing picker items
	 */
	static Item = (props) => {
		this.props = props;
	}

	constructor(props) {
		super(props);

		this.props = props;
		this.state = {
			value: this.props.selectedValue,
			visible: false
		}
	}

	componentWillReceiveProps(next) {
		this.setState({ value: next.selectedValue });
	}

	/**
	 * Gets the current label for the field based on the value
	 */
	getLabel() {
		var selected = this.props.children.find(item => {
			return item.props.value == this.state.value;
		});

		if (selected) {
			return selected.props.label;
		}
	}

	onValueChange(value) {
		this.setState({
			value: value,
			visible: false
		});
	}

	/**
	 * Renders an option in the picker
	 * 
	 * @param {object} param0 the iterator data, where the item field is the option to render
	 */
	renderItem({ item }) {
		return (
			<ListItem onPress={() => getHandler(this, 'onValueChange')(item.props.value)}>
				<ComplexText
					main={item.props.label}
					secondary={item.props.secondary}
					tertiary={item.props.tertiary}
				/>
			</ListItem>
		);
	}

	/**
	 * Renders the picker as a field with a modal that lists the options
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

				<View style={styles.innerView}>
					<Touchable
						style={styles.touchable}
						onPress={() => this.setState({ visible: true })}
					>
						<Text style={styles.value}>
							{this.getLabel()}
						</Text>
						<View style={styles.icon}>
							<Icon name='launch' />
						</View>
					</Touchable>
				</View>

				<Modal
					title={this.props.title}
					visible={this.state.visible}
					onClose={() => this.setState({ visible: false })}
					onRequestClose={() => this.setState({ visible: false })}
				>
					<FlatList
						data={this.props.children}
						keyExtractor={item => 'Picker' + item.props.value}
						renderItem={this.renderItem.bind(this)}
					/>
				</Modal>
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
	innerView: {
		borderRadius: 2,
		borderWidth: 1,
		borderColor: getColor('graphite-4')
	},
	touchable: {
		height: 34,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	icon: {
		marginRight: 10
	},
	value: {
		padding: 0,
		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 14,
		color: getColor('graphite-10')
	},
	picker: {
		height: 34,
		padding: 0,
		paddingLeft: 10,
		color: getColor('graphite-10')
	}
});
