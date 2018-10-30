import React, { Component } from 'react';
import LockIcon from '@material-ui/icons/Lock';
import ClearIcon from '@material-ui/icons/Clear';
import Box from 'grommet/components/Box';
import { Grid } from '@material-ui/core';
const electron = window.require('electron');

class ClueCountDisplay extends React.Component{
  constructor(props) {
    super(props);
  }

  getIconFromStatus = (isUsed) => {
    return isUsed? <ClearIcon style={{width:120, height:'100%'}}/> : <LockIcon style={{width:120, height:'100%'}}/>;
  }

  render() {
    return (
      <Grid container direction='row' justify='center' align='center' alignItems='center'>
        <Grid item margin = 'small'>{this.getIconFromStatus(this.props.clue1Used)}</Grid>
        <Grid item margin = 'small'>{this.getIconFromStatus(this.props.clue2Used)}</Grid>
        <Grid item margin = 'small'>{this.getIconFromStatus(this.props.clue3Used)}</Grid>
      </Grid>
    );
  }
}

export default ClueCountDisplay;
