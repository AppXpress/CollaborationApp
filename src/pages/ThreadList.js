import React, {
    Component
} from 'react';

import {
    FlatList
} from 'react-native';

import {
    Page,
    Card,
    ComplexText,
    ListItem,
    Loading,
    Navigation,
    Tag
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
            title: 'Threads',
            buttons: [
                { icon: 'user', id: 'logout' }
            ]
        });

        this.reload();
    }

    logout() {
        this.props.navigator.resetTo({ screen: 'Login' });
    }

    async reload() {
        let result = await AppX.query('$CCThreadT1');

        if (result.data) {
            this.setState({
                threads: result.data.result
            });
        }
    }

    viewThread(item) {
        this.props.navigator.push({
            screen: 'ThreadView',
            passProps: {
                uid: item.uid
            }
        });
    }

    renderThread(item) {
        return (
            <ListItem onPress={() => this.viewThread(item)}>
                <ComplexText
                    main={item.Title}
                    secondary={item.Date}
                    tertiary={item.Author + ' of ' + item.AuthorOrg}
                />
                <Tag.List>
                    <Tag alert={(() => {
                        if (item.Score < -2) {
                            return '1';
                        } else if (item.Score < 2) {
                            return '2';
                        } else {
                            return '4';
                        }
                    })()}>{'Score: ' + item.Score}</Tag>
                </Tag.List>
            </ListItem >
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
