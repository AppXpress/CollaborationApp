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

        this.state = {};

        Navigation.set(this, {
            title: 'Thread'
        });

        this.reload();
    }

    canVote(vote) {
        let votes = this.state.thread.Votes || [];
        let current = votes.find(vote => vote.User == global.userLogin);
        return current ? current.VoteUp != vote.toString() : true;
    }

    reload() {
        AppX.fetch('$CCThreadT1', this.props.uid).then(result => {
            this.setState({
                thread: result.data
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

    async toggleVote(vote) {
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
        this.setState({ loading: true });
        await AppX.persist(this.state.thread);
        this.setState({ loading: false });
    }

    render() {
        return (
            <Page>
                {this.state.thread &&
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
                }
                {!this.state.thread &&
                    <Card>
                        <Loading />
                    </Card>
                }

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
                    {!this.state.comments &&
                        <Loading />
                    }
                </Card>

                {this.state.loading &&
                    <Loading block />
                }
            </Page>
        );
    }
}
