import React, { Component } from 'react';
import './App.css';
import TimerControl from './TimerControl';
import ClueSelectControl from './ClueSelectControl';
import ClueCountControl from './ClueCountControl';
import LiveViewControl from './LiveViewControl';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import 'grommet/grommet.min.css';
import App from 'grommet/components/App'


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
