import React, {
    Component
} from 'react';

import {
    AppX,
    Utilities
} from '../gtn/All';

export default class ThreadCreate extends Component {

  constructor(props) {
      super(props);

      this.state = {};

      Navigation.set(this, {
          title: 'New Thread',
          buttons: [
              { icon: 'user', id: 'logout' }
          ]
      });

      this.reload();
  }


}
