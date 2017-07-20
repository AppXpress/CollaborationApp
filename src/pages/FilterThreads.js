import React, {
    Component
} from 'react';


import {
    Page,
    Card,
    ComplexText,
    Navigation,
    TextInput,
    Button
} from 'gtn-soho';

import {
    AppX,
    Utilities
} from 'gtn-platform';

export default class FilterThreads extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

        Navigation.set(this, {
            title: 'Filter'
        });


    }

    setFilter() {
        constraints = [];

        if (this.state.title) {
            constraints.push(`Title CONTAINS "${this.state.title}"`);
        }
        if (this.state.author) {
            constraints.push(`Author CONTAINS "${this.state.author}"`)
        }

        query = '';
        constraints.forEach(item => {
            if (query.length > 0) {
                query += ' AND ';
            }
            query += item;
        });

        this.props.navigator.pop();
        this.props.setFilter(query);
        console.log(query)
    }

    render() {
        return (
            <Page>
                <Card>
                    <TextInput
                        label='Title'
                        value={this.state.title}
                        onChangeText={(text) => this.setState({ title: text })}
                    />
                    <TextInput
                        label='Author'
                        value={this.state.author}
                        onChangeText={(text) => this.setState({ author: text })}
                    />
                    <Button
                        title='Set filter'
                        onPress={() => this.setFilter()}
                        primary
                    />
                </Card>
            </Page>
        );
    }

}    
