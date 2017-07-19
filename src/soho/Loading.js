import React, { Component } from 'react';

import {
    Platform,
    StyleSheet,
    Modal,
    View,
    Text,
    ActivityIndicator
} from 'react-native';

import ListItem from './ListItem';
import Page from './Page';

import {
    getColor,
    getHandler
} from './Tools';

/**
 * Component for displaying loading indicators in SoHo style
 */
export default class Loading extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    /**
     * Gets the loading indicator itself with the right size for each platform
     * 
     * @param {bool} modal whether or not the indicator is for a modal
     */
    indicator(modal) {
        if (Platform.OS == 'android' && modal) {
            return (
                <ActivityIndicator
                    color={getColor(this.props.hue + '-6', 'azure-6')}
                    animating={true}
                    size={60}
                />
            );
        } else {
            return (
                <ActivityIndicator
                    color={getColor(this.props.hue + '-6', 'azure-6')}
                    animating={true}
                    size="large"
                />
            );
        }
    }

    /**
     * Gets the style of the loading indicator text
     */
    textStyle() {
        return [styles.text, {
            color: getColor(this.props.hue + '-6', 'azure-6')
        }];
    }

    /**
     * Renders the loading indicator, either in a modal or list item
     */
    render() {
        if (this.props.block) {
            return (
                <Modal
                    transparent={true}
                    animationType='fade'
                    onRequestClose={getHandler(this, 'onRequestClose')}
                >
                    <View style={styles.view}>
                        {this.indicator(true)}
                        <Text style={this.textStyle()}>
                            Loading
                        </Text>
                    </View>
                </Modal>
            );
        } else {
            return (
                <ListItem>
                    {this.indicator()}
                    <Text style={this.textStyle()}>
                        Loading
                    </Text>
                </ListItem>
            );
        }
    }
};

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'rgba(240, 240, 240, 0.75)',
        justifyContent: 'center',
        flex: 1
    },
    text: {
        textAlign: 'center',
        fontSize: 16
    }
});
