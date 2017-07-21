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
    Field,
    ListItem,
    Navigation,
    Button,
    Loading,
    Tag
} from 'gtn-soho';

import {
    AppX
} from 'gtn-platform';

export default class View extends Component {

    constructor(props) {
        super(props);

        this.state = {
            thread: {}
        };

        Navigation.set(this, {
            title: 'Thread'
        });
    }

    componentWillMount() {
        this.reload();
    }

    canVote(vote) {
        let votes = this.state.thread.Votes || [];
        let current = votes.find(vote => vote.User == global.userLogin);
        return current ? current.VoteUp != vote.toString() : true;
    }

    reload() {
        this.setState({
            refreshing: true
        });

        AppX.fetch('$CCThreadT1', this.props.uid).then(result => {
            this.setState({
                thread: result.data,
                refreshing: false
            });
        });

        AppX.query('$CCCommentT1', `Parent.rootId = ${this.props.uid}`).then(result => {
            this.setState({
                comments: result.data.result || []
            });
        });
    }

    viewComment(item) {
        this.props.navigator.push({
            screen: 'CommentView',
            passProps: {
                uid: item.uid
            }
        });
    }

    toggleVote(vote) {
        this.setState({ refreshing: true });

        let votes = this.state.thread.Votes || [];
        votes = votes.filter(vote => vote.User != global.userLogin);

        if (this.canVote(vote)) {
            votes.push({
                User: global.userLogin,
                UserOrg: global.userOrgName,
                VoteUp: vote.toString()
            });
        }

        this.state.thread.Votes = votes;

        AppX.persist(this.state.thread).then(result => {
            this.setState({ refreshing: false });
        });
    }

    renderComment(item) {
        return (
            <ListItem onPress={() => this.viewComment(item)} >
                <ComplexText
                    main={item.Body}
                    secondary={item.Date}
                    tertiary={item.Author + ' of ' + item.AuthorOrg}
                />
            </ListItem>
        );
    }

    render() {
        return (
            <Page
                onRefresh={() => this.reload()}
                refreshing={this.state.refreshing}
            >
                <Card>
                    <Field label='Title' entry={this.state.thread.Title} />
                    <Field label='Score' entry={this.state.thread.Score} />
                    <Tag.List>
                        <Button
                            icon='up-arrow'
                            onPress={() => this.toggleVote(true)}
                            hue={this.canVote(true) ? 'graphite' : 'emerald'}
                        />
                        <Button
                            icon='down-arrow'
                            onPress={() => this.toggleVote(false)}
                            hue={this.canVote(false) ? 'graphite' : 'ruby'}
                        />
                    </Tag.List>
                </Card>

                <Card title='Comments'>
                    <ListItem fill>
                        <Button
                            icon='mingle-share'
                            title='New Comment'
                            onPress={() => this.props.navigator.push({
                                screen: 'CreateComment',
                                passProps: {
                                    id: this.props.uid, reload: () => this.reload()
                                }
                            })}
                        />
                    </ListItem>
                    <FlatList
                        data={this.state.comments}
                        keyExtractor={item => item.uid}
                        renderItem={({ item }) => this.renderComment(item)}
                    />
                    {this.state.comments && this.state.comments.length == 0 &&
                        <ListItem>
                            <ComplexText
                                main='No comments'
                                secondary='Go ahead and make one!'
                            />
                        </ListItem>
                    }
                </Card>
            </Page>
        );
    }
}
