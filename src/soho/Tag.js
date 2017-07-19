import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text
} from 'react-native';

import {
    getColor
} from './Tools';

/**
 * A tag component in SoHo style
 */
export default class Tag extends Component {
    static List = props => {
        return (
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                {props.children}
            </View>
        );
    }

    constructor(props) {
        super(props);

        this.props = props;
    }

    getViewStyle() {
        var style = {
            backgroundColor: getColor('alert-' + this.props.alert, 'graphite-2')
        };

        return [styles.view, style];
    }

    getTextStyle() {
        var style = {}

        if (this.props.alert) {
            style.color = getColor('white-0');
        }

        return [styles.text, style];
    }

	/**
	 * Renders a pill shaped tag with the color according to the given level
	 */
    render() {
        return (
            <View style={this.getViewStyle()}>
                <Text style={this.getTextStyle()}>
                    {this.props.children}
                </Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    view: {
        height: 22,
        marginRight: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 22,
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    text: {
        fontSize: 12,
        color: getColor('graphite-10')
    }
});
