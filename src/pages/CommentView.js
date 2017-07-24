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
            title: 'Comment',
        });

        this.reload();
    }

    willAppear(){

        if(this.state.button){
            Navigation.set(this, {
                title: 'Comment',
                buttons: this.state.button,
            });
        }
    }

    edit(){
        this.props.navigator.push({
        screen: 'CreateComment',
        passProps: {
                    id: this.props.uid, reload: () => this.reload(), comment: this.state.comment
                }
        });           
    }


    reload() {
        AppX.fetch('$CCCommentT1', this.props.uid).then(result => {
            
            this.setState({
                comment: result.data
            });
                if(this.state.comment.Author==global.userLogin){
                this.setState({button: [
                    { icon: 'compose', id: 'edit' }
                ]})
                 Navigation.set(this, {
                title: 'Comment',
                buttons: this.state.button,
            });

            }
        });
        
        AppX.fetchAttachList('$CCCommentT1', this.props.uid).then(({ data }) => {
            if (data) {
                this.setState({ attachments: data.result || [] });
            } else {
                alert('We weren\'t able to load any attachments. Please try again later!');
            }
        });

        
    }

    renderAttach({ item }) {
            return (
                <ListItem>
                    <ComplexText
                        main={item.name}
                        secondary={item.description}
                        tertiary={item.createUserId}
                    />
                </ListItem>
            );
        
    }
    renderAttachments() {
        return (
            <Card title='Attachments'>
                <FlatList
                    data={this.state.attachments}
                    keyExtractor={item => item.attachmentUid}
                    renderItem={item => this.renderAttach(item)}
                />
                {this.state.attachments && this.state.attachments.length == 0 &&
                    <ListItem>
                        <ComplexText main='No attachments' />
                    </ListItem>
                }
            </Card>    
       )}         



    render() {
        return (
            <Page>
                {this.state.comment &&
                    <Card>
                        <Field label='Author' entry={this.state.comment.Author} />
                        <Field label='Author Organization' entry={this.state.comment.AuthorOrg} />
                        <Field label='Date Created' entry ={this.state.comment.Date} />
                        <Field label='Body' entry={this.state.comment.Body} />
                    </Card>
                }
                {!this.state.comment &&
                    <Card>
                        <Loading />
                    </Card>
                }
             {this.renderAttachments()}   
            </Page>
    )}
}                

