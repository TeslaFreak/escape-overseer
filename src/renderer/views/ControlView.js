import React, { Component } from 'react';
import TimerControl from '../components/TimerControl';
import ClueSelectControl from '../components/ClueSelectControl';
import ClueCountControl from '../components/ClueCountControl';
import LiveViewControl from '../components/LiveViewControl';
import Typography from '@material-ui/core/Typography';
import Tabs from '../components/Tabs';
import Tab from '../components/Tab'
import ReportView from './ReportView';

function TabContainer(props) {
  return (
    <Typography component="div" style={{display: props.tabValue==props.containerValue ? 'block' : 'none'}}>
      {props.children}
    </Typography>
  );
}

class ControlView extends Component {  
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <React.Fragment>
          <TabContainer tabValue={this.props.tabValue} containerValue={0}>
              <LiveViewControl />
              <TimerControl />
              <ClueCountControl />
              <ClueSelectControl />
          </TabContainer>
          <TabContainer tabValue={this.props.tabValue} containerValue={1}>
            <ReportView />
          </TabContainer>
        </React.Fragment>
    );
  }
}

export default ControlView;