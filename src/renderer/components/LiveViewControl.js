import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
const electron = window.require('electron')

class LiveViewControl extends React.Component{
  constructor(props) {
    super(props);
    this.state={liveViewOpen:false}
  }

  startRoomSequence = () => {
    electron.ipcRenderer.send("roomSequence", 1);
  }

  toggleFullscreen = () => {
    electron.ipcRenderer.send("toggleLiveViewFullScreen");
  }

  createWindow = () => {
    electron.ipcRenderer.send("toggleLiveViewOpen", this.props.selectedRoomId);
    this.setState({liveViewOpen: !this.state.liveViewOpen});
  };

  render() {
    return (
        <Grid container direction='row' justify='center' alignItems='center' style={{padding:20}}>
          <Button variant="contained" color='secondary' onClick={this.startRoomSequence} >Start Room Sequence</Button>
          <Button variant="contained" color='secondary' onClick={this.createWindow} >{this.state.liveViewOpen ? 'Close' : 'Open'} Live Screen</Button>
          <Button variant="contained" color='secondary' onClick={this.toggleFullscreen} >Make Full Screen</Button>
        </Grid>
    );
  }
}

export default LiveViewControl;
