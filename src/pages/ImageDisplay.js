import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	Image,
	CameraRoll,
	Dimensions
} from 'react-native';

import {
	AppX
} from 'gtn-platform';

import {
	Button,
	Card,
	Field,
	List,
	Navigation,
	Page,
	TextInput
} from 'gtn-soho';


export default class ImageDisplay extends Component {

	constructor(props) {
		super(props);

		Navigation.set(this, {
			title: 'Attachment',
		});
	}

	saveImage(){
		CameraRoll.saveToCameraRoll(this.props.image).then(()=> alert("Image saved to camera roll."));
		
	}

	render() {

		return (
			<Page>
				<Image
					style={styles.image}
					resizeMode='contain'
					source={{ uri: this.props.image }}
					marginTop={10}
				/>
				<Button primary title="Save" onPress={()=>this.saveImage()} />
			</Page>
		);
	}
}

const win = Dimensions.get('window');
const styles = StyleSheet.create({
	image: {
		flex: 1,
		width: win.width,
		height: win.height- 150,
	}
});
