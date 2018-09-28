import React, { Component } from 'react';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import Box from 'grommet/components/Box';
import PlayFillIcon from 'grommet/components/icons/base/PlayFill';
import PauseFillIcon from 'grommet/components/icons/base/PauseFill';
import AddIcon from 'grommet/components/icons/base/Add';
import SubtractIcon from 'grommet/components/icons/base/Subtract';
import RefreshIcon from 'grommet/components/icons/base/Refresh';
import TimeDisplay from './TimeDisplay';
import { RotateLeft } from 'grommet-icons';
import Button from 'grommet/components/Button';
const electron = window.require('electron')

class TimerControl extends React.Component{
  constructor(props) {
    super(props);
    this.state = {minutes: 0,
                  seconds: 10,
                  paused: true,
                  timeToAdjust: 0};
    
  }

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
          {!this.timeIsUp() && <Button icon={<SubtractIcon size='medium'/>} onClick={this.subtractTime} />}
              <Meter
                label = {<Box direction="column"
                              justify='center'
                              align='center'
                              pad='small'
                              margin='small'>
                          <Button icon={<RotateLeft size='large' style={{width:30, height:'100%'}}/>} onClick={this.resetTimer} />
                          <TimeDisplay minutes={this.state.minutes} seconds={this.state.seconds}/>
                            {this.state.timeToAdjust!=0 &&
                              <Box margin='small'>
                                <Value value={(this.state.timeToAdjust>=0 && '+') + this.state.timeToAdjust + ":00"} size='xsmall' colorIndex='unknown' />
                                <Button label="Update Time?" onClick={this.makeAdjustmentLive} style={{fontSize:12, padding:0 }}/>
                              </Box>}
                            <Box >{!this.timeIsUp() && <Button icon={this.state.paused ? <PlayFillIcon size='medium'/> : <PauseFillIcon size='medium'/>} onClick={this.handlePause} />}</Box>
                        </Box>}
                value = {this.state.minutes*60+this.state.seconds}
                type='circle'
                max={3600}
                size='medium' />
                {!this.timeIsUp() && <Button icon={<AddIcon size='medium'/>} onClick={this.addTime} />}
        </Box>
    );
  }
}

export default TimerControl;
