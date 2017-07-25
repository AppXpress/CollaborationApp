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

    //Sets a query string and a sort by string and passes them back to ThreadList
    setFilter() {
        constraints = [];

        if (this.state.title) {
            constraints.push(`Title CONTAINS "${this.state.title}"`);
        }
        if (this.state.author) {
            constraints.push(`Author CONTAINS "${this.state.author}"`)
        }
        if (this.state.scoreMod && this.state.score){
          if(this.state.scoreMod === '1'){
            constraints.push(`Score >= ${this.state.score}`)
          }
          if(this.state.scoreMod === '2'){
            constraints.push(`Score = ${this.state.score}`)
          }
          if(this.state.scoreMod === '3'){
            constraints.push(`Score <= ${this.state.score}`)
          }
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

        console.log(query);
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
                        label='Score modifier'
                        title='Score modifier'
                        selectedValue={this.state.scoreMod}
                        onValueChange={item => this.setState({ scoreMod: item })}
                    >
                        <Picker.Item label='none' value={null} />
                        <Picker.Item label='>=' value='1' />
                        <Picker.Item label='=' value='2' />
                        <Picker.Item label='<=' value='3' />
                    </Picker>
                    <TextInput
                        label='Score'
                        value={this.state.score}
                        onChangeText={(text) => this.setState({ score: text })}
                    />
                    <Picker
                        label='Sort By'
                        title='Field to Sort By'
                        selectedValue={this.state.sortby}
                        onValueChange={item => this.setState({ sortby: item })}
                    >
                        <Picker.Item label='Highest Score' value='Score DESC' />
                        <Picker.Item label='Most Recent' value='createTimestamp DESC' />
                        <Picker.Item label='Oldest' value='createTimestamp ASC' />
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
