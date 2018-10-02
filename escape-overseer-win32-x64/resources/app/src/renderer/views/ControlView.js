import React, { Component } from 'react';
import TimerControl from '../components/TimerControl';
import ClueSelectControl from '../components/ClueSelectControl';
import ClueCountControl from '../components/ClueCountControl';
import LiveViewControl from '../components/LiveViewControl';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import App from 'grommet/components/App';


class ControlView extends Component {
  render() {
    return (
        <Tabs activeIndex={0}>
          <Tab title='Control Screen'>
              <LiveViewControl />
              <TimerControl />
              <ClueCountControl />
              <ClueSelectControl />
          </Tab>
          <Tab title='Report'>

          </Tab>
        </Tabs>
    );
  }
}

export default ControlView;
