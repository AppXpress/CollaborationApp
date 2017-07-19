import React, {
    Component
} from 'react';

import {
    Page,
    Card,
    Field,
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

    async reload() {
        let result = await AppX.fetch('$CCThreadT1', this.props.uid);

        this.setState({
            thread: result.data
        });
    }

    render() {
        return (
            <Page>
                <Card>
                    <Field label='Title' entry={this.state.thread.Title} />
                </Card>
            </Page>
        );
    }
}
