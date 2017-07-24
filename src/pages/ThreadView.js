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
    Tag,
    Modal,
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
    willAppear(){
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

    showVotes(){
        this.setState({modalVisible:true});
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
            console.log(result.data);
        });

        AppX.query('$CCCommentT1', `Parent.rootId = ${this.props.uid}`).then(result => {
            this.setState({
                comments: result.data.result || []
            });
        });

    }

    showHistory(){

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

    renderVote(item){
        var vote;
        if (item.VoteUp == 'true'){
            vote = 'Upvote';
        }
        else if(item.VoteUp == 'false'){
            vote = 'Downvote';
        }else{
            vote= 'None';
        }
        return(
            <ListItem>
                <ComplexText
                    main={item.User+ ' of ' + item.UserOrg}
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
                        <Field label='Time' entry={this.state.thread.Time} />
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
                <Modal visible={this.state.modalVisible}
                        onRequestClose={()=> this.setState({modalVisible: false})}
                        onClose={()=> this.setState({modalVisible: false})}
                        >
                    <FlatList
                        data={this.state.thread.Votes}
                        keyExtractor={item=> item.User}
                        renderItem={({item})=> this.renderVote(item)}
                    />    
                </Modal>
            </Page>
        );
    }
}
