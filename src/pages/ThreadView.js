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
    Navigation
} from '../soho/All';

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

    render() {
        return (
            <Page>
                <Card>
                    <Field label='Title' entry={this.state.thread.Title} />
                </Card>

                <Card title='Comments'>
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
