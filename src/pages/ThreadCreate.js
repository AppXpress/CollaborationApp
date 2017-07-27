import React, {
    Component
} from 'react';

import {
    AppX
} from 'gtn-platform';

import {
    AppRegistry,
    Text
} from 'react-native';

import {
    Page,
    Card,
    ComplexText,
    ListItem,
    Navigation,
    Tag,
    TextInput,
    Button,
} from 'gtn-soho';

export default class ThreadCreate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            body: '',
            loading: false
        };

        Navigation.set(this, {
            title: 'New Thread'
        });
    }

    async createThread() {
        this.setState({ loading: true });
        if (this.state.body.length > 10000){
    			alert("Sorry, text postings are only supported up to 10000 characters, yours is "+this.state.body.length+".");
    		} else if (this.state.title.length > 1000){
          alert("Sorry, titles must be under 1000 characters, yours is "+this.state.title.length+".");
        } else {

        let result = await AppX.create({
            type: '&thread',
            Title: this.state.title
        });

        if (!result.data) {
            alert('We were\'nt able to create your thread. Please try again later.');
            return;
        }

        let thread = result.data.create.result;
        result = await AppX.create({
            type: '&comment',
            Body: this.state.body,
            Parent: {
                reference: 'Thread',
                rootType: '&thread',
                rootId: thread.uid
            }
        });

        if (!result.data) {
            alert('We were\'nt able to create your thread. Please try again later.');
            return;
        }

        //moves back to list then forward to new thread
        this.props.navigator.pop();
        this.props.navigator.push({
            screen: 'ThreadView',
            passProps: {
                getThread: () => thread
            }
        });
      }
    }

    render() {
        return (
            <Page>
                <Card>
                    <TextInput
                        label="Title"
                        onChangeText={(text) => this.setState({ title: text })}
                        value={this.state.title}
                    />
                    <TextInput
                        label="Message"
                        onChangeText={(text) => this.setState({ body: text })}
                        value={this.state.body}
                        multiline
                        rows={7}
                    />
                    <Button
                        onPress={() => this.createThread()}
                        title="Submit"
                        primary
                    />
                </Card>
            </Page>
        );
    }
}
