import React, {
    Component
} from 'react';

import {
    AppX,
    Utilities
} from '../gtn/All';

import {
  AppRegistry,
  TextInput,
  Text
} from 'react-native';

import {
    Page,
    Card,
    ComplexText,
    ListItem,
    Loading,
    Navigation,
    Tag,
    Button
} from '../soho/All';

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

  async makeThread(){
    this.setState({loading: true});
    var thread = {
      type: '$CCThreadT1',
      title: this.state.title
    }
    var postedThread = await AppX.create(thread);
    var body = {
      type: '$CCCommentT1',
      Body: this.state.body,
      Parent: postedThread.uid
    }
    this.setState({loading: false});
  }

  render() {
      return (
        <Page>
          <Text>
           {"Thread Title"}
          </Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            label="Thread title"
            onChangeText={(text) => this.setState({title: text})}
            value={this.state.title}
          />
          <Text>
           {"Thread Body"}
          </Text>
          <TextInput
            style={{height: 200, borderColor: 'gray', borderWidth: 1}}
            label="Thread body"
            onChangeText={(text) => this.setState({body: text})}
            value={this.state.body}
            multiline
            rows={7}
          />
          <Button
            onPress={()=>this.makeThread}
            title="Create New Thread"
          />
        </Page>
      );
  }


}
