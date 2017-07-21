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
    Tag,
    Button,
} from 'gtn-soho';

import {
    AppX
} from 'gtn-platform';

export default class List extends Component {

    constructor(props) {
        super(props);

        this.state = {};

        Navigation.set(this, { title: 'Threads' });
    }

    willAppear() {
        Navigation.set(this, {
            title: 'Threads',
            buttons: [
                { icon: 'add', id: 'createThread' },
                { icon: 'user', id: 'logout' }
            ]
        });
    }

    componentWillMount() {
        this.reload();
    }

    createThread() {
        this.props.navigator.push({
            screen: 'ThreadCreate',
        });
    }

    logout() {
        this.props.navigator.resetTo({ screen: 'Login' });
    }

    reload() {
        this.setState({ refreshing: true });

        AppX.query('$CCThreadT1', (this.state.filter || '1=1') + ' order by createTimestamp desc').then(result => {
            if (result.data) {
                this.setState({
                    threads: result.data.result,
                    refreshing: false
                });
            }
        });
    }

    setFilter(query) {
        this.state.filter = query
        this.reload();
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
                    <Tag>{'Score: ' + item.Score}</Tag>
                </Tag.List>
            </ListItem >
        );
    }

    render() {
        return (
            <Page
                onRefresh={() => this.reload()}
                refreshing={this.state.refreshing}
            >
                <ListItem fill>
                    <Button
                        icon='filter'
                        title='Filter'
                        onPress={() => this.props.navigator.push({
                            screen: 'FilterThreads',
                            passProps: { setFilter: query => this.setFilter(query) }
                        })}
                    />
                </ListItem>
                <FlatList
                    data={this.state.threads}
                    keyExtractor={item => item.uid}
                    renderItem={({ item }) => this.renderThread(item)}
                />
                {!this.state.threads &&
                    <ListItem>
                        <ComplexText
                            main='No threads found'
                            secondary='Try refreshing or chaning the filter!'
                        />
                    </ListItem>
                }
            </Page>
        );
    }
}
