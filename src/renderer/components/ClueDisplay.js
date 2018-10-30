import React, { Component } from 'react';
import Value from 'grommet/components/Value';
import { Grid } from '@material-ui/core';
const electron = window.require('electron')
class Timer extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid margin='large'><Value value={this.props.clue} size='large'/></Grid>
    );
  }
}

export default Timer;
