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
    Button
} from 'gtn-soho';

import {
    AppX,
    Utilities
} from 'gtn-platform';

export default class View extends Component {

    constructor(props) {
        super(props);

        this.state = {
            thread: {},
            upVoteDisabled: false,
            downVoteDisabled: false,
        };

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
                comments: result.data.result
            });
        });
    }

    renderComment(item) {
        return (
            <ListItem>
                <ComplexText
                    main={item.Body}
                    secondary={item.Date}
                    tertiary={item.Author + ' of ' + item.AuthorOrg}
                />
            </ListItem>
        );
    }

    async setVote(vote) {
        let votes = this.state.thread.Votes || [];
        votes = votes.filter(vote => vote.User != global.userLogin);

        if (vote != null) {
            votes.push({
                User: global.userLogin,
                UserOrg: global.userOrgName,
                VoteUp: vote.toString()
            });
        }

        this.state.thread.Votes = votes;
        await AppX.persist(this.state.thread);
        this.setState({});
    }


    render() {
        return (
            <Page>
                <Card>
                    <Field label='Title' entry={this.state.thread.Title} />
                    <Field label='Score' entry={this.state.thread.Score} />
                    <Button icon='up-arrow'
                        onPress={() => this.setVote(true)}
                        disabled={!this.canVote(true)}
                    />

                    <Button icon='reset'

                        onPress={() => this.setVote(null)}
                    />

                    <Button icon='down-arrow'
                        onPress={() => this.setVote(false)}
                        disabled={!this.canVote(false)}
                    />
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
                        refreshing={this.state.loading}
                    />

                    {this.state.loading &&
                        <Loading />
                    }
                </Card>
            </Page>
        );
    }
}
