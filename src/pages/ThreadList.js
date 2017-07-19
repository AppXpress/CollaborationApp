import React, {
    Component
} from 'react';

import {
    FlatList
} from 'react-native';

import {
    Page,
    Card,
    ListItem,
    Loading,
    Navigation
} from '../soho/All';

import {
    AppX,
    Utilities
} from '../gtn/All';

export default class List extends Component {

    constructor(props) {
        super(props);

        this.state = {};

        Navigation.set(this, {
            title: 'Threads'
        });
    }

    async reload() {
        this.setState({
            threads: await AppX.query('$CCThreadT1')
        });
    }

    renderThread(item) {
        return (
            <ListItem>

            </ListItem>
        );
    }

    render() {
        return (
            <Page>
                <FlatList
                    data={this.state.threads}
                    keyExtractor={item => item.uid}
                    renderItem={({ item }) => this.renderThread(item)}
                    refreshing={this.state.loading}
                />

                {this.state.loading &&
                    <Loading />
                }
            </Page>
        );
    }
}
