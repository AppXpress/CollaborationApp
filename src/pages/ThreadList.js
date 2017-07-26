import React, {
    Component
} from 'react';

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
                { icon: 'new-document', id: 'createThread' },
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

    //Queries objects based on the filter and sort by fields
    reload() {
        this.setState({ refreshing: true });

        let oql = (this.state.filter || '1=1') + (this.state.sortby || ' order by createTimestamp desc');

        AppX.query('&thread', oql).then(result => {
            if (result.data) {
                this.setState({
                    threads: result.data.result,
                    refreshing: false
                });
            }
        });
    }

    setFilter(query, sortby) {
        this.state.filter = query
        if (sortby) {
            this.state.sortby = sortby
        }
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

    renderThread = (item) => {
        return (
            <ListItem onPress={() => this.viewThread(item)} key={item.uid}>
                <ComplexText
                    main={item.Title}
                    secondary={item.Date}
                    tertiary={item.Author + ' of ' + item.AuthorOrg}
                />
                <Tag.List>
                    <Tag text={'Score: ' + item.Score} />
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
                            passProps: { setFilter: (query, sortby) => this.setFilter(query, sortby) }
                        })}
                    />
                </ListItem>

                {this.state.threads &&
                    this.state.threads.map(this.renderThread)
                }

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
