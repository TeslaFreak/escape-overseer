import React, { Component } from 'react';
import EventConfigView from '../views/EventConfigView';
import LiveScreenConfigView from '../views/EventConfigView2';
import Typography from '@material-ui/core/Typography';

function TabContainer(props) {
  return (
    <Typography component="div" style={{height: '80vh', display: props.tabValue==props.containerValue ? 'block' : 'none'}}>
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
            <EventConfigView />
          </TabContainer>
          <TabContainer tabValue={this.props.tabValue} containerValue={1}>
            <LiveScreenConfigView />
          </TabContainer>
        </React.Fragment>
    );
  }
}

export default ControlView;