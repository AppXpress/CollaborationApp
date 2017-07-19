import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Image,
    KeyboardAvoidingView,
} from 'react-native';

import {
    Icon,
    Navigation,
    Page,
    Card,
    Button,
    TextInput,
    Loading
} from '../soho/All'

import {
    AppX
} from '../gtn/All'

export default class CameraDisplay extends Component {

    constructor(props) {
        super(props);

        this.state = {};

        Navigation.set(this, {
            title: 'Attachment',
            hue: 'slate',
        });

        this.state = {
            description: '',
            filename: ''
        };
    }

    async upload() {
        this.setState({ loading: true });
        await AppX.persistAttachment(this.props.issue, this.props.image.path, this.state.filename + '.jpg', this.state.description);
        this.setState({ loading: false });
        this.props.navigator.pop();
        this.props.navigator.pop();
        this.props.reload();
    }

    render() {
        return (
            <Page>
                <KeyboardAvoidingView behavior='position'>
                    <Card>
                        <Image source={{ uri: this.props.image.path }} style={styles.img} />
                        <TextInput label="File Name" value={this.state.filename} onChangeText={(text) => this.setState({ filename: text })} />
                        <TextInput
                            label='Description'
                            value={this.state.description}
                            onChangeText={(text) => this.setState({ description: text })}
                            multiline
                            rows={2}
                        />
                        <Button primary icon='upload' onPress={() => this.upload()} title='Upload' />
                    </Card>

                    {this.state.loading &&
                        <Loading block />
                    }
                </KeyboardAvoidingView>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    img: {
        width: 350,
        height: 400,
        flex: 1,
        alignSelf: 'stretch',
        resizeMode: 'contain',
        marginTop: 20,
    }
});
