import React, { Component } from 'react';
import TimerControl from '../components/TimerControl';
import ClueSelectControl from '../components/ClueSelectControl';
import ClueCountControl from '../components/ClueCountControl';
import LiveViewControl from '../components/LiveViewControl';
import Tabs from '../components/Tabs';
import Tab from '../components/Tab'
import ReportView from './ReportView';


class ControlView extends Component {  
  render() {
    return (
        <Tabs >
          <Tab title='Control Screen'>
            <div >
              <LiveViewControl />
              <TimerControl />
              <ClueCountControl />
              <ClueSelectControl />
            </div>
          </Tab>
          <Tab title='Report'>
            <div>
              <ReportView />
            </div>
          </Tab>
        </Tabs>
    );
  }
}

export default ControlView;