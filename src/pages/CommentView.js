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
         Navigation.set(this, {
            title: 'Comment',
        });
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
            console.log(result);
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
        

        
    }

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
            </Page>
    )}
}                

