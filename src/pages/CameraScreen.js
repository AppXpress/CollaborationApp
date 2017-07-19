import React, { Component } from 'react';

import {
	View,
	StyleSheet,
	Dimensions,
	Text,
} from 'react-native';

import {
	Icon,
	Navigation,
} from '../soho/All'

import Camera from 'react-native-camera';

export default class CameraScreen extends Component {

	static navigatorStyle = {
		navBarBlur: true,
		drawUnderNavBar: true,
		drawUnderTabBar: true,
		navBarTranslucent: true
	};

	constructor(props) {
		super(props);

		this.state = {};

		Navigation.set(this, {
			title: 'Camera',
			clear: true,
		});

		this.state = {
			camera: {
				aspect: Camera.constants.Aspect.fill,
				orientation: Camera.constants.Orientation.auto,
				flashMode: Camera.constants.FlashMode.auto,
			},
		}
	};

	switchFlash() {
		let newFlashMode;
		const { auto, on, off } = Camera.constants.FlashMode;

		if (this.state.camera.flashMode === auto) {
			newFlashMode = on;
		} else if (this.state.camera.flashMode === on) {
			newFlashMode = off;
		} else if (this.state.camera.flashMode === off) {
			newFlashMode = auto;
		}

		this.setState({
			camera: {
				flashMode: newFlashMode
			}
		});
	}

	grabCapture() {
		this.camera.capture().then((data) =>
			this.props.navigator.push({
				screen: 'CameraDisplay',
				passProps: {
					image: data, 
					issue: this.props.issue,
					reload: this.props.reload
				}
			})
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<Camera
					ref={(cam) => {
						this.camera = cam;
					}}
					aspect={Camera.constants.Aspect.fill}
					flashMode={this.state.camera.flashMode}
					style={styles.preview}
					captureTarget={Camera.constants.CaptureTarget.temp}
				>
					<Text style={styles.capture} onPress={() => this.grabCapture()}>
						<Icon name='camera' size={40} />
					</Text>
				</Camera>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',

	},
	container: {
		flex: 1,
		flexDirection: 'row',
	},
	capture: {
		flex: 0,
		borderRadius: 5,
		padding: 10,
		margin: 40,
		backgroundColor: 'transparent',
	},
	flashButton: {
		flex: 0,
		borderRadius: 5,
		margin: 40,
		backgroundColor: 'transparent',
		textAlign: 'right',
	}
});
