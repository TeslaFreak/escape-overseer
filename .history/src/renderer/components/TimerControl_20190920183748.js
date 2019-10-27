import React, { Component } from 'react';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import Box from 'grommet/components/Box';
import IconButton from '@material-ui/core/IconButton';
import PlayFillIcon from '@material-ui/icons/PlayArrow';
import PauseFillIcon from '@material-ui/icons/Pause';
import AddIcon from '@material-ui/icons/Add';
import SubtractIcon from '@material-ui/icons/Remove';
import ReplayIcon from '@material-ui/icons/Replay';
import TimeDisplay from './TimeDisplay';
import Button from '@material-ui/core/Button';
const electron = window.require('electron')

class TimerControl extends React.Component{
  constructor(props) {
    super(props);
    this.state = {startingMinutes: 60,
                  minutes: 60,
                  seconds: 0,
                  paused: true,
                  timeToAdjust: 0};
    
  }

  loadJSON = async () => {
    this.db.get(this.props.selectedRoomId + '\\liveScreen').then(function(doc) {
        this.setState({minutes: doc.totalTime, startingMinutes: doc.totalTime});
    }.bind(this)).catch(function (err) {
        console.log(err);
    }.bind(this))
};

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  componentDidUpdate() {
    electron.ipcRenderer.send('updateLiveViewTimeDisplay', this.state.minutes, this.state.seconds);
  }

  tick() {
    var sec = this.state.seconds;
    var min = this.state.minutes;

    if(this.state.paused == true) {
      return;
    }
    else if (min <= 0 && sec <= 0) {
      this.setState({paused: true});
    }
    else {
      if (sec>0) {
        sec--;
      }
      else {
        sec = 59;
        min--;
      }
      this.setState({seconds: sec, minutes: min});
    }
  }
  
  handlePause = () => {
    this.setState({paused: !this.state.paused});
  }

  resetTimer = () => {
    this.setState({paused: true, minutes: 60, seconds:0, timeToAdjust: 0});
  }

  addTime = () => {
    this.setState({timeToAdjust: this.state.timeToAdjust+1});
  }

  subtractTime = () => {
    this.setState({timeToAdjust: this.state.timeToAdjust-1});
  }

  makeAdjustmentLive = () => {
    var sec = this.state.seconds;
    var min = this.state.minutes;
    var adjustment = this.state.timeToAdjust;

    if(min+adjustment<0) {
      this.setState({minutes: 0, seconds:0});
    }
    else {
      this.setState({minutes: min+adjustment});
    }
    this.setState({timeToAdjust: 0});
  }

  timeIsUp() {
    return (this.state.minutes <=0 && this.state.seconds <= 0);
  }

  render() {
    return (
      <Box direction='row'
            justify='center'
            align='center'
            pad='small'
            margin='small'>
          {!this.timeIsUp() && <IconButton onClick={this.subtractTime}><SubtractIcon style={{width:48, height:'100%'}}/></IconButton>}
              <Meter
                label = {<Box direction="column"
                              justify='center'
                              align='center'
                              pad='small'
                              margin='small'>
                          <IconButton onClick={this.resetTimer}><ReplayIcon style={{width:40, height:'100%'}}/></IconButton>
                          <TimeDisplay minutes={this.state.minutes} seconds={this.state.seconds}/>
                              <Box style={{visibility:this.state.timeToAdjust == 0 ? 'hidden' : ''}}>
                                <Value value={(this.state.timeToAdjust>=0 && '+') + this.state.timeToAdjust + ":00"} size='xsmall' colorIndex='unknown' />
                                <Button color="secondary" variant="outlined" onClick={this.makeAdjustmentLive}>Update Time?</Button>
                              </Box>
                            <Box >{!this.timeIsUp() && <IconButton onClick={this.handlePause}>{this.state.paused ? <PlayFillIcon style={{width:58, height:'100%'}}/> : <PauseFillIcon style={{width:58, height:'100%'}}/>} </IconButton>}</Box>
                        </Box>}
                value = {this.state.minutes*60+this.state.seconds}
                type='circle'
                max={3600}
                size='medium' />
                {!this.timeIsUp() && <IconButton onClick={this.addTime}><AddIcon style={{width:48, height:'100%'}}/></IconButton>}
        </Box>
    );
  }
}

export default TimerControl;
