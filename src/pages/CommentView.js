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

async showAttachment(item) {
        this.setState({ loading: true });
        var appx = await AppX.fetchAttachment(item);
        console.log(appx);
        this.setState({ loading: false });
        setTimeout(() => { this.props.navigator.push({ screen: 'ImageDisplay', passProps: { image: appx.data } }); }, 800);
}    

renderAttach({ item }) {
        if (item.mimeType == 'image/jpg' || item.mimeType == 'image/png') {
            return (
                <ListItem onPress={() => this.showAttachment(item)} >
                    <ComplexText
                        main={item.name}
                        secondary={item.description}
                        tertiary={item.createUserId}
                    />
                </ListItem>
            );
        } else {
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
                {this.state.loading &&
                    <Loading block />
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

