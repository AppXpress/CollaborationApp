import React, { Component } from 'react';

import {
    Platform,
    StyleSheet,
    View,
    Text
} from 'react-native';

import Touchable from './Touchable';

import {
    getColor
} from './Tools';

/**
 * A component for item lists in SoHo style
 */
export default class ListItem extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    /**
     * Changed the style of the container based on the properties
     */
    getStyle() {
        var style = {};

        if (this.props.fill) {
            style.padding = 0;
        }

        return [styles.view, style];
    }

    /**
     * Renders the elements in a styled view or touchable if an onPress is defined
     */
    render() {
        if (this.props.onPress) {
            return (
                <Touchable
                    onPress={this.props.onPress}
                    style={this.getStyle()}
                >
                    {this.props.children}
                </Touchable>
            );
        } else {
            return (
                <View style={this.getStyle()}>
                    {this.props.children}
                </View>
            );
        }
    }
};

const styles = StyleSheet.create({
    view: {
        padding: 20,
        backgroundColor: getColor('white-0'),
        borderColor: getColor('graphite-3'),
        borderTopWidth: 1
    }
});
