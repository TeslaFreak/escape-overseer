import React, { Component } from 'react';
import TimerControl from '../components/TimerControl';
import ClueSelectControl from '../components/ClueSelectControl';
import VisualClueCountControl from '../components/VisualClueCountControl';
import NumericClueCountControl from '../components/NumericClueCountControl';
import LiveViewControl from '../components/LiveViewControl';
import RoomSelectionView from './RoomSelectionView';
import Typography from '@material-ui/core/Typography';
import Tabs from '../components/Tabs';
import Tab from '../components/Tab'
import ReportView from './ReportView';
import PouchDataManager from '../PouchDataManager';
import { withStyles, withTheme } from '@material-ui/core/styles';
const electron = window.require('electron');

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
    this.state = {totalTime: 60,
                  numberOfClues: 3}
    this.db = PouchDataManager.localDB;
  }

  loadJSON = async () => {
    console.log("loading json")
    this.db.get(electron.remote.getGlobal('customerEmail') + '/' + this.props.selectedRoomId + '/liveScreen').then(function(doc) {
        this.setState({totalTime: doc.totalTime ? parseInt(doc.totalTime) : 60, 
                        numberOfClues: doc.numberOfClues ? parseInt(doc.numberOfClues) : 3,
                        counterType: doc.counterType || null});
      }.bind(this)).catch(function (err) {
        console.log("control view error")
        console.log(err);
      }.bind(this))
  };
  
  componentDidUpdate(prevProps) {
      if(prevProps.selectedRoomId !== this.props.selectedRoomId){
          this.loadJSON();
      }
  }

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
                <TimerControl totalTime={this.state.totalTime}/>
                {this.state.counterType == 'visualCounter' &&
                <VisualClueCountControl numberOfClues={this.state.numberOfClues}/>}
                {this.state.counterType == 'numericCounter' &&
                <NumericClueCountControl numberOfClues={this.state.numberOfClues}/>}
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