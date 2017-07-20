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
} from '../gtn/All';

export default class View extends Component {

    constructor(props) {
        super(props);

        this.state = {
            thread: {}
        };

        Navigation.set(this, {
            title: 'Thread'
        });

        this.reload();
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

    async setVote(vote){

        var newThread = this.state.thread;
        var user = await Utilities.storageGet('username');
        console.log(user);
        console.log(newThread);
        var voteFound;
    if(vote){
        if(!newThread.Votes){
            newThread.Votes = [];
            newThread.Votes.push({
                User: user,
                VoteUp: vote
            });
        }
    }


        if(newThread.Votes){
            for(i =0; i<newThread.Votes.length;i++){
                if (newThread.Votes[i].User == user){
                    voteFound = true;
                    if(vote){
                        newThread.Votes[i].VoteUp = vote;
                    }else{
                        newThread.Votes.splice(i, 1);
                    }
                }
                break;
            }


        if(vote){    
            if(!voteFound){
                newThread.Votes.push({
                    User: user,
                    VoteUp: vote
                    });
                }   
            }
        }

        console.log(newThread);
        await AppX.persist(newThread);
        this.reload();
    }


    render() {
        return (
            <Page>
                <Card>
                    <Field label='Title' entry={this.state.thread.Title} />
                    <Field label='Score' entry={this.state.thread.Score} />
                    <Button icon='up-arrow'
                            
                            onPress={() => this.setVote('true')}
                    />

                    <Button icon='reset'
                            
                            onPress={() => this.setVote(null)}
                    /> 

                    <Button icon='down-arrow'
                            
                            onPress={() => this.setVote('false')}
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
