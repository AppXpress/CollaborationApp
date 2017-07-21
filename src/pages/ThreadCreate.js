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

        let result = await AppX.create({
            type: '$CCThreadT1',
            Title: this.state.title
        });

        if (!result.data) {
            alert('We were\'nt able to create your thread. Please try again later.');
            return;
        }

        let thread = result.data.create.result;
        result = await AppX.create({
            type: '$CCCommentT1',
            Body: this.state.body,
            Parent: {
                reference: 'Thread',
                rootType: '$CCThreadT1',
                rootId: thread.uid
            }
        });

        if (!result.data) {
            alert('We were\'nt able to create your thread. Please try again later.');
            return;
        }

        this.props.navigator.pop();
        this.props.navigator.push({
            screen: 'ThreadView',
            passProps: {
                uid: thread.uid
            }
        });
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
