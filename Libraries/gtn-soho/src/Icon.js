import React, { Component } from 'react';

import config from '../fonts/soho';

import {
    StyleSheet,
    Text
} from 'react-native';

import {
    getColor
} from '../helpers';

/**
 * Component for displaying SoHo icons
 */
export default class Icon extends Component {

    /**
     * Helper function for getting the character for an icon in the icon font
     * 
     * @param {string} name the name of the SoHo icon
     */
    static getChar(name) {
        if (name) {
            let char = config.glyphs.find(item => {
                return item.css == name;
            });
            if (char) {
                return String.fromCharCode(char.code);
            }
        }
        return '#';
    }

    constructor(props) {
        super(props);

        this.state = {
            icon: Icon.getChar(this.props.name)
        }
    }

    componentWillReceiveProps(next) {
        this.setState({
            icon: Icon.getChar(next.name)
        });
    }

    getStyle() {
        let style = {};
        if (this.props.size) {
            style.fontSize = this.props.size;
        }

        return [styles.text, style];
    }

    /**
     * Renders the icon character in a text item with the SoHo font
     */
    render() {
        return (
            <Text style={this.getStyle()}>
                {this.state.icon}
            </Text>
        );
    }
};

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: 'normal',
        fontFamily: 'soho'
    }
});
