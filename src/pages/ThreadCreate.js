import React, {
    Component
} from 'react';

import {
    AppX,
    Utilities
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
            title: 'New Thread',
            buttons: [
                { icon: 'user', id: 'logout' }
            ]
        });
    }

    async makeThread() {
        this.setState({ loading: true });
        var thread = {
            type: '$CCThreadT1',
            Date: new Date(),
            Title: this.state.title,
            licensee: {
                'memberId': '5717989018004281',
            }
        }
        var postedThread = await AppX.create(thread);
        if (!postedThread.data) {
            alert('We were\'nt able to create your thread. Please try again later.');
        }

        var newUID = postedThread.data.create.result.uid;
        var body = {
            type: '$CCCommentT1',
            Body: this.state.body,
            Parent: {
                reference: 'Thread',
                rootType: '$CCThreadT1',
                rootId: newUID,
                externalType: '$CCThreadT1',
            }
        }
        var postedThreadBody = await AppX.create(body);
        if (!postedThreadBody.data) {
            alert('We were\'nt able to create your thread. Please try again later.');
        }


        this.props.navigator.pop();
        this.props.navigator.push({
            screen: 'ThreadView',
            passProps: {
                uid: newUID
            }
        });
    }

    render() {
        return (
            <Page>
                <Card>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        label="Thread title"
                        onChangeText={(text) => this.setState({ title: text })}
                        value={this.state.title}
                    />
                    <TextInput
                        style={{ height: 200, borderColor: 'gray', borderWidth: 1 }}
                        label="Thread body"
                        onChangeText={(text) => this.setState({ body: text })}
                        value={this.state.body}
                        multiline
                        rows={7}
                    />
                    <Button
                        onPress={() => this.makeThread()}
                        title="Create New Thread"
                    />
                </Card>
            </Page>
        );
    }


}
