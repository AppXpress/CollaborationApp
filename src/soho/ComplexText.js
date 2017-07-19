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
 * Component for displaying up to 3 pieces of text in SoHo style
 */
export default class ComplexText extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    /**
     * Renders the 3 text items if they were passed in the properties
     */
    render() {
        return (
            <View>
                {this.props.main &&
                    <Text style={styles.main}>
                        {this.props.main}
                    </Text>
                }

                {this.props.secondary &&
                    <Text style={styles.secondary}>
                        {this.props.secondary}
                    </Text>
                }

                {this.props.tertiary &&
                    <Text style={styles.tertiary}>
                        {this.props.tertiary}
                    </Text>
                }
            </View>
        );
    }
};

const styles = StyleSheet.create({
    main: {
        fontSize: 14,
        color: getColor('graphite-10')
    },
    secondary: {
        fontSize: 12,
        color: getColor('graphite-6')
    },
    tertiary: {
        fontSize: 10,
        color: getColor('graphite-4'),
        fontWeight: 'bold'
    }
});
