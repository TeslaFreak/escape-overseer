import React, { Component } from 'react';
import EventConfigView from '../views/EventConfigView';
import ClueConfigView from '../views/ClueConfigView';
import LiveScreenConfigView from '../views/LiveScreenConfigView';
import Typography from '@material-ui/core/Typography';
import RoomSelectionView from '../views/RoomSelectionView';
var WebFont = window.require('webfontloader');

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

  componentDidMount() {
    this.props.changeTab(null, 0);
  }

  render() {
    return (
      this.props.selectedRoomId==null ? 
        <React.Fragment>
          <RoomSelectionView changeRoom={this.props.changeRoom}/>
        </React.Fragment> :
        <React.Fragment>
          <TabContainer tabValue={this.props.tabValue} containerValue={0}>
            <LiveScreenConfigView selectedRoomId={this.props.selectedRoomId}/>
          </TabContainer>
          <TabContainer tabValue={this.props.tabValue} containerValue={1}>
            <ClueConfigView selectedRoomId={this.props.selectedRoomId}/>
          </TabContainer>
          <TabContainer tabValue={this.props.tabValue} containerValue={2}>
            <EventConfigView />
          </TabContainer>
        </React.Fragment>
    );
  }
}

export default ControlView;