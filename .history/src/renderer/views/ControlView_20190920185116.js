import React, { Component } from 'react';
import TimerControl from '../components/TimerControl';
import ClueSelectControl from '../components/ClueSelectControl';
import ClueCountControl from '../components/ClueCountControl';
import LiveViewControl from '../components/LiveViewControl';
import RoomSelectionView from './RoomSelectionView';
import Typography from '@material-ui/core/Typography';
import Tabs from '../components/Tabs';
import Tab from '../components/Tab'
import ReportView from './ReportView';
import { withStyles, withTheme } from '@material-ui/core/styles';

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

class ControlView extends Component {  
  constructor(props) {
    super(props);
    this.db = new PouchDB('kittens');
  }

  loadJSON = async () => {
    this.db.get(this.props.selectedRoomId + '\\liveScreen').then(function(doc) {
        console.log(doc.totalTime);
        this.setState({totalTime: doc.totalTime, numberOfClues: doc.numberOfClues});
      }.bind(this)).catch(function (err) {
        console.log(err);
      }.bind(this))
  };  

  componentDidMount() {
    this.props.changeTab(null, 0);
    this.loadJSON();
  }

  render() {
    const { classes } = this.props;
    return (
          this.props.selectedRoomId==null ? 
            <React.Fragment>
              <RoomSelectionView changeRoom={this.props.changeRoom}/>
            </React.Fragment> :
          <div className={classes.contentPadding}>
            <TabContainer tabValue={this.props.tabValue} containerValue={0}>
                <LiveViewControl selectedRoomId={this.props.selectedRoomId}/>
                <TimerControl selectedRoomId={this.props.selectedRoomId}/>
                <ClueCountControl />
                <ClueSelectControl selectedRoomId={this.props.selectedRoomId}/>
            </TabContainer>
            <TabContainer tabValue={this.props.tabValue} containerValue={1}>
              <ReportView />
            </TabContainer>
          </div>
    );
  }
}

export default withStyles(styles)(ControlView);