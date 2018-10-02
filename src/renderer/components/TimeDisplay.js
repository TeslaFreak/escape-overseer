import React, { Component } from 'react';
import Value from 'grommet/components/Value';
import Box from 'grommet/components/Box';
const electron = window.require('electron')
class Timer extends React.Component{
  constructor(props) {
    super(props);
  }

  timeIsUp() {
    return (this.props.minutes <=0 && this.props.seconds <= 0);
  }
  
  getTimeDisplay() {
    return this.timeIsUp() ?
      ("Game Over!") :
      (this.props.minutes.toString().padStart(2,0)+":"+this.props.seconds.toString().padStart(2,0));
  }

  render() {
    return (
      <Box margin='small'><Value value={this.getTimeDisplay()} size='large'/></Box>
    );
  }
}

export default Timer;
