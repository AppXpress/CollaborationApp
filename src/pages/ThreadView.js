import React, {
    Component
} from 'react';

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

export default class View extends Component {

    constructor(props) {
        super(props);

        this.state = {
            thread: {},
            modalVisible: false,
        };

        Navigation.set(this, {
            title: 'Thread',
            buttons: [
                { icon: 'check', id: 'showVotes' },
            ]
        });
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
        this.setState({
            refreshing: true
        });

        AppX.fetch('&thread', this.props.uid).then(result => {
            this.setState({
                thread: result.data,
                refreshing: false
            });
        });

        AppX.query('&comment', `Parent.rootId = ${this.props.uid}` + ' ORDER BY createTimestamp ASC').then(result => {
            this.setState({
                comments: result.data.result || []
            }, ()=>{
            this.state.comments.forEach((comment)=> {
                if(comment.ReplyTo){

                    var uid = comment.ReplyTo.rootId;
                    var replyed = this.state.comments.find(function(comment){
                        return comment.uid == uid;
                    })
                    comment.replyed = {};
                    comment.replyed.Body = replyed.Body;
                    comment.replyed.Author = replyed.Author;
                    console.log(comment)
                }
                this.setState({});
            });
        });

    });        

    }



    viewComment(item) {
        this.props.navigator.push({
            screen: 'CommentView',
            passProps: {
                uid: item.uid,
                reload: () => this.reload()
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

   renderComment = item => {
        
        
        return (
            <ListItem
                key={item.uid}
                onPress={() => this.viewComment(item)}
            >
            {item.replyed && 
                <ListItem>
                <ComplexText
                    main='Replying To'
                    secondary={item.replyed.Body}
                    tertiary={item.replyed.Author}
                 />   
                 </ListItem>
            }    
                <ComplexText
                    main={item.Body}
                    secondary={item.Date + ' at ' + helpers.formatTime(item.Time)}
                    tertiary={item.Author + ' of ' + item.AuthorOrg}
                />
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
                                    id: this.props.uid, reload: () => this.reload()
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
