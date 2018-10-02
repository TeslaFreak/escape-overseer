import React, { Component } from 'react';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import App from 'grommet/components/App';


class ControlView extends Component {
  render() {
    return (
        <Tabs activeIndex={0}>
          <Tab title='Control Screen'>
          </Tab>
          <Tab title='Report'>

          </Tab>
        </Tabs>
    );
  }
}

export default ControlView;
