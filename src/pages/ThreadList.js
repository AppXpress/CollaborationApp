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
    Modal,
    helpers
} from 'gtn-soho';

import {
    AppX
} from 'gtn-platform';

export default class List extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false
        };

        Navigation.set(this, { title: 'Threads' });
    }

    willAppear() {
        Navigation.set(this, {
            title: 'Threads',
            buttons: [
                { icon: 'new-document', id: 'createThread' },
                { icon: 'launch', id: 'logout' }
            ]
        });
    }

    componentWillMount() {
        this.reload('refresh');
    }

    createThread() {
        this.props.navigator.push({
            screen: 'ThreadCreate',
        });
    }

    logout() {
        this.setState({ logout: true });
    }

    logoutConfirm() {
        this.setState({ logout: false });
        this.props.navigator.resetTo({ screen: 'Login' });
    }

    //Queries objects based on the filter and sort by fields
    reload(refresh) {
        if (refresh) {
            this.setState({ refreshing: true });
        } else {
            this.setState({ loading: true });
        }


        let oql = (this.state.filter || '1=1') + (this.state.sortby || ' order by createTimestamp desc');

        AppX.query('&thread', oql).then(result => {
            if (result.data) {
                this.setState({
                    threads: result.data.result,
                    refreshing: false,
                    loading: false,
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
                    secondary={item.Date + ' at ' + helpers.formatTime(item.Time)}
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
                onRefresh={() => this.reload('refresh')}
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

                {helpers.renderAndCache(
                    this.state.threads,
                    (data) => data.map(this.renderThread))
                }

                {!this.state.threads &&
                    <ListItem>
                        <ComplexText
                            main='No threads found'
                            secondary='Try refreshing or chaning the filter!'
                        />
                    </ListItem>
                }

                {this.state.loading &&
                    <Loading block />
                }

                <Modal
                    title='Log out'
                    visible={this.state.logout}
                    onSubmit={() => this.logoutConfirm()}
                    onClose={() => this.setState({ logout: false })}
                >
                    <ListItem>
                        <ComplexText main='Are you sure you want to log out?' />
                    </ListItem>
                </Modal>
            </Page>
        );
    }
}
