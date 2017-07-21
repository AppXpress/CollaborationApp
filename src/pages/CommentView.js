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
            title: 'Comment'
        });

        this.reload();
    }

    reload() {
        AppX.fetch('$CCCommentT1', this.props.uid).then(result => {
            console.log(result);
            this.setState({
                comment: result.data
            });
        });

    }

    render() {
        return (
            <Page>
                {this.state.comment &&
                    <Card>
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

