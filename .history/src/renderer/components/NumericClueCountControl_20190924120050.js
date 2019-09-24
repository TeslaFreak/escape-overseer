import React, { Component } from 'react';
import LockIcon from '@material-ui/icons/Lock';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
const electron = window.require('electron');


class NumericClueCountControl extends React.Component{
  constructor(props) {
    super(props);
    this.state = {liveClueCount: this.props.numberOfClues};
    
  }

  componentDidUpdate() {
    electron.ipcRenderer.send('updateLiveViewClueCountDisplay', this.state.liveClueCount);
  }

  handleChange = (event, value) => {
    this.setState({liveClueCount: value});
  }

  render() {
    return (
      <Grid container direction='row' justify='center'>
            <Typography className={classes.controlElementLabel}>Clue Count</Typography>
            <TextField type="number" value={this.state.liveClueCount} onChange={(event) => this.handleChange(event, event.target.value)}/>
      </Grid>
    );
  }
}

export default NumericClueCountControl;
