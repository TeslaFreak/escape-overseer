import React, { Component } from 'react';
import EventConfigView from '../views/EventConfigView';
import ClueConfigView from '../views/ClueConfigView';
import LiveScreenEditorView from '../views/LiveScreenEditorView';
import Typography from '@material-ui/core/Typography';
import RoomSelectionView from '../views/RoomSelectionView';
import { withStyles, withTheme } from '@material-ui/core/styles';
var WebFont = window.require('webfontloader');


const styles = theme => ({
  contentPadding: {
      padding: theme.spacing.unit * 3,
  }
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{display: props.tabValue==props.containerValue ? 'block' : 'none'}}>
      {props.children}
    </Typography>
  );
}

class RoomConfigView extends Component {  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.changeTab(null, 0);
  }

  render() {
    const { classes } = this.props;
    return (
      this.props.selectedRoomId==null ? 
        <React.Fragment>
          <RoomSelectionView changeRoom={this.props.changeRoom}/>
        </React.Fragment> :
        <React.Fragment >
          <TabContainer tabValue={this.props.tabValue} containerValue={0}>
            <LiveScreenEditorView selectedRoomId={this.props.selectedRoomId}/>
          </TabContainer>
          <TabContainer tabValue={this.props.tabValue} containerValue={1}>
            <div className={classes.contentPadding}>  
              <ClueConfigView selectedRoomId={this.props.selectedRoomId}/>
            </div>
          </TabContainer>
          {/*<TabContainer tabValue={this.props.tabValue} containerValue={2}>
                <EventConfigView selectedRoomId={this.props.selectedRoomId}/>
            </TabContainer>*/}
        </React.Fragment>
    );
  }
}

export default withStyles(styles)(RoomConfigView);