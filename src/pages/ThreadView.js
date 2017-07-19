import React, {
    Component
} from 'react';

import {
    Page,
    Card
} from '../soho/All';

import {
    AppX,
    Utilities
} from '../gtn/All';

export default class View extends Component {

    constructor(props) {
        super(props);

        this.state = {};

        Navigation.set(this, {
            title: 'Threads'
        });
    }

    render() {
        return (
            <Page>
                <Card>

                </Card>
            </Page>
        );
    }
}
