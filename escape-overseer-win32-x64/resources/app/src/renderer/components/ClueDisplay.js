import React, { Component } from 'react';
import Value from 'grommet/components/Value';
import Box from 'grommet/components/Box';
const electron = window.require('electron')
class Timer extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box margin='small'><Value value={this.props.clue} size='large'/></Box>
    );
  }
}

export default Timer;
