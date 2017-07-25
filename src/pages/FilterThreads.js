import React, {
    Component
} from 'react';


import {
    Page,
    Card,
    ComplexText,
    Navigation,
    TextInput,
    Button,
    Picker
} from 'gtn-soho';

import {
    AppX
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
        if (this.state.sortby){
            var sortby = (`ORDER BY ${this.state.sortby}`)
        }

        query = '';
        constraints.forEach(item => {
            if (query.length > 0) {
                query += ' AND ';
            }
            query += item;
        });

        this.props.navigator.pop();

        this.props.setFilter(query,sortby);
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
                    <Picker
                        label='Sort By'
                        title='Field to Sort By'
                        selectedValue={this.state.sortby}
                        onValueChange={item => this.setState({ sortby: item })}
                    >
                        <Picker.Item label='Highest Score' value='Score DESC' />
                        <Picker.Item label='Most Recent' value='Time ASC' />
                        <Picker.Item label='Oldest' value='Time DESC' />
                        <Picker.Item label='Lowest Score' value='Score ASC' />
                    </Picker>
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
