import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View
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
    Tag,
    Modal,
    helpers
} from 'gtn-soho';

import {
    AppX
} from 'gtn-platform';

export default class ThreadView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            thread: this.props.getThread(),
            modalVisible: false,
        };

        Navigation.set(this, { title: 'Thread' });
    }

    willAppear() {
        Navigation.set(this, {
            title: 'Thread',
            buttons: [
                { icon: 'check', id: 'showVotes' },
            ]
        });
    }

    componentWillMount() {
        this.reload();
    }

    showVotes() {
        this.setState({ modalVisible: true });
    }

    canVote(vote) {
        let votes = this.state.thread.Votes || [];
        let current = votes.find(vote => vote.User == global.userLogin);
        return current ? current.VoteUp != vote.toString() : true;
    }

    reload() {
        this.setState({ refreshing: true });

        AppX.query('&comment', `Parent.rootId = ${this.state.thread.uid}` + ' ORDER BY createTimestamp ASC').then(result => {
            this.setState({
                comments: result.data.result || []
            }, () => {
                this.state.comments.forEach((comment) => {
                    AppX.fetchAttachList('&comment', comment.uid).then((result) => {
                        if (result.data.resultInfo.count > 0) {
                            console.log('cdond true')
                            comment.hasAttachment = true;
                            this.setState({});
                        }
                    });
                    if (comment.ReplyTo) {
                        var uid = comment.ReplyTo.rootId;
                        comment.replyed = this.state.comments.find(function (comment) {
                            return comment.uid == uid;
                        });
                    }
                });
                this.setState({ refreshing: false });
            });
        });
    }

    viewComment(item) {
        this.props.navigator.push({
            screen: 'CommentView',
            passProps: {
                getComment: () => item,
                getThread: () => this.state.thread,
                update: () => this.reload()
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
            this.props.update();
        });
    }

    renderComment = item => {
        return (
            <ListItem
                key={item.uid}
                onPress={() => this.viewComment(item)}
            >
                {item.replyed &&
                    <View style={styles.reply}>
                        <ComplexText
                            secondary={item.replyed.Author + ' of ' + item.replyed.AuthorOrg}
                            tertiary={item.replyed.Date + ' at ' + helpers.formatTime(item.replyed.Time)}
                        />
                        <ComplexText main={item.replyed.Body} />
                    </View>
                }

                <ComplexText
                    secondary={item.Author + ' of ' + item.AuthorOrg}
                    tertiary={item.Date + ' at ' + helpers.formatTime(item.Time)}
                />
                <ComplexText main={item.Body} />

                {item.hasAttachment &&
                    <Tag.List>
                        <Tag text={'Has Attachment'} />
                    </Tag.List>
                }
            </ListItem>
        );
    }

    renderVote = item => {
        let vote = 'None';
        if (item.VoteUp == 'true') {
            vote = 'Upvote';
        }
        else if (item.VoteUp == 'false') {
            vote = 'Downvote';
        }
        return (
            <ListItem key={this.voteCount = ++this.voteCount || 0}>
                <ComplexText
                    main={item.User + ' of ' + item.UserOrg}
                    secondary={vote}
                />
            </ListItem>
        )
    }

    render() {
        return (
            <Page
                onRefresh={() => this.reload()}
                refreshing={this.state.refreshing}
            >
                <Card>
                    <Field.Row>
                        <Field label='Title' entry={this.state.thread.Title} />
                        <Field label='Score' entry={this.state.thread.Score} />
                    </Field.Row>
                    <Field.Row>
                        <Field label='Author' entry={this.state.thread.Author} />
                        <Field label='Author Organization' entry={this.state.thread.AuthorOrg} />
                    </Field.Row>
                    <Field.Row>
                        <Field label='Date' entry={this.state.thread.Date} />
                        <Field label='Time' entry={helpers.formatTime(this.state.thread.Time)} />
                    </Field.Row>
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
                                    getThread: () => this.state.thread,
                                    update: () => this.reload()
                                }
                            })}
                        />
                    </ListItem>

                    {this.state.comments &&
                        this.state.comments.map(this.renderComment)
                    }

                    {this.state.comments && this.state.comments.length == 0 &&
                        <ListItem>
                            <ComplexText
                                main='No comments'
                                secondary='Go ahead and make one!'
                            />
                        </ListItem>
                    }
                </Card>
                <Modal
                    title='Votes'
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({ modalVisible: false })}
                    onClose={() => this.setState({ modalVisible: false })}
                >
                    {!this.state.thread.Votes &&
                        <ListItem>
                            <ComplexText
                                main='No votes yet'
                                secondary='You could be first'
                            />
                        </ListItem>
                    }

                    {this.state.thread.Votes &&
                        this.state.thread.Votes.map(this.renderVote)
                    }
                </Modal>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    reply: {
        margin: 10,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderColor: helpers.getColor('graphite-3'),
        borderWidth: 1
    }
});
